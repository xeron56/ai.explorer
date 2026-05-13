type Variant = "rk" | "norm" | "diffusion" | "ssl";
export function PostThumbnail({ variant }: { title?: string; variant: Variant }) {
  if (variant === "rk") return <RKThumb />;
  if (variant === "norm") return <NormThumb />;
  if (variant === "diffusion") return <DiffusionThumb />;
  return <SSLThumb />;
}
function RKThumb() {
  return (
    <div className="w-full h-full bg-[#101d33] text-white flex items-center justify-center">
      <svg viewBox="0 0 220 160" className="w-[78%]">
        <g fontFamily="ui-monospace, monospace" fontSize="11" fill="#e8edff">
          <text x="76" y="22">Self Learning</text>
          <text x="14" y="60">R</text>
          <text x="14" y="86">K</text>
          <text x="14" y="112">V</text>
        </g>
        <g>
          {Array.from({ length: 6 }).map((_, c) => Array.from({ length: 6 }).map((_, r) => (
            <rect key={`${c}-${r}`} x={70 + c * 16} y={48 + r * 13} width="14" height="11" rx="1" fill="#6d5cff" fillOpacity={0.22 + ((c + r) % 5) * 0.14} />
          )))}
        </g>
        <g fontFamily="ui-monospace, monospace" fontSize="10" fill="#e8edff">
          <text x="176" y="115">Output</text>
          <text x="98" y="132">Softmax</text>
        </g>
        <defs>
          <marker id="arr1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#6d5cff" />
          </marker>
        </defs>
        <path d="M34 58 H66M34 86 H66M34 112 H66M166 86 H188" stroke="#b9c6ff" strokeWidth="1.2" markerEnd="url(#arr1)" fill="none" />
        <rect x="188" y="76" width="22" height="19" rx="2" fill="#e8edff" opacity="0.85" />
      </svg>
    </div>
  );
}
function NormThumb() {
  return (
    <div className="w-full h-full bg-[#f2edff] flex items-center justify-center">
      <svg viewBox="0 0 240 140" className="w-[80%]">
        <defs><marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6d5cff" /></marker></defs>
        <text x="14" y="74" fontSize="20" fontWeight="700" fill="#5b4fd6">x</text>
        <path d="M30 70 H66" stroke="#5b4fd6" strokeWidth="1.6" markerEnd="url(#arr2)" />
        <circle cx="86" cy="50" r="12" fill="#6d5cff" fillOpacity="0.85" />
        <text x="80" y="55" fontSize="13" fill="white" fontFamily="serif">μ</text>
        <circle cx="86" cy="90" r="12" fill="#6d5cff" fillOpacity="0.85" />
        <text x="80" y="95" fontSize="13" fill="white" fontFamily="serif">σ</text>
        <rect x="112" y="58" width="50" height="24" rx="5" fill="#3b2fbf" />
        <text x="125" y="74" fontSize="11" fontWeight="600" fill="white">Norm</text>
        <path d="M162 70 H198" stroke="#5b4fd6" strokeWidth="1.6" markerEnd="url(#arr2)" />
        <circle cx="214" cy="62" r="9" fill="#a89bff" />
        <text x="208" y="66" fontSize="10" fontFamily="serif" fill="#21184d">γ</text>
        <circle cx="214" cy="84" r="9" fill="#a89bff" />
        <text x="208" y="88" fontSize="10" fontFamily="serif" fill="#21184d">β</text>
        <path d="M226 70 H236" stroke="#5b4fd6" strokeWidth="1.6" />
        <text x="222" y="40" fontSize="18" fontWeight="700" fill="#5b4fd6">y</text>
      </svg>
    </div>
  );
}
function DiffusionThumb() {
  const pts = Array.from({ length: 80 }).map((_, i) => ({
    cx: 30 + ((i * 1543) % 180), cy: 20 + ((i * 919) % 120),
    r: 2 + (i % 5) * 0.4, c: ["#3aa472", "#5e8bff", "#7457f7"][(i * 7) % 3],
  }));
  return (
    <div className="w-full h-full bg-[#f7f5ea] flex items-center justify-center">
      <svg viewBox="0 0 240 160" className="w-[85%]">
        <path d="M28 132H210M30 132V24" stroke="#8390a3" strokeWidth="1.2" />
        <path d="M210 132l-6-4M210 132l-6 4M30 24l-4 6M30 24l4 6" stroke="#8390a3" strokeWidth="1.2" />
        {pts.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.c} fillOpacity="0.78" />)}
      </svg>
    </div>
  );
}
function SSLThumb() {
  return (
    <div className="w-full h-full bg-[#fff5e6] dark:bg-[#2a1f10] flex items-center justify-center">
      <svg viewBox="0 0 260 150" className="w-[88%]">
        <defs><marker id="arr4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#c98a36" /></marker></defs>
        <rect x="18" y="18" width="60" height="44" rx="6" fill="#fbd49a" />
        <text x="26" y="44" fontSize="10" fill="#4b3210">view1</text>
        <rect x="18" y="86" width="60" height="44" rx="6" fill="#fbd49a" />
        <text x="26" y="112" fontSize="10" fill="#4b3210">view2</text>
        <rect x="110" y="20" width="62" height="40" rx="5" fill="#f5b14a" />
        <text x="122" y="44" fontSize="10" fill="#3a2305" fontWeight="600">encoder</text>
        <rect x="110" y="88" width="62" height="40" rx="5" fill="#f5b14a" />
        <text x="122" y="112" fontSize="10" fill="#3a2305" fontWeight="600">encoder</text>
        <rect x="200" y="56" width="50" height="34" rx="5" fill="#c98a36" />
        <text x="206" y="78" fontSize="10" fill="white" fontWeight="600">similarity</text>
        <text x="208" y="40" fontSize="9.5" fill="#7a5210">score</text>
        <path d="M78 40 H110" stroke="#c98a36" strokeWidth="1.5" markerEnd="url(#arr4)" />
        <path d="M78 108 H110" stroke="#c98a36" strokeWidth="1.5" markerEnd="url(#arr4)" />
        <path d="M172 40 Q195 50 200 64" stroke="#c98a36" strokeWidth="1.5" markerEnd="url(#arr4)" fill="none" />
        <path d="M172 108 Q195 90 200 80" stroke="#c98a36" strokeWidth="1.5" markerEnd="url(#arr4)" fill="none" />
      </svg>
    </div>
  );
}
