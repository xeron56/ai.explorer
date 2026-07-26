"use client";

import { useEffect, useMemo, useState } from "react";

type PoolMode = "max" | "avg" | "global_max" | "global_avg" | "mixed";

type CellCoord = { row: number; col: number } | null;

const PRESETS = {
  contrast: [
    [1, 3, 2, 8],
    [5, 6, 7, 4],
    [9, 2, 11, 3],
    [13, 14, 1, 16],
  ],
  gradient: [
    [10, 20, 30, 40],
    [15, 25, 35, 45],
    [20, 30, 40, 50],
    [25, 35, 45, 55],
  ],
  sparse: [
    [0, 0, 9, 0],
    [0, 4, 0, 0],
    [7, 0, 0, 0],
    [0, 0, 0, 12],
  ],
};

export function PoolingOperationVisualizer() {
  const [mode, setMode] = useState<PoolMode>("max");
  const [gridSize, setGridSize] = useState<4 | 6>(4);
  const [poolSize, setPoolSize] = useState<2 | 3>(2);
  const [stride, setStride] = useState<1 | 2>(2);
  const [padding, setPadding] = useState<0 | 1>(0);
  const [preset, setPreset] = useState<"contrast" | "gradient" | "sparse">("contrast");
  const [hoveredOutput, setHoveredOutput] = useState<CellCoord>(null);
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate input matrix based on size & preset
  const inputMatrix = useMemo(() => {
    if (gridSize === 4) return PRESETS[preset];
    // 6x6 expanded grid
    return Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 6 }, (_, c) => {
        const base = PRESETS[preset][r % 4][c % 4];
        return base + (r + c);
      }),
    );
  }, [gridSize, preset]);

  // Is Global Pooling mode?
  const isGlobal = mode === "global_max" || mode === "global_avg";

  const actualPoolSize = isGlobal ? gridSize : poolSize;
  const actualStride = isGlobal ? 1 : stride;

  const paddedInputSize = gridSize + 2 * padding;
  const outputSize = isGlobal
    ? 1
    : Math.max(0, Math.floor((paddedInputSize - actualPoolSize) / actualStride) + 1);
  const outputCount = outputSize * outputSize;

  const safePos = outputCount ? Math.min(position, outputCount - 1) : 0;
  const activeOutput: { row: number; col: number } = hoveredOutput
    ? hoveredOutput
    : {
        row: outputSize ? Math.floor(safePos / outputSize) : 0,
        col: outputSize ? safePos % outputSize : 0,
      };

  // Perform pooling calculation
  const { outputMatrix, activeCalculation, maxWinnerCoord } = useMemo(() => {
    const out: number[][] = [];
    let calcWindow: Array<{ val: number; r: number; c: number; isPad: boolean }> = [];
    let winner: { r: number; c: number } | null = null;

    for (let outRow = 0; outRow < outputSize; outRow++) {
      const rowVals: number[] = [];
      for (let outCol = 0; outCol < outputSize; outCol++) {
        const windowCells: Array<{ val: number; r: number; c: number; isPad: boolean }> = [];

        for (let pr = 0; pr < actualPoolSize; pr++) {
          for (let pc = 0; pc < actualPoolSize; pc++) {
            const inRow = outRow * actualStride + pr - padding;
            const inCol = outCol * actualStride + pc - padding;
            const isPad =
              inRow < 0 || inRow >= gridSize || inCol < 0 || inCol >= gridSize;
            const val = isPad ? 0 : inputMatrix[inRow][inCol];
            windowCells.push({ val, r: inRow, c: inCol, isPad });
          }
        }

        const validVals = windowCells.map((cell) => cell.val);
        let result = 0;

        if (mode === "max" || mode === "global_max") {
          result = Math.max(...validVals);
        } else if (mode === "avg" || mode === "global_avg") {
          result = validVals.reduce((a, b) => a + b, 0) / validVals.length;
        } else if (mode === "mixed") {
          const maxVal = Math.max(...validVals);
          const avgVal = validVals.reduce((a, b) => a + b, 0) / validVals.length;
          result = (maxVal + avgVal) / 2;
        }

        if (outRow === activeOutput.row && outCol === activeOutput.col) {
          calcWindow = windowCells;
          if (mode === "max" || mode === "global_max" || mode === "mixed") {
            const maxVal = Math.max(...validVals);
            const winCell = windowCells.find((c) => !c.isPad && c.val === maxVal);
            if (winCell) winner = { r: winCell.r, c: winCell.c };
          }
        }

        rowVals.push(result);
      }
      out.push(rowVals);
    }

    return {
      outputMatrix: out,
      activeCalculation: calcWindow,
      maxWinnerCoord: winner,
    };
  }, [inputMatrix, gridSize, mode, actualPoolSize, actualStride, padding, outputSize, activeOutput.row, activeOutput.col]);

  // Scan animation
  useEffect(() => {
    if (!isPlaying || outputCount < 2) return;
    const timer = window.setInterval(() => {
      setPosition((prev) => (prev + 1) % outputCount);
      setHoveredOutput(null);
    }, 900);
    return () => window.clearInterval(timer);
  }, [isPlaying, outputCount]);

  const activeValue = outputMatrix[activeOutput.row]?.[activeOutput.col] ?? 0;

  // Check if an input cell falls within the active output window
  const isInputInActiveWindow = (inRow: number, inCol: number) => {
    const paddedR = inRow + padding;
    const paddedC = inCol + padding;
    const startR = activeOutput.row * actualStride;
    const startC = activeOutput.col * actualStride;
    return (
      paddedR >= startR &&
      paddedR < startR + actualPoolSize &&
      paddedC >= startC &&
      paddedC < startC + actualPoolSize
    );
  };

  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
      {/* Compact Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 sm:px-5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-accent-strong)]">
          Pooling Operation Visualizer
        </span>

        {/* Mode Selector */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: "max", label: "Max Pool" },
            { id: "avg", label: "Average Pool" },
            { id: "global_max", label: "Global Max" },
            { id: "global_avg", label: "Global Average" },
            { id: "mixed", label: "Mixed Pool" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setMode(tab.id as PoolMode);
                setPosition(0);
                setHoveredOutput(null);
              }}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                mode === tab.id
                  ? "bg-[var(--color-accent)] text-white shadow-sm"
                  : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg-muted)] hover:border-[var(--color-accent)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid md:grid-cols-[210px_minmax(0,1fr)]">
        {/* Controls Sidebar */}
        <aside className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 md:border-b-0 md:border-r">
          <div className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
            Parameters
          </div>

          <div className="grid gap-3.5">
            {/* Grid Size */}
            <label className="block text-[11px] font-bold text-[var(--color-fg-muted)]">
              Input Size:
              <div className="mt-1 flex gap-1">
                {[4, 6].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      setGridSize(sz as 4 | 6);
                      setPosition(0);
                    }}
                    className={`flex-1 rounded py-1 text-xs font-bold ${
                      gridSize === sz
                        ? "bg-[var(--color-accent)] text-white"
                        : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg-muted)]"
                    }`}
                  >
                    {sz}×{sz}
                  </button>
                ))}
              </div>
            </label>

            {/* Window Size & Stride (only if not global) */}
            {!isGlobal && (
              <>
                <label className="block text-[11px] font-bold text-[var(--color-fg-muted)]">
                  Pool Window (p):
                  <div className="mt-1 flex gap-1">
                    {[2, 3].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setPoolSize(p as 2 | 3);
                          setPosition(0);
                        }}
                        className={`flex-1 rounded py-1 text-xs font-bold ${
                          poolSize === p
                            ? "bg-[var(--color-accent)] text-white"
                            : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg-muted)]"
                        }`}
                      >
                        {p}×{p}
                      </button>
                    ))}
                  </div>
                </label>

                <label className="block text-[11px] font-bold text-[var(--color-fg-muted)]">
                  Stride (s):
                  <div className="mt-1 flex gap-1">
                    {[1, 2].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setStride(s as 1 | 2);
                          setPosition(0);
                        }}
                        className={`flex-1 rounded py-1 text-xs font-bold ${
                          stride === s
                            ? "bg-[var(--color-accent)] text-white"
                            : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg-muted)]"
                        }`}
                      >
                        s={s}
                      </button>
                    ))}
                  </div>
                </label>
              </>
            )}

            {/* Matrix Presets */}
            <label className="block text-[11px] font-bold text-[var(--color-fg-muted)]">
              Preset Pattern:
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value as "contrast" | "gradient" | "sparse")}
                className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-1 text-xs font-bold text-[var(--color-fg)]"
              >
                <option value="contrast">High Contrast</option>
                <option value="gradient">Smooth Gradient</option>
                <option value="sparse">Sparse Activations</option>
              </select>
            </label>
          </div>
        </aside>

        {/* Display Matrices Panel */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="text-xs font-bold text-[var(--color-fg-subtle)] uppercase tracking-wider">
              Feature Map Reduction ({gridSize}×{gridSize} ➔ {outputSize}×{outputSize})
            </div>
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              disabled={outputCount < 2}
              className="rounded-md bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-white shadow-sm hover:brightness-110 disabled:opacity-40"
            >
              {isPlaying ? "Pause scan" : "Play scan"}
            </button>
          </div>

          {/* Interactive Grids */}
          <div className="flex flex-wrap items-center justify-around gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            {/* Input Feature Map */}
            <div className="flex flex-col items-center">
              <span className="mb-1 text-[11px] font-bold text-[var(--color-fg-muted)]">
                Input Feature Map ({gridSize}×{gridSize})
              </span>
              <div
                className="grid gap-[3px] rounded border border-slate-300 p-1 dark:border-slate-700"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  width: Math.min(220, gridSize * 36),
                }}
              >
                {inputMatrix.flatMap((row, r) =>
                  row.map((val, c) => {
                    const isInWin = isInputInActiveWindow(r, c);
                    const isWinner =
                      maxWinnerCoord && maxWinnerCoord.r === r && maxWinnerCoord.c === c;

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`flex aspect-square items-center justify-center rounded text-xs font-mono font-bold transition-all ${
                          isWinner
                            ? "bg-amber-400 text-amber-950 ring-2 ring-amber-300 scale-105 z-10"
                            : isInWin
                            ? "bg-[var(--color-accent)] text-white shadow"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {val}
                      </div>
                    );
                  }),
                )}
              </div>
            </div>

            {/* Arrow */}
            <div className="text-xl font-bold text-[var(--color-fg-subtle)]">➔</div>

            {/* Output Feature Map */}
            <div className="flex flex-col items-center">
              <span className="mb-1 text-[11px] font-bold text-[var(--color-fg-muted)]">
                Pooled Output ({outputSize}×{outputSize})
              </span>
              <div
                className="grid gap-[3px] rounded border border-slate-300 p-1 dark:border-slate-700"
                style={{
                  gridTemplateColumns: `repeat(${outputSize}, minmax(0, 1fr))`,
                  width: Math.min(180, Math.max(70, outputSize * 42)),
                }}
                onMouseLeave={() => setHoveredOutput(null)}
              >
                {outputMatrix.flatMap((row, r) =>
                  row.map((val, c) => {
                    const isActive = activeOutput.row === r && activeOutput.col === c;
                    return (
                      <button
                        type="button"
                        key={`${r}-${c}`}
                        onMouseEnter={() => setHoveredOutput({ row: r, col: c })}
                        onClick={() => {
                          setPosition(r * outputSize + c);
                          setIsPlaying(false);
                        }}
                        className={`flex aspect-square items-center justify-center rounded text-xs font-mono font-extrabold transition-all ${
                          isActive
                            ? "border-amber-400 bg-amber-300 text-amber-950 ring-2 ring-amber-200 scale-105"
                            : "border border-[var(--color-border)] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)] hover:border-[var(--color-accent)]"
                        }`}
                      >
                        {Number.isInteger(val) ? val : val.toFixed(1)}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>
          </div>

          {/* Live Math Step Calculation */}
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-fg-subtle)]">
                Live Pooled Window Calculation
              </span>
              <span className="font-mono text-xs font-bold text-[var(--color-accent-strong)]">
                Output[{activeOutput.row + 1}, {activeOutput.col + 1}] = {Number.isInteger(activeValue) ? activeValue : activeValue.toFixed(2)}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <span className="text-[var(--color-fg-muted)]">
                Window values: [{activeCalculation.map((c) => c.val).join(", ")}] ➔
              </span>
              {mode === "max" || mode === "global_max" ? (
                <span className="rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                  max(...) = {activeValue}
                </span>
              ) : mode === "avg" || mode === "global_avg" ? (
                <span className="rounded bg-blue-100 px-2 py-0.5 font-bold text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                  sum / {activeCalculation.length} = {activeValue.toFixed(2)}
                </span>
              ) : (
                <span className="rounded bg-purple-100 px-2 py-0.5 font-bold text-purple-900 dark:bg-purple-950 dark:text-purple-200">
                  (max + avg)/2 = {activeValue.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-xs text-[var(--color-fg-muted)]">
        <strong>Pooling Operation Visualizer:</strong> Trace spatial dimensionality reduction and parameter-free pooling operations across feature maps.
      </footer>
    </section>
  );
}
