import Link from "next/link";
import { notFound } from "next/navigation";
import { getAboutProfile, type AboutInterest, type AboutTool } from "../_lib/posts";
import { GithubIcon, MailIcon } from "../_components/icons";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const profile = await getAboutProfile();
  if (!profile) notFound();

  return (
    <div className="mx-auto max-w-[1050px] pb-12 pt-[33px]">
      <section className="grid gap-[58px] pb-[48px] lg:grid-cols-[minmax(0,455px)_1fr]">
        <div>
          <h1 className="text-[31px] font-extrabold tracking-[-0.03em] text-[#10172d]">
            About <span className="bg-gradient-to-r from-[#5a34f4] to-[#704cff] bg-clip-text text-transparent">ai.explorer</span>
          </h1>
          <p className="mt-[26px] max-w-[425px] text-[15px] leading-[29px] text-[#10172d]">{profile.intro}</p>
          <div className="mt-[46px] rounded-[8px] border bg-[#faf7ff] p-[26px] shadow-[0_12px_28px_rgba(91,53,244,0.04)]" style={{ borderColor: "#eee7ff" }}>
            <div className="text-[26px] font-black leading-none text-[var(--color-accent-strong)]">“</div>
            <p className="mt-[13px] max-w-[315px] text-[17px] font-semibold leading-[29px] text-[#263458]">{profile.quote}</p>
            <div className="mt-[20px] text-[15px] font-bold text-[var(--color-accent-strong)]">- {profile.quoteAuthor}</div>
          </div>
        </div>

        <ProfileCard bio={profile.bio} location={profile.location} focus={profile.focus} experience={profile.experience} />
      </section>

      <section className="grid gap-[48px] border-y py-[38px] lg:grid-cols-2" style={{ borderColor: "var(--color-border)" }}>
        <div className="pr-6">
          <SectionTitle icon="rocket" title="My Mission" />
          <p className="mt-[28px] max-w-[560px] text-[14px] leading-[28px] text-[#10172d]">{profile.mission}</p>
        </div>
        <div className="border-l-0 lg:border-l lg:pl-[38px]" style={{ borderColor: "var(--color-border)" }}>
          <SectionTitle icon="clipboard" title="What I Do Here" />
          <ul className="mt-[24px] grid gap-[18px]">
            {profile.doing.map((item) => (
              <li key={item} className="flex items-center gap-[13px] text-[14px] font-medium text-[#10172d]">
                <CheckCircleIcon /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-[55px] border-b py-[34px] lg:grid-cols-[minmax(0,1fr)_330px]" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#10172d]">My Interests</h2>
          <div className="mt-[25px] grid gap-[14px] sm:grid-cols-2 lg:grid-cols-4">
            {profile.interests.map((interest) => <InterestCard key={interest.title} interest={interest} />)}
          </div>
        </div>
        <div>
          <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#10172d]">Tools I Use</h2>
          <div className="mt-[25px] grid grid-cols-2 gap-[13px]">
            {profile.tools.map((tool) => <ToolPill key={tool.name} tool={tool} />)}
          </div>
        </div>
      </section>

      <section className="border-b py-[35px]" style={{ borderColor: "var(--color-border)" }}>
        <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#10172d]">My Journey</h2>
        <div className="relative mt-[29px] grid gap-[10px]">
          <div className="absolute bottom-[22px] left-[13px] top-[22px] w-px bg-[#d8d0ff]" />
          {profile.journey.map((step) => (
            <div key={step.label} className="relative grid min-h-[58px] grid-cols-[190px_1fr] items-center overflow-hidden rounded-[8px] border bg-white" style={{ borderColor: "var(--color-border)" }}>
              <span className="absolute left-[8px] h-[12px] w-[12px] rounded-full border-[3px] border-white bg-[var(--color-accent-strong)] shadow-[0_0_0_1px_#d8d0ff]" />
              <span className="pl-[44px] text-[17px] font-extrabold text-[#263458]">{step.label}</span>
              <span className="border-l px-[25px] py-[18px] text-[13px] leading-[22px] text-[#44516a]" style={{ borderColor: "var(--color-border)" }}>{step.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-[38px] flex min-h-[106px] items-center gap-[25px] rounded-[8px] border bg-[#faf7ff] px-[32px]" style={{ borderColor: "#e5dbff" }}>
        <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#ebe5ff] text-[var(--color-accent-strong)]"><MailIcon width={28} height={28} /></span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[20px] font-extrabold text-[#10172d]">Let's Connect</h2>
          <p className="mt-[9px] text-[13px] leading-[22px] text-[#44516a]">I'm always open to discussions, collaborations, and new ideas.<br />Feel free to reach out!</p>
        </div>
        <div className="flex gap-[16px]">
          <a href={`mailto:${profile.email}`} className="inline-flex h-[46px] min-w-[182px] items-center justify-center gap-[11px] rounded-[7px] bg-gradient-to-r from-[#5a34f4] to-[#704cff] text-[13px] font-bold text-white shadow-[0_12px_24px_rgba(91,53,244,0.17)]">
            <MailIcon width={16} height={16} /> Send Email
          </a>
          <Link href={profile.github} className="inline-flex h-[46px] min-w-[182px] items-center justify-center gap-[11px] rounded-[7px] border bg-white text-[13px] font-bold text-[#10172d]" style={{ borderColor: "#bcb0ec" }}>
            <GithubIcon width={16} height={16} /> View GitHub
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProfileCard({ bio, location, focus, experience }: { bio: string; location: string; focus: string; experience: string }) {
  return (
    <article className="overflow-hidden rounded-[8px] border bg-white shadow-[0_12px_28px_rgba(15,23,42,0.035)]" style={{ borderColor: "var(--color-border)" }}>
      <div className="grid gap-[28px] p-[30px] md:grid-cols-[116px_1fr]">
        <Avatar />
        <p className="text-[15px] font-semibold leading-[29px] text-[#10172d]">{bio}</p>
      </div>
      <div className="grid border-t p-[27px] md:grid-cols-3" style={{ borderColor: "var(--color-border)" }}>
        <ProfileFact icon="pin" label="Location" value={location} />
        <ProfileFact icon="focus" label="Focus" value={focus} />
        <ProfileFact icon="bag" label="Experience" value={experience} />
      </div>
    </article>
  );
}

function Avatar() {
  return (
    <div className="relative h-[116px] w-[116px] overflow-hidden rounded-full bg-[#d6e4ff]">
      <div className="absolute left-1/2 top-[30px] h-[32px] w-[32px] -translate-x-1/2 rounded-full bg-[#c98952]" />
      <div className="absolute left-[28px] top-[23px] h-[24px] w-[60px] rounded-t-full bg-[#111827]" />
      <div className="absolute bottom-[12px] left-1/2 h-[54px] w-[74px] -translate-x-1/2 rounded-t-[34px] bg-[#253a68]" />
      <div className="absolute left-[43px] top-[47px] h-[3px] w-[3px] rounded-full bg-[#111827]" />
      <div className="absolute right-[43px] top-[47px] h-[3px] w-[3px] rounded-full bg-[#111827]" />
    </div>
  );
}

function ProfileFact({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[28px_1fr] gap-[12px] text-[13px]">
      <span className="mt-[3px] text-[var(--color-accent-strong)]"><SmallIcon type={icon} /></span>
      <span>
        <span className="block font-semibold text-[#59657b]">{label}</span>
        <span className="mt-[5px] block font-extrabold text-[#10172d]">{value}</span>
      </span>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 className="flex items-center gap-[13px] text-[21px] font-extrabold tracking-[-0.02em] text-[#10172d]">
      <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]"><SmallIcon type={icon} /></span>
      {title}
    </h2>
  );
}

function InterestCard({ interest }: { interest: AboutInterest }) {
  return (
    <article className="min-h-[210px] rounded-[8px] border bg-white p-[25px] text-center shadow-[0_8px_22px_rgba(15,23,42,0.03)]" style={{ borderColor: "var(--color-border)" }}>
      <span className={`mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-[8px] ${toneBg(interest.tone)} ${toneText(interest.tone)}`}>
        <SmallIcon type={interest.icon} />
      </span>
      <h3 className="mt-[21px] text-[14px] font-extrabold text-[#10172d]">{interest.title}</h3>
      <p className="mt-[13px] text-[12.5px] leading-[22px] text-[#44516a]">{interest.description}</p>
    </article>
  );
}

function ToolPill({ tool }: { tool: AboutTool }) {
  return (
    <div className="flex h-[47px] items-center gap-[13px] rounded-[7px] border bg-white px-[17px] text-[13px] font-bold text-[#10172d]" style={{ borderColor: "var(--color-border)" }}>
      <span className={toneText(tool.tone)}><SmallIcon type={tool.icon} /></span>
      {tool.name}
    </div>
  );
}

function CheckCircleIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5b35f4" strokeWidth="2.4"><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg>;
}

function SmallIcon({ type }: { type: string }) {
  if (type === "brain") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-1 5.7V15a3 3 0 0 0 4 2.8V20a2 2 0 0 0 4 0V4a2 2 0 0 0-4 0z" /><path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 1 5.7V15a3 3 0 0 1-4 2.8" /></svg>;
  if (type === "chart") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M3 20h18" /><path d="M7 17V9M12 17V5M17 17v-6" /><path d="m6 9 6-4 5 6" /></svg>;
  if (type === "rocket") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M5 15c-1 1-2 4-2 4s3-1 4-2" /><path d="M8 14 4 10l5-1 5-5c3-3 6-2 6-2s1 3-2 6l-5 5-1 5z" /><path d="m15 9-6 6" /></svg>;
  if (type === "lightbulb") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4z" /></svg>;
  if (type === "clipboard") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="6" y="5" width="12" height="16" rx="2" /><path d="M9 3h6v4H9z" /><path d="M9 12h6M9 16h6" /></svg>;
  if (type === "pin") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="2" /></svg>;
  if (type === "focus") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /></svg>;
  if (type === "bag") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="5" y="7" width="14" height="13" rx="2" /><path d="M9 7V5a3 3 0 0 1 6 0v2" /></svg>;
  if (type === "python") return <span className="text-[20px] font-black">Py</span>;
  if (type === "pytorch") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 22c4 0 7-3 7-7 0-3-2-5-4-7 .2 2-1 3.5-2.2 4.4C13 9 11 6 8 4c.4 4-3 6-3 11 0 4 3 7 7 7z" /></svg>;
  if (type === "tensorflow") return <span className="text-[22px] font-black">T</span>;
  if (type === "numpy") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M4 7.5 12 12l8-4.5" /><path d="M12 12v9" /></svg>;
  if (type === "pandas") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M6 4v16M18 4v16M11 7v10M13 5v4M13 15v4" /></svg>;
  if (type === "formula") return <span className="font-serif text-[18px] font-black">LaTeX</span>;
  if (type === "code") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" /></svg>;
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="9" /></svg>;
}

function toneBg(tone: string) {
  if (tone === "green") return "bg-emerald-50";
  if (tone === "orange" || tone === "amber") return "bg-orange-50";
  if (tone === "blue") return "bg-sky-50";
  if (tone === "red") return "bg-red-50";
  if (tone === "dark") return "bg-slate-100";
  return "bg-[var(--color-accent-soft)]";
}
function toneText(tone: string) {
  if (tone === "green") return "text-emerald-600";
  if (tone === "orange" || tone === "amber") return "text-orange-500";
  if (tone === "blue") return "text-sky-600";
  if (tone === "red") return "text-red-500";
  if (tone === "dark") return "text-slate-700";
  return "text-[var(--color-accent-strong)]";
}
