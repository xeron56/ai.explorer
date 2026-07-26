"use client";

import { useMemo, useState } from "react";

export function TranslationInvarianceVisualizer() {
  const [shiftX, setShiftX] = useState(0);
  const [shiftY, setShiftY] = useState(0);

  // Generate 6x6 feature map with a localized feature peak shifted by (shiftX, shiftY)
  const inputMatrix = useMemo(() => {
    const size = 6;
    const mat = Array.from({ length: size }, () => Array(size).fill(1));

    // Base feature peak coordinates (2, 2)
    const baseR = 2 + shiftY;
    const baseC = 1 + shiftX;

    if (baseR < size && baseC < size) mat[baseR][baseC] = 9;
    if (baseR < size && baseC + 1 < size) mat[baseR][baseC + 1] = 8;
    if (baseR + 1 < size && baseC < size) mat[baseR + 1][baseC] = 7;
    if (baseR + 1 < size && baseC + 1 < size) mat[baseR + 1][baseC + 1] = 9;

    return mat;
  }, [shiftX, shiftY]);

  // Max Pooling 2x2 with stride 2 -> 3x3 output
  const pooledMatrix = useMemo(() => {
    const out: number[][] = [];
    for (let r = 0; r < 3; r++) {
      const row: number[] = [];
      for (let c = 0; c < 3; c++) {
        const p1 = inputMatrix[r * 2][c * 2];
        const p2 = inputMatrix[r * 2][c * 2 + 1];
        const p3 = inputMatrix[r * 2 + 1][c * 2];
        const p4 = inputMatrix[r * 2 + 1][c * 2 + 1];
        row.push(Math.max(p1, p2, p3, p4));
      }
      out.push(row);
    }
    return out;
  }, [inputMatrix]);

  const maxPooledVal = Math.max(...pooledMatrix.flat());

  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
      {/* Compact Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 sm:px-5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-accent-strong)]">
          Translation Invariance Visualizer
        </span>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-bold text-[var(--color-fg-muted)]">
            Horizontal Shift (Δx):
            <input
              type="range"
              min={0}
              max={2}
              step={1}
              value={shiftX}
              onChange={(e) => setShiftX(Number(e.target.value))}
              className="w-20 accent-[var(--color-accent)]"
            />
            <output className="rounded bg-[var(--color-bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-accent-strong)]">
              +{shiftX} px
            </output>
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-[var(--color-fg-muted)]">
            Vertical Shift (Δy):
            <input
              type="range"
              min={0}
              max={1}
              step={1}
              value={shiftY}
              onChange={(e) => setShiftY(Number(e.target.value))}
              className="w-20 accent-[var(--color-accent)]"
            />
            <output className="rounded bg-[var(--color-bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-accent-strong)]">
              +{shiftY} px
            </output>
          </label>
        </div>
      </header>

      {/* Main Visual Panels */}
      <div className="p-4 sm:p-5">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Shifted Input Grid */}
          <div className="flex flex-col items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
            <div className="mb-1 text-xs font-extrabold text-[var(--color-fg)]">
              Input Feature Map (6×6)
            </div>
            <div className="mb-3 text-[10px] text-[var(--color-fg-subtle)]">
              Feature object shifted by ({shiftX}, {shiftY}) pixels
            </div>

            <div className="grid grid-cols-6 gap-1 w-full max-w-[210px]">
              {inputMatrix.flatMap((row, r) =>
                row.map((val, c) => {
                  const isPeak = val >= 7;
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`flex aspect-square items-center justify-center rounded text-xs font-mono font-bold transition-all ${
                        isPeak
                          ? "bg-[var(--color-accent)] text-white shadow ring-2 ring-[var(--color-accent)]/40"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                      }`}
                    >
                      {val}
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          {/* Max Pooled Grid */}
          <div className="flex flex-col items-center rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/30 p-4">
            <div className="mb-1 text-xs font-extrabold text-[var(--color-accent-strong)]">
              Max Pooled Feature Map (3×3)
            </div>
            <div className="mb-3 text-[10px] text-[var(--color-fg-subtle)]">
              Pooled representation output
            </div>

            <div className="grid grid-cols-3 gap-1.5 w-full max-w-[150px]">
              {pooledMatrix.flatMap((row, r) =>
                row.map((val, c) => {
                  const isPeak = val >= 7;
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`flex aspect-square items-center justify-center rounded text-sm font-mono font-extrabold transition-all ${
                        isPeak
                          ? "border-amber-400 bg-amber-300 text-amber-950 shadow ring-2 ring-amber-200"
                          : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg-subtle)]"
                      }`}
                    >
                      {val}
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </div>

        {/* Translation Invariance Status Box */}
        <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50/80 p-3.5 dark:border-emerald-800 dark:bg-emerald-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">
              ✓ Invariance Retained: Peak Feature Value = {maxPooledVal}
            </span>
            <span className="rounded-full bg-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100">
              Translation Invariant
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-emerald-800 dark:text-emerald-300">
            Even when shifting the input feature by {shiftX}px horizontally and {shiftY}px vertically, the maximum activation magnitude ({maxPooledVal}) is preserved in the pooled feature map representation.
          </p>
        </div>
      </div>

      {/* Description Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-xs text-[var(--color-fg-muted)]">
        <strong>Translation Invariance:</strong> Max pooling summaries retain prominent feature responses even when input patterns shift spatially.
      </footer>
    </section>
  );
}
