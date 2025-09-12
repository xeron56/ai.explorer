/* eslint-env node */

import { Banner } from "@app/_components/layout/Banner";
import { Navbar as CustomNavbar } from "@app/_components/layout/Navbar";
import { Footer as CustomFooter } from "@app/_components/layout/Footer";
import { HeadConfig } from "@app/_components/layout/HeadConfig";
import { LayoutConfig } from "@app/_components/layout/LayoutConfig";
import { metadataConfig } from "@app/_config/metadata";

import type { FC, ReactNode } from "react";
import { getDirection } from "../_dictionaries/get-dictionary";
import "./styles.css";

export const metadata = metadataConfig;

type LayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{
    lang: string;
  }>;
}>;

const RootLayout: FC<LayoutProps> = async ({ children, params }) => {
  const { lang } = await params;
  const banner = <Banner lang={lang} />;
  const navbar = <CustomNavbar lang={lang} />;
  const footer = <CustomFooter lang={lang} />;
  return (
    <html lang={lang} dir={getDirection(lang)} suppressHydrationWarning>
      <HeadConfig lang={lang} />
      <body>
        <LayoutConfig
          lang={lang}
          banner={banner}
          navbar={navbar}
          footer={footer}
        >
          {children}
        </LayoutConfig>
      </body>
    </html>
  );
};

export default RootLayout;
