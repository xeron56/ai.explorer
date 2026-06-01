import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "./_components/ThemeProvider";
import { Sidebar } from "./_components/Sidebar";
import { TopBar } from "./_components/TopBar";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "code.explorer — Code. Solve. Conquer.", template: "%s · code.explorer" },
  description: "Programming tutorials, problem solutions, contest notes, and coding journey essays.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 lg:ml-[246px]">
              <TopBar />
              <main className="px-6 md:px-10 lg:px-[50px] pb-10">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
