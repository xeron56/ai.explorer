import type { Metadata } from "next";

export const metadataConfig: Metadata = {
  description:
    "Nextra is a powerful static site generation framework built on Next.js. Create beautiful, content-focused documentation websites with Markdown and MDX with zero configuration needed.",
  title: {
    absolute: "Nextra Documentation Template",
    template: "%s | Nextra",
  },
  metadataBase: new URL("https://nextra-doc-template.vercel.app"),
  openGraph: {
    images:
      "https://assets.vercel.com/image/upload/v1678885707/nextra/og-image.png",
  },
  twitter: {
    site: "@esx_ai",
    card: "summary_large_image",
  },
  appleWebApp: {
    title: "Nextra",
  },
  other: {
    "msapplication-TileColor": "#000",
  },
};
