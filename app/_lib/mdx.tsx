import { compile, run } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import * as runtime from "react/jsx-runtime";
import type { ComponentType } from "react";

export async function compileMdx(source: string): Promise<ComponentType> {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    development: false,
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      [rehypeKatex, { strict: false }],
      [
        rehypePrettyCode,
        {
          theme: "dark-plus",
          keepBackground: false,
          defaultLang: {
            block: "python",
            inline: "python",
          },
        },
      ],
    ],
  });
  const mod = await run(String(compiled), {
    ...(runtime as object),
    baseUrl: import.meta.url,
  } as unknown as Parameters<typeof run>[1]);
  return mod.default as ComponentType;
}
