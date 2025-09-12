import { Link } from "nextra-theme-docs";
import { Banner as NextraBanner } from "nextra/components";
import { getDictionary } from "@app/_dictionaries/get-dictionary";

interface BannerProps {
  lang: string;
}

export async function Banner({ lang }: BannerProps) {
  const dictionary = await getDictionary(lang);

  // Fallback values in case banner translations are not available
  const bannerMessage = dictionary.banner?.message || "Nextra Doc Template 🚀";
  const readMoreText = dictionary.banner?.readMore || "Read more →";

  return (
    <NextraBanner storageKey="nextra-doc-template-banner">
      {bannerMessage}
      {"   "}
      <Link href="https://www.plasmocn.org">{readMoreText}</Link>
    </NextraBanner>
  );
}
