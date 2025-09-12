import { NextraImage } from "@app/_icons";
import { Footer as NextraFooter } from "nextra-theme-docs";
import { getDictionary } from "@app/_dictionaries/get-dictionary";

interface FooterProps {
  lang: string;
}

export async function Footer({ lang }: FooterProps) {
  const dictionary = await getDictionary(lang);

  return (
    <NextraFooter>
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
    </NextraFooter>
  );
}
