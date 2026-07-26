"use client";

import { useMemo, useState } from "react";

export function NormalizationEffectVisualizer() {
  const [gamma, setGamma] = useState(1.0); // scale
  const [beta, setBeta] = useState(0.0); // shift
  const [rawMean, setRawMean] = useState(4.5);
  const [rawStd, setRawStd] = useState(2.5);

  // Generate simulated activation distribution
  const data = useMemo(() => {
    const raw: number[] = [];
    const norm: number[] = [];
    const scaled: number[] = [];

    // 100 sample activations
    for (let i = 0; i < 100; i++) {
      // Standard normal z
      const u1 = Math.random() || 0.5;
      const u2 = Math.random() || 0.5;
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      const x = rawMean + z * rawStd;
      const xHat = (x - rawMean) / (rawStd || 1e-5);
      const y = gamma * xHat + beta;

      raw.push(x);
      norm.push(xHat);
      scaled.push(y);
    }

    return { raw, norm, scaled };
  }, [rawMean, rawStd, gamma, beta]);

  // Compute distribution metrics
  const normMean = 0.0;
  const normStd = 1.0;
  const scaledMean = beta;
  const scaledStd = Math.abs(gamma);

  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
      {/* Compact Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 sm:px-5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-accent-strong)]">
          Normalization & Scale-Shift Simulator
        </span>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-bold text-[var(--color-fg-muted)]">
            Scale (γ):
            <input
              type="range"
              min={0.2}
              max={3.0}
              step={0.1}
              value={gamma}
              onChange={(e) => setGamma(Number(e.target.value))}
              className="w-20 accent-[var(--color-accent)]"
            />
            <output className="rounded bg-[var(--color-bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-accent-strong)]">
              {gamma.toFixed(1)}
            </output>
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-[var(--color-fg-muted)]">
            Shift (β):
            <input
              type="range"
              min={-3.0}
              max={3.0}
              step={0.2}
              value={beta}
              onChange={(e) => setBeta(Number(e.target.value))}
              className="w-20 accent-[var(--color-accent)]"
            />
            <output className="rounded bg-[var(--color-bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-accent-strong)]">
              {beta > 0 ? `+${beta.toFixed(1)}` : beta.toFixed(1)}
            </output>
          </label>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5">
        {/* Three Stage Distribution Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Stage 1: Raw Unnormalized Activations */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              1. Raw Activations (x)
            </div>
            <div className="mt-1 font-mono text-lg font-extrabold text-[var(--color-fg)]">
              μ = {rawMean.toFixed(1)}, σ = {rawStd.toFixed(1)}
            </div>
            <div className="mt-1.5 text-[11px] text-[var(--color-fg-muted)]">
              Unstable input distribution suffering from covariate shift.
            </div>

            {/* Simulated mini histogram */}
            <div className="mt-3 flex items-end gap-1 h-14 rounded bg-[var(--color-bg)] p-2">
              {[2, 5, 12, 25, 38, 42, 30, 15, 6, 2].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-rose-400 dark:bg-rose-600"
                  style={{ height: `${h * 2}%` }}
                />
              ))}
            </div>
          </div>

          {/* Stage 2: Standardized Activations (xHat) */}
          <div className="rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/20 p-4">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-accent-strong)]">
              2. Standardized (x̂)
            </div>
            <div className="mt-1 font-mono text-lg font-extrabold text-[var(--color-fg)]">
              μ = 0.0, σ = 1.0
            </div>
            <div className="mt-1.5 text-[11px] text-[var(--color-fg-muted)]">
              Standardized: x̂ = (x - μ) / √(σ² + ε)
            </div>

            {/* Simulated mini histogram */}
            <div className="mt-3 flex items-end gap-1 h-14 rounded bg-[var(--color-bg)] p-2">
              {[1, 4, 15, 30, 45, 45, 30, 15, 4, 1].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-[var(--color-accent)]"
                  style={{ height: `${h * 2}%` }}
                />
              ))}
            </div>
          </div>

          {/* Stage 3: Scaled & Shifted Output (y) */}
          <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
              3. Scaled & Shifted (y)
            </div>
            <div className="mt-1 font-mono text-lg font-extrabold text-[var(--color-fg)]">
              μ = {scaledMean.toFixed(1)}, σ = {scaledStd.toFixed(1)}
            </div>
            <div className="mt-1.5 text-[11px] text-[var(--color-fg-muted)]">
              Output: y = γx̂ + β (Restores representation power)
            </div>

            {/* Simulated mini histogram */}
            <div className="mt-3 flex items-end gap-1 h-14 rounded bg-[var(--color-bg)] p-2">
              {[2, 8, 20, 35, 48, 35, 20, 8, 2, 1].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-emerald-500"
                  style={{ height: `${h * 2}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Live Equation Box */}
        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3.5 font-mono text-xs">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Live Transformation Formula
          </div>
          <div className="mt-1 font-bold text-[var(--color-accent-strong)]">
            y = {gamma.toFixed(1)} · x̂ + ({beta > 0 ? `+${beta.toFixed(1)}` : beta.toFixed(1)})
          </div>
        </div>
      </div>

      {/* Description Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-xs text-[var(--color-fg-muted)]">
        <strong>Distribution Standardization:</strong> Normalization first stabilizes activations to zero mean and unit variance, then applies learnable scale ($\gamma$) and shift ($\beta$) parameters.
      </footer>
    </section>
  );
}
