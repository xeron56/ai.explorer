/* eslint-env node */
import { SwrIcon, NextraImage, NextraIcon } from "@app/_icons";
import type { Metadata } from "next";
import {
  Footer,
  LastUpdated,
  Layout,
  Link,
  LocaleSwitch,
  Navbar,
} from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import type { FC, ReactNode } from "react";
import { getDictionary, getDirection } from "../_dictionaries/get-dictionary";
import { pageMap as graphqlEslintPageMap } from "./graphql-eslint/[[...slug]]/page";
import { pageMap as graphqlYogaPageMap } from "./remote/graphql-yoga/[[...slug]]/page";
import "./styles.css";

export const metadata: Metadata = {
  description:
    "Nextra is a powerful static site generation framework built on Next.js. Create beautiful, content-focused documentation websites with Markdown and MDX with zero configuration needed.",
  title: {
    absolute: "Nextra Documentation Template",
    template: "%s | Nextra",
  },
  metadataBase: new URL("https://nextra-doc-template.vercel.app"),
  openGraph: {
    images:
      "https://assets.vercel.com/image/upload/v1572282926/swr/twitter-card.jpg",
  },
  twitter: {
    site: "@esx_ai",
    card: "summary_large_image",
  },
  appleWebApp: {
    title: "Nextra",
  },
  other: {
    "msapplication-TileColor": "#fff",
  },
};

type LayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{
    lang: string;
  }>;
}>;

const RootLayout: FC<LayoutProps> = async ({ children, params }) => {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  let pageMap = await getPageMap(`/${lang}`);

  if (lang === "en") {
    pageMap = [
      ...pageMap,
      {
        name: "remote",
        route: "/remote",
        children: [graphqlYogaPageMap],
        title: "Remote",
      },
      graphqlEslintPageMap,
    ];
  }
  const banner = (
    <Banner storageKey="swr-2">
      Nextra Doc Template 🚀{"   "}
      <Link href="https://www.plasmocn.org">Read more →</Link>
    </Banner>
  );
  const navbar = (
    <Navbar
      logo={
        <>
          <NextraIcon height="32" />
          <span
            className="ms-2 select-none font-extrabold text-2xl max-md:hidden"
            title={`Nextra: ${dictionary.logo.title}`}
          >
            Nextra
          </span>
        </>
      }
      projectLink="https://github.com/qianniuspace/nextra-doc-template"
      chatLink="https://discord.gg/9MzEY6jX"
    >
      <LocaleSwitch lite />
    </Navbar>
  );
  const footer = (
    <Footer>
      <div className="flex flex-col items-start gap-4">
        <a
          rel="noreferrer"
          target="_blank"
          className="x:focus-visible:nextra-focus flex items-center gap-2 font-semibold"
          href={"https://nextra.site/"}
        >
          {dictionary.poweredBy} <NextraImage height="20" />
        </a>
        <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          © {new Date().getFullYear()} 牵牛智慧 &{" "}
          <a
            href="https://x.com/intent/follow?screen_name=esx_ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            @esx_ai
          </a>{" "}
          .
        </span>
      </div>
    </Footer>
  );
  return (
    <html lang={lang} dir={getDirection(lang)} suppressHydrationWarning>
      <Head
        backgroundColor={{
          dark: "rgb(15,23,42)",
          light: "rgb(250, 250, 250)",
        }}
        color={{
          hue: { dark: 120, light: 220 }, // 将浅色模式的色调改为蓝色系
          saturation: { dark: 100, light: 15 }, // 降低浅色模式的饱和度
        }}
      />
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          footer={footer}
          docsRepositoryBase="https://github.com/qianniuspace/nextra-doc-template"
          i18n={[
            { locale: "en", name: "English" },
            { locale: "zh", name: "简体中文" },
            { locale: "es", name: "Español RTL" },
            { locale: "ru", name: "Русский" },
          ]}
          sidebar={{
            defaultMenuCollapseLevel: 1,
            autoCollapse: true,
          }}
          toc={{
            backToTop: dictionary.backToTop,
            extraContent: (
              // eslint-disable-next-line @next/next/no-img-element -- we can't use with external urls
              <img alt="placeholder cat" src="https://placecats.com/300/200" />
            ),
          }}
          editLink={dictionary.editPage}
          pageMap={pageMap}
          nextThemes={{ defaultTheme: "dark" }}
          lastUpdated={<LastUpdated>{dictionary.lastUpdated}</LastUpdated>}
          themeSwitch={{
            dark: dictionary.dark,
            light: dictionary.light,
            system: dictionary.system,
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
