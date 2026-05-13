import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ai.explorer — Exploring AI, one idea at a time",
  description: "Thoughts, research, and experiments on deep learning, mathematics, and the future of intelligence.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
