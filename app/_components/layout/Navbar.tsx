import { NextraIcon } from "@app/_icons";
import { Navbar as NextraNavbar, LocaleSwitch } from "nextra-theme-docs";
import { getDictionary } from "@app/_dictionaries/get-dictionary";

interface NavbarProps {
  lang: string;
}

export async function Navbar({ lang }: NavbarProps) {
  const dictionary = await getDictionary(lang);

  return (
    <NextraNavbar
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
    </NextraNavbar>
  );
}
