import { Layout as NextraLayout, LastUpdated } from "nextra-theme-docs";
import { getDictionary } from "@app/_dictionaries/get-dictionary";
import { getPageMap } from "nextra/page-map";
import { pageMap as graphqlEslintPageMap } from "@app/[lang]/graphql-eslint/[[...slug]]/page";
import { pageMap as graphqlYogaPageMap } from "@app/[lang]/remote/graphql-yoga/[[...slug]]/page";

interface LayoutConfigProps {
  lang: string;
  banner: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export async function LayoutConfig({ lang, banner, navbar, footer, children }: LayoutConfigProps) {
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

  return (
    <NextraLayout
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
    </NextraLayout>
  );
}
