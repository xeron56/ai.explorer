import type { SVGProps } from "react";
type IconProps = SVGProps<SVGSVGElement>;
const base = {
  width: 20, height: 20, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.8,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};
export function HomeIcon(p: IconProps) { return (<svg {...base} {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>); }
export function BlogIcon(p: IconProps) { return (<svg {...base} {...p}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>); }
export function ResearchIcon(p: IconProps) { return (<svg {...base} {...p}><path d="M12 3l4.5 4.5L12 12 7.5 7.5 12 3z" /><path d="M7.5 12 12 16.5 16.5 12" /><path d="M12 16.5V21" /></svg>); }
export function ProjectsIcon(p: IconProps) { return (<svg {...base} {...p}><rect x="4" y="9" width="16" height="11" rx="2" /><path d="M4 13h16M12 9v11M8.5 9C7.1 9 6 8.1 6 6.9 6 5.8 6.9 5 8 5c1.7 0 3 2 4 4 1-2 2.3-4 4-4 1.1 0 2 .8 2 1.9 0 1.2-1.1 2.1-2.5 2.1" /></svg>); }
export function LearningIcon(p: IconProps) { return (<svg {...base} {...p}><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M8 9h8M8 13h5" /><path d="M7 19v2M17 19v2" /></svg>); }
export function NotesIcon(p: IconProps) { return (<svg {...base} {...p}><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M9 8h6M9 16h3" /><path d="M14.5 12.5 16 11l1 1-1.5 1.5L13 14z" /></svg>); }
export function AboutIcon(p: IconProps) { return (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v.01M11 12h1v4h1" /></svg>); }
export function SearchIcon(p: IconProps) { return (<svg {...base} {...p}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.3-4.3" /></svg>); }
export function SunIcon(p: IconProps) { return (<svg {...base} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>); }
export function MoonIcon(p: IconProps) { return (<svg {...base} {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>); }
export function ArrowRightIcon(p: IconProps) { return (<svg {...base} {...p}><path d="M5 12h14M13 5l7 7-7 7" /></svg>); }
export function ClockIcon(p: IconProps) { return (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>); }
export function FileTextIcon(p: IconProps) { return (<svg {...base} {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>); }
export function MailIcon(p: IconProps) { return (<svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 7 9-7" /></svg>); }
export function GithubIcon(p: IconProps) { return (<svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" {...p}><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.18c-3.2.69-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.19-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.17a11.04 11.04 0 0 1 5.8 0c2.21-1.48 3.17-1.17 3.17-1.17.63 1.58.23 2.75.12 3.04.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.04.77 2.1v3.11c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" /></svg>); }
export function TwitterIcon(p: IconProps) { return (<svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" {...p}><path d="M18.244 2H21l-6.51 7.444L22.5 22h-6.844l-5.36-7.012L4.16 22H1.4l7.02-8.025L1.5 2h7l4.85 6.41L18.244 2zm-1.2 18.4h1.86L6.92 3.49H4.97L17.044 20.4z" /></svg>); }
export function RssIcon(p: IconProps) { return (<svg {...base} {...p}><path d="M5 5a14 14 0 0 1 14 14M5 12a7 7 0 0 1 7 7" /><circle cx="6" cy="18" r="1.5" fill="currentColor" /></svg>); }
export function LogoIcon(p: IconProps) { return (<svg viewBox="0 0 32 32" width={28} height={28} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" {...p}><path d="M5 7l11 18L27 7H5z" fill="currentColor" fillOpacity="0.15" /><path d="M5 7l11 18L27 7H5z" /></svg>); }
export function BrainIcon(p: IconProps) { return (<svg {...base} {...p}><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-1 5.7V15a3 3 0 0 0 4 2.8V20a2 2 0 0 0 4 0V4a2 2 0 0 0-4 0z" /><path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 1 5.7V15a3 3 0 0 1-4 2.8" /></svg>); }
export function ChartIcon(p: IconProps) { return (<svg {...base} {...p}><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 5-6" /></svg>); }
export function SigmaIcon(p: IconProps) { return (<svg {...base} {...p}><path d="M6 4h12l-7 8 7 8H6" /></svg>); }
export function SparklesIcon(p: IconProps) { return (<svg {...base} {...p}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" /><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" /></svg>); }
export function EyeIcon(p: IconProps) { return (<svg {...base} {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>); }
