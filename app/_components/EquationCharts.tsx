"use client";

import { type ReactNode } from "react";

/**
 * EquationCharts — code-generated, math-accurate SVG figures for the
 * "Equation That Beat Wall Street" article. Every curve below is computed from
 * the underlying mathematics (geometric Brownian motion, the normal
 * distribution, and the Black–Scholes–Merton formulas), not hand-drawn.
 *
 * Pure SVG + deterministic (seeded) randomness so server and client render
 * identically — no extra chart dependency and no hydration mismatch.
 */

export type EquationChartVariant =
  | "blackjack-edge"
  | "gbm-paths"
  | "normal-bell"
  | "call-payoff"
  | "delta-curve"
  | "delta-hedge"
  | "derivatives-growth";

const W = 760;
const H = 470;
const M = { top: 42, right: 30, bottom: 56, left: 64 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

const GRID = "#e9f0ec";
const AXIS = "#9aa9b2";
const GREEN = "#15924c";
const GREEN_SOFT = "#20d986";
const RED = "#df2424";
const INK = "#111827";
const SLATE = "#475569";

type Scale = (v: number) => number;
type Pt = [number, number];

function makeScale(d0: number, d1: number, p0: number, p1: number): Scale {
  return (v) => p0 + ((v - d0) / (d1 - d0)) * (p1 - p0);
}

function linspace(a: number, b: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
}

function path(points: Pt[], sx: Scale, sy: Scale): string {
  return points
    .map(([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(2)} ${sy(y).toFixed(2)}`)
    .join(" ");
}

// --- statistics ------------------------------------------------------------

function normPdf(x: number): number {
  return Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);
}

// Abramowitz & Stegun 7.1.26 approximation of the standard normal CDF.
function normCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp(-(x * x) / 2);
  const p =
    d *
    t *
    (0.319381530 +
      t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - p : p;
}

function d1d2(S: number, K: number, r: number, sig: number, T: number): [number, number] {
  const d1 = (Math.log(S / K) + (r + (sig * sig) / 2) * T) / (sig * Math.sqrt(T));
  return [d1, d1 - sig * Math.sqrt(T)];
}

function bsCall(S: number, K: number, r: number, sig: number, T: number): number {
  if (T <= 0) return Math.max(S - K, 0);
  const [d1, d2] = d1d2(S, K, r, sig, T);
  return S * normCdf(d1) - K * Math.exp(-r * T) * normCdf(d2);
}

function bsDelta(S: number, K: number, r: number, sig: number, T: number): number {
  return normCdf(d1d2(S, K, r, sig, T)[0]);
}

// Deterministic PRNG (mulberry32) + Box–Muller so GBM paths are stable.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rng: () => number): number {
  const u = Math.max(rng(), 1e-9);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// --- chart frame -----------------------------------------------------------

type Tick = { v: number; label: string };

function Plot({
  eyebrow,
  title,
  xLabel,
  yLabel,
  xDomain,
  yDomain,
  xTicks,
  yTicks,
  legend,
  note,
  children,
}: {
  eyebrow: string;
  title: string;
  xLabel: string;
  yLabel: string;
  xDomain: [number, number];
  yDomain: [number, number];
  xTicks: Tick[];
  yTicks: Tick[];
  legend?: { color: string; label: string; dash?: boolean }[];
  note?: string;
  children: (sx: Scale, sy: Scale) => ReactNode;
}) {
  const sx = makeScale(xDomain[0], xDomain[1], M.left, M.left + IW);
  const sy = makeScale(yDomain[0], yDomain[1], M.top + IH, M.top);

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-[22px] border border-[#d9e7dd] bg-white shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
      <div className="border-b border-[#eef3ef] px-5 pt-4 pb-3">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#15924c]">
          {eyebrow}
        </div>
        <h4 className="mt-1 text-[18px] font-extrabold tracking-[-0.02em] text-[#122131]">
          {title}
        </h4>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={title}>
        {/* horizontal gridlines + y ticks */}
        {yTicks.map((t) => (
          <g key={`y${t.v}`}>
            <line x1={M.left} x2={M.left + IW} y1={sy(t.v)} y2={sy(t.v)} stroke={GRID} strokeWidth={1} />
            <text x={M.left - 10} y={sy(t.v) + 4} textAnchor="end" fontSize={12} fill={SLATE}>
              {t.label}
            </text>
          </g>
        ))}
        {/* x ticks */}
        {xTicks.map((t) => (
          <g key={`x${t.v}`}>
            <line x1={sx(t.v)} x2={sx(t.v)} y1={M.top + IH} y2={M.top + IH + 5} stroke={AXIS} strokeWidth={1} />
            <text x={sx(t.v)} y={M.top + IH + 20} textAnchor="middle" fontSize={12} fill={SLATE}>
              {t.label}
            </text>
          </g>
        ))}
        {/* axes */}
        <line x1={M.left} x2={M.left + IW} y1={M.top + IH} y2={M.top + IH} stroke={AXIS} strokeWidth={1.4} />
        <line x1={M.left} x2={M.left} y1={M.top} y2={M.top + IH} stroke={AXIS} strokeWidth={1.4} />

        {children(sx, sy)}

        {/* axis labels */}
        <text x={M.left + IW / 2} y={H - 12} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={INK}>
          {xLabel}
        </text>
        <text
          x={16}
          y={M.top + IH / 2}
          textAnchor="middle"
          fontSize={12.5}
          fontWeight={700}
          fill={INK}
          transform={`rotate(-90 16 ${M.top + IH / 2})`}
        >
          {yLabel}
        </text>
      </svg>

      {(legend || note) && (
        <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#eef3ef] px-5 py-3 text-[12px] text-[#5f6f7f]">
          {legend?.map((l) => (
            <span key={l.label} className="inline-flex items-center gap-2 font-semibold text-[#2b3a49]">
              <span
                className="inline-block h-0 w-5 rounded"
                style={{
                  borderTop: `3px ${l.dash ? "dashed" : "solid"} ${l.color}`,
                }}
              />
              {l.label}
            </span>
          ))}
          {note && <span className="text-[#7a8895]">{note}</span>}
        </figcaption>
      )}
    </figure>
  );
}

// --- variants --------------------------------------------------------------

function BlackjackEdge() {
  const xs = linspace(-2, 6, 120);
  // Rule of thumb: each +1 of the true count adds ~0.5% edge; flat base ~ -0.5%.
  const edge: Pt[] = xs.map((tc) => [tc, -0.5 + 0.5 * tc]);
  const sx = makeScale(-2, 6, M.left, M.left + IW);
  const sy = makeScale(-2, 3.5, M.top + IH, M.top);
  const breakEven = 1; // edge crosses 0 at true count +1

  return (
    <Plot
      eyebrow="Figure 0 · Thorp at the blackjack table"
      title="Card counting converts information into an edge"
      xLabel="True count (high cards remaining per deck)"
      yLabel="Player edge (%)"
      xDomain={[-2, 6]}
      yDomain={[-2, 3.5]}
      xTicks={[-2, 0, 2, 4, 6].map((v) => ({ v, label: `${v}` }))}
      yTicks={[-2, -1, 0, 1, 2, 3].map((v) => ({ v, label: `${v}%` }))}
      legend={[
        { color: GREEN, label: "Player edge vs. count" },
        { color: RED, label: "Break-even (house edge gone)", dash: true },
      ]}
      note="Bet big only where the line is above zero."
    >
      {(psx, psy) => (
        <>
          {/* favorable zone shading */}
          <rect
            x={psx(breakEven)}
            y={M.top}
            width={psx(6) - psx(breakEven)}
            height={IH}
            fill={GREEN_SOFT}
            opacity={0.08}
          />
          <line x1={M.left} x2={M.left + IW} y1={psy(0)} y2={psy(0)} stroke={RED} strokeWidth={1.6} strokeDasharray="6 5" />
          <path d={path(edge, psx, psy)} fill="none" stroke={GREEN} strokeWidth={3} />
          <circle cx={psx(breakEven)} cy={psy(0)} r={5} fill={RED} />
          <text x={psx(breakEven) + 8} y={psy(0) - 10} fontSize={12} fontWeight={700} fill={RED}>
            edge turns positive
          </text>
          <text x={psx(4.2)} y={psy(2.6)} fontSize={12} fontWeight={700} fill={GREEN}>
            bet bigger here
          </text>
        </>
      )}
    </Plot>
  );
}

function GbmPaths() {
  const S0 = 100;
  const mu = 0.12;
  const sig = 0.25;
  const T = 1;
  const steps = 130;
  const dt = T / steps;
  const ts = linspace(0, T, steps + 1);

  const paths: Pt[][] = [11, 29, 47, 83, 101].map((seed) => {
    const rng = mulberry32(seed);
    let S = S0;
    return ts.map((t, i) => {
      if (i > 0) S *= Math.exp((mu - (sig * sig) / 2) * dt + sig * Math.sqrt(dt) * gauss(rng));
      return [t, S] as Pt;
    });
  });
  const drift: Pt[] = ts.map((t) => [t, S0 * Math.exp(mu * t)]);

  return (
    <Plot
      eyebrow="Figure 1 · The model of a stock"
      title="Random fluctuation plus a steady drift"
      xLabel="Time (fraction of a year)"
      yLabel="Stock price ($)"
      xDomain={[0, 1]}
      yDomain={[55, 200]}
      xTicks={[0, 0.25, 0.5, 0.75, 1].map((v) => ({ v, label: `${v}` }))}
      yTicks={[55, 90, 125, 160, 200].map((v) => ({ v, label: `$${v}` }))}
      legend={[
        { color: SLATE, label: "Simulated price paths (diffusion)" },
        { color: INK, label: "Expected trend (drift μ)", dash: true },
      ]}
      note="Geometric Brownian motion: dS = μS dt + σS dW."
    >
      {(sx, sy) => (
        <>
          {paths.map((p, i) => (
            <path
              key={i}
              d={path(p, sx, sy)}
              fill="none"
              stroke={["#7c8a99", "#94c7ad", "#a9b6c2", "#6fb38f", "#b6c0cb"][i]}
              strokeWidth={1.6}
              opacity={0.9}
            />
          ))}
          <path d={path(drift, sx, sy)} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="7 5" />
        </>
      )}
    </Plot>
  );
}

function NormalBell() {
  const xs = linspace(-4, 4, 160);
  const curve: Pt[] = xs.map((x) => [x, normPdf(x)]);
  const band: Pt[] = linspace(-1, 1, 60).map((x) => [x, normPdf(x)]);

  return (
    <Plot
      eyebrow="Figure 2 · The engine of the formula"
      title="The bell curve of (log) returns"
      xLabel="Standardized return (standard deviations)"
      yLabel="Probability density"
      xDomain={[-4, 4]}
      yDomain={[0, 0.45]}
      xTicks={[-3, -2, -1, 0, 1, 2, 3].map((v) => ({ v, label: `${v}σ` }))}
      yTicks={[0, 0.1, 0.2, 0.3, 0.4].map((v) => ({ v, label: v.toFixed(1) }))}
      legend={[{ color: GREEN, label: "Standard normal density φ(x)" }]}
      note="≈68% of outcomes fall within ±1σ (shaded)."
    >
      {(sx, sy) => (
        <>
          <path
            d={`${path(band, sx, sy)} L${sx(1)} ${sy(0)} L${sx(-1)} ${sy(0)} Z`}
            fill={GREEN_SOFT}
            opacity={0.16}
          />
          <line x1={sx(0)} x2={sx(0)} y1={sy(0)} y2={sy(normPdf(0))} stroke={SLATE} strokeWidth={1.4} strokeDasharray="4 4" />
          <path d={path(curve, sx, sy)} fill="none" stroke={GREEN} strokeWidth={3} />
        </>
      )}
    </Plot>
  );
}

function CallPayoff() {
  const K = 100;
  const r = 0.05;
  const sig = 0.25;
  const T = 0.6;
  const Ss = linspace(40, 160, 140);
  const payoff: Pt[] = Ss.map((S) => [S, Math.max(S - K, 0)]);
  const value: Pt[] = Ss.map((S) => [S, bsCall(S, K, r, sig, T)]);

  return (
    <Plot
      eyebrow="Figure 3 · What a call option is worth"
      title="Intrinsic payoff vs. the Black–Scholes price"
      xLabel="Stock price at valuation, S ($)"
      yLabel="Call value ($)"
      xDomain={[40, 160]}
      yDomain={[0, 65]}
      xTicks={[40, 70, 100, 130, 160].map((v) => ({ v, label: `$${v}` }))}
      yTicks={[0, 15, 30, 45, 60].map((v) => ({ v, label: `$${v}` }))}
      legend={[
        { color: INK, label: "Payoff at expiry max(S−K, 0)" },
        { color: GREEN, label: "Price before expiry (BSM)" },
      ]}
      note="The gap between the curves is time value."
    >
      {(sx, sy) => (
        <>
          <line x1={sx(K)} x2={sx(K)} y1={M.top} y2={M.top + IH} stroke={SLATE} strokeWidth={1.3} strokeDasharray="5 5" />
          <text x={sx(K) + 6} y={M.top + 16} fontSize={12} fontWeight={700} fill={SLATE}>
            strike K = $100
          </text>
          <path d={path(payoff, sx, sy)} fill="none" stroke={INK} strokeWidth={2.4} />
          <path d={path(value, sx, sy)} fill="none" stroke={GREEN} strokeWidth={3} />
        </>
      )}
    </Plot>
  );
}

function DeltaCurve() {
  const K = 100;
  const r = 0.05;
  const sig = 0.25;
  const T = 0.6;
  const Ss = linspace(40, 160, 140);
  const delta: Pt[] = Ss.map((S) => [S, bsDelta(S, K, r, sig, T)]);

  return (
    <Plot
      eyebrow="Figure 4 · The hedge ratio"
      title="Delta — how much stock the seller must hold"
      xLabel="Stock price, S ($)"
      yLabel="Delta  Δ = N(d₁)"
      xDomain={[40, 160]}
      yDomain={[0, 1]}
      xTicks={[40, 70, 100, 130, 160].map((v) => ({ v, label: `$${v}` }))}
      yTicks={[0, 0.25, 0.5, 0.75, 1].map((v) => ({ v, label: v.toFixed(2) }))}
      legend={[{ color: GREEN, label: "Δ = ∂V/∂S = N(d₁)" }]}
      note="Deep in the money Δ→1; deep out of the money Δ→0."
    >
      {(sx, sy) => (
        <>
          <line x1={sx(100)} x2={sx(100)} y1={M.top} y2={M.top + IH} stroke={SLATE} strokeWidth={1.2} strokeDasharray="5 5" />
          <path d={path(delta, sx, sy)} fill="none" stroke={GREEN} strokeWidth={3} />
          <circle cx={sx(100)} cy={sy(bsDelta(100, 100, r, sig, T))} r={5} fill={GREEN} />
        </>
      )}
    </Plot>
  );
}

function DeltaHedge() {
  const K = 100;
  const r = 0.05;
  const sig = 0.25;
  const T = 0.6;
  const S0 = 100;
  const C0 = bsCall(S0, K, r, sig, T);
  const d0 = bsDelta(S0, K, r, sig, T);
  const Ss = linspace(85, 115, 140);

  // Bob is short the call and long d0 shares (the hedge).
  const liability: Pt[] = Ss.map((S) => [S, bsCall(S, K, r, sig, T) - C0]); // what he owes
  const hedge: Pt[] = Ss.map((S) => [S, d0 * (S - S0)]); // his stock gain
  const net: Pt[] = Ss.map((S) => [S, d0 * (S - S0) - (bsCall(S, K, r, sig, T) - C0)]);

  return (
    <Plot
      eyebrow="Figure 5 · Why the risk disappears"
      title="Delta hedging flattens the seller's P&L"
      xLabel="Stock price, S ($)"
      yLabel="Profit / loss ($)"
      xDomain={[85, 115]}
      yDomain={[-12, 12]}
      xTicks={[85, 92.5, 100, 107.5, 115].map((v) => ({ v, label: `$${v}` }))}
      yTicks={[-12, -6, 0, 6, 12].map((v) => ({ v, label: `${v}` }))}
      legend={[
        { color: RED, label: "Option liability change" },
        { color: GREEN, label: "Stock hedge (Δ₀ shares)" },
        { color: INK, label: "Net (hedged) P&L" },
      ]}
      note="The hedge cancels first-order moves; only tiny curvature remains."
    >
      {(sx, sy) => (
        <>
          <line x1={M.left} x2={M.left + IW} y1={sy(0)} y2={sy(0)} stroke={AXIS} strokeWidth={1} />
          <line x1={sx(S0)} x2={sx(S0)} y1={M.top} y2={M.top + IH} stroke={SLATE} strokeWidth={1.1} strokeDasharray="5 5" />
          <path d={path(liability, sx, sy)} fill="none" stroke={RED} strokeWidth={2.4} />
          <path d={path(hedge, sx, sy)} fill="none" stroke={GREEN} strokeWidth={2.4} />
          <path d={path(net, sx, sy)} fill="none" stroke={INK} strokeWidth={3} />
        </>
      )}
    </Plot>
  );
}

function DerivativesGrowth() {
  // Notional doubles roughly every 5 years — the "Moore's law of finance".
  const base = 5; // trillion, ~1990 reference
  const years = linspace(1990, 2025, 120);
  const curve: Pt[] = years.map((y) => [y, base * Math.pow(2, (y - 1990) / 5)]);
  const markers = [1990, 2000, 2010, 2020].map((y) => ({
    y,
    v: base * Math.pow(2, (y - 1990) / 5),
  }));

  return (
    <Plot
      eyebrow="Figure 6 · The market it created"
      title="Derivatives notional — doubling every ~5 years"
      xLabel="Year"
      yLabel="Notional outstanding ($ trillions)"
      xDomain={[1990, 2025]}
      yDomain={[0, 650]}
      xTicks={[1990, 2000, 2010, 2020].map((v) => ({ v, label: `${v}` }))}
      yTicks={[0, 150, 300, 450, 600].map((v) => ({ v, label: `$${v}T` }))}
      legend={[{ color: GREEN, label: "Exponential growth (≈ 5-year doubling)" }]}
      note="Illustrative curve in the spirit of a financial Moore's law."
    >
      {(sx, sy) => (
        <>
          <path
            d={`${path(curve, sx, sy)} L${sx(2025)} ${sy(0)} L${sx(1990)} ${sy(0)} Z`}
            fill={GREEN_SOFT}
            opacity={0.12}
          />
          <path d={path(curve, sx, sy)} fill="none" stroke={GREEN} strokeWidth={3} />
          {markers.map((m) => (
            <circle key={m.y} cx={sx(m.y)} cy={sy(m.v)} r={4} fill={GREEN} />
          ))}
        </>
      )}
    </Plot>
  );
}

const VARIANTS: Record<EquationChartVariant, () => ReactNode> = {
  "blackjack-edge": BlackjackEdge,
  "gbm-paths": GbmPaths,
  "normal-bell": NormalBell,
  "call-payoff": CallPayoff,
  "delta-curve": DeltaCurve,
  "delta-hedge": DeltaHedge,
  "derivatives-growth": DerivativesGrowth,
};

export function EquationChart({ variant }: { variant: EquationChartVariant }) {
  const Component = VARIANTS[variant];
  return <Component />;
}

export default EquationChart;
