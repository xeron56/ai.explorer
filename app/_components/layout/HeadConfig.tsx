import { Head } from "nextra/components";

interface HeadConfigProps {
  lang: string;
}

export function HeadConfig({ lang }: HeadConfigProps) {
  return (
    <Head
      backgroundColor={{
        dark: "rgb(15,23,42)",
        light: "rgb(250, 250, 250)",
      }}
      color={{
        hue: { dark: 120, light: 220 },
        saturation: { dark: 100, light: 15 },
      }}
    />
  );
}
