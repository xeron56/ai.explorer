import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "./_components/ThemeProvider";
import { Sidebar } from "./_components/Sidebar";
import { TopBar } from "./_components/TopBar";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ai.explorer — Exploring AI, one idea at a time", template: "%s · ai.explorer" },
  description: "Thoughts, research, and experiments on deep learning, mathematics, and the future of intelligence.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 lg:ml-[260px]">
              <TopBar />
              <main className="px-6 pb-10 md:px-10 lg:px-[64px] xl:px-[78px]">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
