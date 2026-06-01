import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import { FinanceHeader } from "./_components/FinanceHeader";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: { default: "Stock&Trade Blog", template: "%s · Stock&Trade" },
  description: "A finance-styled MDX blog for market analysis, investing ideas, and long-form insights.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${manrope.className} min-h-screen`}>
        <div className="min-h-screen">
          <FinanceHeader />
          <main className="px-6 pb-14 md:px-10 lg:px-[50px]">{children}</main>
        </div>
      </body>
    </html>
  );
}
