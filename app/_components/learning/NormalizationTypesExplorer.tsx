"use client";

import { useMemo, useState } from "react";

type NormMode = "batch" | "layer" | "instance" | "group";

export function NormalizationTypesExplorer() {
  const [mode, setMode] = useState<NormMode>("batch");
  const [numGroups, setNumGroups] = useState<number>(2); // for GroupNorm
  const [hoveredCell, setHoveredCell] = useState<{ n: number; c: number } | null>(null);

  const N = 4; // Batch size = 4 samples
  const C = 4; // Channels = 4 (C1, C2, C3, C4)
  const H = 2; // Spatial 2x2
  const W = 2;

  // Determine if cell (n, c) is in the same normalization slice as selected active cell
  const isInSameSlice = (cellN: number, cellC: number, targetN: number, targetC: number) => {
    switch (mode) {
      case "batch":
        // BatchNorm: normalizes across N & (H, W) for each channel C independently
        return cellC === targetC;
      case "layer":
        // LayerNorm: normalizes across C & (H, W) for each sample N independently
        return cellN === targetN;
      case "instance":
        // InstanceNorm: normalizes across (H, W) for each (N, C) pair independently
        return cellN === targetN && cellC === targetC;
      case "group": {
        // GroupNorm: divides C into G groups, normalizes across (C/G) & (H, W) for each N
        const groupSize = C / numGroups;
        const groupTarget = Math.floor(targetC / groupSize);
        const groupCell = Math.floor(cellC / groupSize);
        return cellN === targetN && groupTarget === groupCell;
      }
    }
  };

  const activeCell = hoveredCell || { n: 0, c: 0 };

  const normInfo = useMemo(() => {
    switch (mode) {
      case "batch":
        return {
          title: "Batch Normalization (BatchNorm)",
          formula: "μ_c, σ²_c computed across Batch (N) & Spatial (H×W) for each channel c",
          reduction: `Averages N×H×W = ${N * H * W} elements per channel`,
          bestFor: "Standard CNNs with large batch sizes (N ≥ 16)",
          color: "bg-blue-500 text-white",
        };
      case "layer":
        return {
          title: "Layer Normalization (LayerNorm)",
          formula: "μ_n, σ²_n computed across Channels (C) & Spatial (H×W) for each sample n",
          reduction: `Averages C×H×W = ${C * H * W} elements per sample`,
          bestFor: "Transformers, RNNs, and small/varying batch sizes",
          color: "bg-emerald-500 text-white",
        };
      case "instance":
        return {
          title: "Instance Normalization (InstanceNorm)",
          formula: "μ_n,c, σ²_n,c computed across Spatial (H×W) for each (sample n, channel c)",
          reduction: `Averages H×W = ${H * W} elements per channel per sample`,
          bestFor: "Style transfer, image-to-image translation (GANs)",
          color: "bg-purple-500 text-white",
        };
      case "group":
        return {
          title: `Group Normalization (GroupNorm, G=${numGroups})`,
          formula: `μ_n,g, σ²_n,g computed across (C/G) channels & Spatial (H×W) per sample n`,
          reduction: `Averages (C/G)×H×W = ${(C / numGroups) * H * W} elements per group`,
          bestFor: "Object detection, segmentation, small batch training (N ≤ 8)",
          color: "bg-amber-500 text-white",
        };
    }
  }, [mode, numGroups]);

  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
      {/* Compact Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 sm:px-5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-accent-strong)]">
          Normalization Types Explorer
        </span>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: "batch", label: "BatchNorm" },
            { id: "layer", label: "LayerNorm" },
            { id: "instance", label: "InstanceNorm" },
            { id: "group", label: "GroupNorm" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id as NormMode)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
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
            Tensor Dimensions
          </div>

          <div className="grid gap-3 font-mono text-xs">
            <div className="flex justify-between border-b border-[var(--color-border)]/60 pb-1.5">
              <span className="text-[var(--color-fg-muted)]">Batch (N):</span>
              <span className="font-bold text-[var(--color-fg)]">4 samples</span>
            </div>
            <div className="flex justify-between border-b border-[var(--color-border)]/60 pb-1.5">
              <span className="text-[var(--color-fg-muted)]">Channels (C):</span>
              <span className="font-bold text-[var(--color-fg)]">4 channels</span>
            </div>
            <div className="flex justify-between border-b border-[var(--color-border)]/60 pb-1.5">
              <span className="text-[var(--color-fg-muted)]">Spatial (H×W):</span>
              <span className="font-bold text-[var(--color-fg)]">2 × 2</span>
            </div>

            {mode === "group" && (
              <label className="block text-[11px] font-bold text-[var(--color-fg-muted)] mt-1">
                Number of Groups (G):
                <div className="mt-1 flex gap-1">
                  {[2, 4].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setNumGroups(g)}
                      className={`flex-1 rounded py-1 text-xs font-bold ${
                        numGroups === g
                          ? "bg-[var(--color-accent)] text-white"
                          : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg-muted)]"
                      }`}
                    >
                      G={g}
                    </button>
                  ))}
                </div>
              </label>
            )}
          </div>

          <div className="mt-4 border-t border-[var(--color-border)] pt-3 text-[11px] text-[var(--color-fg-muted)]">
            <strong className="block text-[var(--color-fg)] font-bold">Recommended for:</strong>
            <p className="mt-1 leading-4">{normInfo.bestFor}</p>
          </div>
        </aside>

        {/* 4D Tensor Slicing Canvas */}
        <div className="p-4 sm:p-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              4D Tensor [N, C, H, W] Normalization Slices
            </span>
            <span className="text-[10px] text-[var(--color-fg-muted)]">
              Hover any sample/channel block to highlight its normalization slice
            </span>
          </div>

          {/* 4D Grid Matrix representation */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: N }).map((_, n) => (
                <div
                  key={`sample-${n}`}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2.5"
                >
                  <div className="mb-2 text-center font-mono text-[11px] font-extrabold text-[var(--color-fg-subtle)] border-b border-[var(--color-border)]/50 pb-1">
                    Sample N_{n + 1}
                  </div>

                  {/* Channels within sample N */}
                  <div className="grid gap-2">
                    {Array.from({ length: C }).map((_, c) => {
                      const isHighlighted = isInSameSlice(n, c, activeCell.n, activeCell.c);
                      return (
                        <div
                          key={`c-${c}`}
                          onMouseEnter={() => setHoveredCell({ n, c })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`cursor-pointer rounded border p-1.5 transition-all ${
                            isHighlighted
                              ? `${normInfo.color} shadow-md scale-[1.02] ring-2 ring-[var(--color-accent)]/30`
                              : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg-subtle)] opacity-40 hover:opacity-80"
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                            <span>Ch C_{c + 1}</span>
                            <span className="text-[9px] opacity-80">2×2</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formula & Slice Explanation Card */}
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3.5">
            <h4 className="m-0 text-xs font-extrabold text-[var(--color-fg)]">
              {normInfo.title}
            </h4>
            <div className="mt-1 font-mono text-xs font-bold text-[var(--color-accent-strong)]">
              {normInfo.formula}
            </div>
            <div className="mt-1.5 text-xs text-[var(--color-fg-muted)]">
              {normInfo.reduction}
            </div>
          </div>
        </div>
      </div>

      {/* Description Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-xs text-[var(--color-fg-muted)]">
        <strong>Normalization Types Explorer:</strong> Compare BatchNorm, LayerNorm, InstanceNorm, and GroupNorm by visualizing which tensor slices $[N, C, H, W]$ are standardized together.
      </footer>
    </section>
  );
}
