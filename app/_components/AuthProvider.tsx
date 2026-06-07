"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  getDb,
  getFirebaseAuth,
  googleProvider,
  isFirebaseConfigured,
} from "../_lib/firebase";

export type UserPreferences = { theme?: "light" | "dark" | "system" };

type UserData = {
  bookmarks: string[];
  completed: string[];
  progress: Record<string, number>;
  preferences: UserPreferences;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  bookmarks: string[];
  completed: string[];
  progress: Record<string, number>;
  preferences: UserPreferences;
  isBookmarked: (slug: string) => boolean;
  isCompleted: (slug: string) => boolean;
  toggleBookmark: (slug: string) => void;
  toggleCompleted: (slug: string) => void;
  updateProgress: (slug: string, percent: number) => void;
  updatePreferences: (prefs: UserPreferences) => void;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const EMPTY: UserData = { bookmarks: [], completed: [], progress: {}, preferences: {} };

const BOOKMARK_KEY = "stocktrade-bookmarked-chapters";
const COMPLETED_KEY = "stocktrade-completed-chapters";
const PROGRESS_KEY = "stocktrade-chapter-progress";

const AuthContext = createContext<AuthContextValue | null>(null);

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserData>(EMPTY);
  const migratedRef = useRef(false);

  // Hydrate from localStorage for signed-out (or unconfigured) experience.
  useEffect(() => {
    if (user) return;
    setData({
      bookmarks: readLocal<string[]>(BOOKMARK_KEY, []),
      completed: readLocal<string[]>(COMPLETED_KEY, []),
      progress: readLocal<Record<string, number>>(PROGRESS_KEY, {}),
      preferences: {},
    });
  }, [user]);

  // Watch auth state.
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
      if (!next) migratedRef.current = false;
    });
  }, []);

  // Subscribe to the user's Firestore document while signed in.
  useEffect(() => {
    if (!user) return;
    const db = getDb();
    if (!db) return;
    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(ref, async (snap) => {
      if (!snap.exists()) {
        // First sign-in: seed the doc and migrate any local progress.
        const local = {
          bookmarks: readLocal<string[]>(BOOKMARK_KEY, []),
          completed: readLocal<string[]>(COMPLETED_KEY, []),
          progress: readLocal<Record<string, number>>(PROGRESS_KEY, {}),
        };
        migratedRef.current = true;
        await setDoc(ref, {
          profile: {
            displayName: user.displayName ?? "",
            email: user.email ?? "",
            photoURL: user.photoURL ?? "",
          },
          ...local,
          preferences: {},
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return;
      }
      const d = snap.data();
      setData({
        bookmarks: Array.isArray(d.bookmarks) ? d.bookmarks : [],
        completed: Array.isArray(d.completed) ? d.completed : [],
        progress: d.progress && typeof d.progress === "object" ? d.progress : {},
        preferences: d.preferences && typeof d.preferences === "object" ? d.preferences : {},
      });
    });
    return unsub;
  }, [user]);

  const userRef = useCallback(() => {
    const db = getDb();
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [user]);

  const toggleBookmark = useCallback(
    (slug: string) => {
      const ref = userRef();
      if (ref) {
        const has = data.bookmarks.includes(slug);
        void setDoc(
          ref,
          { bookmarks: has ? arrayRemove(slug) : arrayUnion(slug), updatedAt: serverTimestamp() },
          { merge: true },
        );
        return;
      }
      setData((prev) => {
        const next = prev.bookmarks.includes(slug)
          ? prev.bookmarks.filter((s) => s !== slug)
          : [...prev.bookmarks, slug];
        writeLocal(BOOKMARK_KEY, next);
        return { ...prev, bookmarks: next };
      });
    },
    [data.bookmarks, userRef],
  );

  const toggleCompleted = useCallback(
    (slug: string) => {
      const ref = userRef();
      if (ref) {
        const has = data.completed.includes(slug);
        void setDoc(
          ref,
          {
            completed: has ? arrayRemove(slug) : arrayUnion(slug),
            progress: has ? {} : { [slug]: 100 },
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        return;
      }
      setData((prev) => {
        const next = prev.completed.includes(slug)
          ? prev.completed.filter((s) => s !== slug)
          : [...prev.completed, slug];
        const progress = { ...prev.progress };
        if (next.includes(slug)) progress[slug] = 100;
        writeLocal(COMPLETED_KEY, next);
        writeLocal(PROGRESS_KEY, progress);
        return { ...prev, completed: next, progress };
      });
    },
    [data.completed, userRef],
  );

  const updateProgress = useCallback(
    (slug: string, percent: number) => {
      const pct = Math.max(0, Math.min(100, Math.round(percent)));
      // Only persist forward progress to avoid churn / regressions.
      if ((data.progress[slug] ?? 0) >= pct) return;
      const ref = userRef();
      if (ref) {
        void setDoc(
          ref,
          { progress: { [slug]: pct }, updatedAt: serverTimestamp() },
          { merge: true },
        );
        return;
      }
      setData((prev) => {
        const progress = { ...prev.progress, [slug]: pct };
        writeLocal(PROGRESS_KEY, progress);
        return { ...prev, progress };
      });
    },
    [data.progress, userRef],
  );

  const updatePreferences = useCallback(
    (prefs: UserPreferences) => {
      const ref = userRef();
      if (ref) {
        void setDoc(ref, { preferences: prefs, updatedAt: serverTimestamp() }, { merge: true });
        return;
      }
      setData((prev) => ({ ...prev, preferences: { ...prev.preferences, ...prefs } }));
    },
    [userRef],
  );

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error("Firebase is not configured yet. Add your project keys to .env.local.");
    }
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOutUser = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
      bookmarks: data.bookmarks,
      completed: data.completed,
      progress: data.progress,
      preferences: data.preferences,
      isBookmarked: (slug) => data.bookmarks.includes(slug),
      isCompleted: (slug) => data.completed.includes(slug),
      toggleBookmark,
      toggleCompleted,
      updateProgress,
      updatePreferences,
      signInWithGoogle,
      signOutUser,
    }),
    [user, loading, data, toggleBookmark, toggleCompleted, updateProgress, updatePreferences, signInWithGoogle, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
