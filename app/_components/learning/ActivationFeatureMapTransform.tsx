"use client";

import { useMemo, useState } from "react";

type PatternType = "edge" | "random" | "center";
type FnType = "relu" | "leaky_relu" | "elu" | "sigmoid" | "tanh";

const PATTERNS: Record<PatternType, number[][]> = {
  edge: [
    [-3.2, -2.1, 0.5, 2.8, 3.4],
    [-2.8, -1.5, 0.8, 2.4, 3.1],
    [-3.0, -1.8, 0.2, 2.2, 2.9],
    [-2.5, -1.2, 0.4, 1.9, 2.6],
    [-2.9, -1.7, 0.1, 2.1, 3.0],
  ],
  center: [
    [-2.5, -2.0, -1.8, -2.2, -2.4],
    [-1.9, 0.8, 2.3, 1.1, -1.7],
    [-2.1, 1.9, 4.2, 2.1, -2.0],
    [-1.8, 1.2, 2.5, 0.9, -1.9],
    [-2.3, -1.9, -2.1, -1.8, -2.5],
  ],
  random: [
    [1.2, -2.4, 0.8, -1.5, 2.1],
    [-0.9, 3.1, -2.8, 1.4, -0.6],
    [2.5, -1.1, 0.3, -3.2, 1.7],
    [-1.8, 0.6, -2.2, 2.8, -1.4],
    [0.4, -2.9, 1.9, -0.7, 2.3],
  ],
};

export function ActivationFeatureMapTransform() {
  const [pattern, setPattern] = useState<PatternType>("edge");
  const [activeFn, setActiveFn] = useState<FnType>("relu");
  const [alpha, setAlpha] = useState(0.1);

  const rawMatrix = PATTERNS[pattern];

  const transformedMatrix = useMemo(() => {
    return rawMatrix.map((row) =>
      row.map((x) => {
        switch (activeFn) {
          case "relu":
            return Math.max(0, x);
          case "leaky_relu":
            return x > 0 ? x : alpha * x;
          case "elu":
            return x > 0 ? x : alpha * (Math.exp(x) - 1);
          case "sigmoid":
            return 1 / (1 + Math.exp(-x));
          case "tanh":
            return Math.tanh(x);
        }
      }),
    );
  }, [rawMatrix, activeFn, alpha]);

  // Stats calculation
  const flatTransformed = transformedMatrix.flat();
  const zeroCount = flatTransformed.filter((val) => Math.abs(val) < 0.001).length;
  const sparsity = Math.round((zeroCount / flatTransformed.length) * 100);

  const rawMean = rawMatrix.flat().reduce((a, b) => a + b, 0) / flatTransformed.length;
  const postMean = flatTransformed.reduce((a, b) => a + b, 0) / flatTransformed.length;

  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
      {/* Compact Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 sm:px-5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-accent-strong)]">
          Feature Map Activation Transform
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {/* Pattern Selector */}
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value as PatternType)}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1 text-xs font-bold text-[var(--color-fg)] focus:outline-none"
          >
            <option value="edge">Edge Pattern</option>
            <option value="center">Center Highlight</option>
            <option value="random">Random Noise</option>
          </select>

          {/* Activation Function Buttons */}
          <div className="flex gap-1">
            {[
              { id: "relu", label: "ReLU" },
              { id: "leaky_relu", label: "Leaky ReLU" },
              { id: "elu", label: "ELU" },
              { id: "sigmoid", label: "Sigmoid" },
              { id: "tanh", label: "Tanh" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveFn(item.id as FnType)}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                  activeFn === item.id
                    ? "bg-[var(--color-accent)] text-white shadow-sm"
                    : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg-muted)] hover:border-[var(--color-accent)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Grid comparison */}
      <div className="p-4 sm:p-5">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pre-activation raw input */}
          <div className="flex flex-col items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
            <div className="mb-2 text-xs font-extrabold text-[var(--color-fg)]">
              1. Pre-Activation Matrix (z)
            </div>
            <div className="text-[10px] text-[var(--color-fg-subtle)] mb-3">
              Raw convolution response (Mean: {rawMean.toFixed(2)})
            </div>

            <div className="grid grid-cols-5 gap-1.5 w-full max-w-[240px]">
              {rawMatrix.flatMap((row, r) =>
                row.map((val, c) => {
                  const isNeg = val < 0;
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`flex aspect-square items-center justify-center rounded border font-mono text-[10px] font-bold ${
                        isNeg
                          ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300"
                          : "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                      }`}
                    >
                      {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          {/* Post-activation output */}
          <div className="flex flex-col items-center rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/20 p-4">
            <div className="mb-2 text-xs font-extrabold text-[var(--color-accent-strong)]">
              2. Post-Activation Feature Map f(z)
            </div>
            <div className="text-[10px] text-[var(--color-fg-subtle)] mb-3">
              Transformed values (Mean: {postMean.toFixed(2)})
            </div>

            <div className="grid grid-cols-5 gap-1.5 w-full max-w-[240px]">
              {transformedMatrix.flatMap((row, r) =>
                row.map((val, c) => {
                  const isZero = Math.abs(val) < 0.001;
                  const isNeg = val < 0;
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`flex aspect-square items-center justify-center rounded border font-mono text-[10px] font-extrabold transition-colors ${
                        isZero
                          ? "border-slate-300 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
                          : isNeg
                          ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "border-emerald-400 bg-emerald-100 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-900 dark:text-emerald-100"
                      }`}
                    >
                      {val.toFixed(2)}
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </div>

        {/* Stats summary bar */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Feature Sparsity
            </div>
            <div className="mt-0.5 font-mono text-xl font-extrabold text-[var(--color-fg)]">
              {sparsity}% Dead Neurons
            </div>
            <div className="mt-1 text-[10px] text-[var(--color-fg-muted)]">
              {activeFn === "relu" ? "ReLU zeroes all negative inputs" : "No zero-clipping applied"}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Activation Shift
            </div>
            <div className="mt-0.5 font-mono text-xl font-extrabold text-[var(--color-fg)]">
              {rawMean.toFixed(2)} ➔ {postMean.toFixed(2)}
            </div>
            <div className="mt-1 text-[10px] text-[var(--color-fg-muted)]">
              Mean activation level shift
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Output Bounding Range
            </div>
            <div className="mt-0.5 font-mono text-xl font-extrabold text-[var(--color-fg)]">
              {activeFn === "sigmoid" && "(0, 1)"}
              {activeFn === "tanh" && "(-1, +1)"}
              {activeFn === "relu" && "[0, +∞)"}
              {activeFn === "leaky_relu" && "(-∞, +∞)"}
              {activeFn === "elu" && "(-α, +∞)"}
            </div>
            <div className="mt-1 text-[10px] text-[var(--color-fg-muted)]">
              Theoretical range bounds
            </div>
          </div>
        </div>
      </div>

      {/* Description Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-xs text-[var(--color-fg-muted)]">
        <strong>Feature Map Transformation:</strong> Compares raw convolutional activations ($z$) with post-activation responses ($f(z)$) to illustrate spatial sparsity and output distribution changes.
      </footer>
    </section>
  );
}
