import type { ReactNode } from "react";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("relative mx-auto max-w-[1280px] pb-8 pt-7", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top_right,_rgba(111,76,255,0.14),_transparent_44%),radial-gradient(circle_at_28%_20%,_rgba(250,204,21,0.1),_transparent_32%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Surface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "rounded-[24px] border border-[var(--color-border)] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PageHeading({
  badge,
  title,
  description,
  actions,
}: {
  badge?: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        {badge ? <div className="mb-4">{badge}</div> : null}
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-[#12182b] md:text-[42px]">
          {title}
        </h1>
        <p className="mt-3 max-w-[760px] text-[15px] leading-7 text-[#4f5e7a]">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function Tabs({
  items,
  active,
}: {
  items: string[];
  active: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-7 border-b border-[var(--color-border)] text-[15px] font-semibold text-[#55637f]">
      {items.map((item) => {
        const isActive = item === active;
        return (
          <button
            key={item}
            className={cx(
              "relative pb-4 transition-colors",
              isActive ? "text-[#5b35f4]" : "hover:text-[#1c2740]",
            )}
          >
            {item}
            {isActive ? (
              <span className="absolute bottom-[-1px] left-0 h-[2px] w-full rounded-full bg-[#5b35f4]" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function Toolbar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "mt-5 flex flex-col gap-3 rounded-[18px] border border-[var(--color-border)] bg-white/95 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.03)] lg:flex-row lg:items-center",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SearchField({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) {
  return (
    <label
      className={cx(
        "flex h-[46px] min-w-0 items-center gap-3 rounded-[14px] border border-[var(--color-border)] bg-white px-4 shadow-sm",
        className,
      )}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#627089]"
      >
        <circle cx="11" cy="11" r="6" />
        <path d="M20 20l-4.2-4.2" />
      </svg>
      <input
        placeholder={placeholder}
        className="w-full min-w-0 border-0 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#7b879b]"
      />
    </label>
  );
}

export function FilterSelect({
  label,
  wide,
}: {
  label: string;
  wide?: boolean;
}) {
  return (
    <button
      className={cx(
        "inline-flex h-[46px] items-center justify-between gap-5 rounded-[14px] border border-[var(--color-border)] bg-white px-4 text-[14px] font-semibold text-[#26334d]",
        wide ? "min-w-[170px]" : "min-w-[120px]",
      )}
    >
      <span>{label}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

export function RailCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Surface className={cx("p-5", className)}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[15px] font-extrabold text-[#111827]">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </Surface>
  );
}

export function MetricTile({
  value,
  label,
  icon,
  className,
}: {
  value: string;
  label: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-[20px] border border-[var(--color-border)] bg-white p-5 text-center shadow-[0_12px_30px_rgba(15,23,42,0.03)]",
        className,
      )}
    >
      {icon ? <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#f5f4ff] text-[#5b35f4]">{icon}</div> : null}
      <div className="text-[32px] font-extrabold tracking-[-0.03em] text-[#12182b]">{value}</div>
      <div className="mt-2 text-[13px] font-medium text-[#66758f]">{label}</div>
    </div>
  );
}

export function Tag({
  children,
  tone = "purple",
}: {
  children: ReactNode;
  tone?: "purple" | "green" | "orange" | "blue" | "red" | "slate";
}) {
  const styles = {
    purple: "bg-[#efeaff] text-[#5b35f4]",
    green: "bg-[#eafaf1] text-[#1f9c5c]",
    orange: "bg-[#fff3e5] text-[#f18b1f]",
    blue: "bg-[#eaf4ff] text-[#2370ea]",
    red: "bg-[#fff0f2] text-[#e34c67]",
    slate: "bg-[#f3f5f9] text-[#55637f]",
  };

  return (
    <span className={cx("inline-flex rounded-full px-3 py-1 text-[12px] font-bold", styles[tone])}>
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      className={cx(
        "inline-flex h-[46px] items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#5b35f4] to-[#754dff] px-5 text-[14px] font-bold text-white shadow-[0_16px_28px_rgba(91,53,244,0.2)] transition-transform hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      className={cx(
        "inline-flex h-[46px] items-center justify-center gap-2 rounded-[14px] border border-[var(--color-border)] bg-white px-5 text-[14px] font-semibold text-[#1d2740]",
        className,
      )}
    >
      {children}
    </button>
  );
}

