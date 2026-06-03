import { compile, run } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import * as runtime from "react/jsx-runtime";
import type { ComponentType, ElementType } from "react";

export type MdxComponents = Record<string, ElementType>;
export type MdxContent = ComponentType<{ components?: MdxComponents }>;

export async function compileMdx(source: string): Promise<MdxContent> {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    development: false,
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false }]],
  });
  const mod = await run(String(compiled), {
    ...(runtime as object),
    baseUrl: import.meta.url,
  } as unknown as Parameters<typeof run>[1]);
  return mod.default as ComponentType;
}
