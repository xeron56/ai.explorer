"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PiGraph, PiTreeStructure } from "react-icons/pi";
import { SiPytorch, SiTensorflow } from "react-icons/si";

export type TopicSeriesNavItem = {
  slug: string;
  title: string;
  icon: string;
  tone: string;
};

export function TopicSeriesLinks({ series }: { series: TopicSeriesNavItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSlug = pathname.startsWith("/learning")
    ? searchParams.get("series") ?? ""
    : "";

  return (
    <ul className="flex flex-col gap-[13px]">
      {series.map((item) => {
        const active = item.slug === activeSlug;

        return (
          <li key={item.slug}>
            <Link
              href={`/learning?series=${item.slug}`}
              className={`group flex h-[46px] items-center gap-[14px] rounded-[8px] px-[12px] text-[14px] font-semibold transition-colors ${
                active
                  ? "bg-[#23275c] text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={seriesIconClass(item.tone)}>
                <TopicIcon icon={item.icon} />
              </span>
              <span>{item.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function seriesIconClass(tone: string) {
  if (tone === "green") return "text-emerald-400";
  if (tone === "amber") return "text-orange-400";
  if (tone === "red") return "text-red-400";
  return "text-[#8a6bff]";
}

function TopicIcon({ icon }: { icon: string }) {
  if (icon === "cube") return <PiTreeStructure className="h-[18px] w-[18px]" />;
  if (icon === "tensorflow") return <SiTensorflow className="h-[17px] w-[17px]" />;
  if (icon === "flame") return <SiPytorch className="h-[17px] w-[17px]" />;
  return <PiGraph className="h-[18px] w-[18px]" />;
}
