"use client";

import { useState } from "react";

type ConvType = "standard" | "depthwise" | "dilated" | "transposed";

export function ConvTypesExplorer() {
  const [activeType, setActiveType] = useState<ConvType>("standard");
  const [inChannels, setInChannels] = useState(32);
  const [outChannels, setOutChannels] = useState(64);
  const [kernelSize, setKernelSize] = useState(3);
  const [spatialSize, setSpatialSize] = useState(28);
  const [dilationRate, setDilationRate] = useState(2);

  // Standard Conv
  const stdParams = inChannels * outChannels * kernelSize * kernelSize;
  const stdMacs = stdParams * spatialSize * spatialSize;

  // Depthwise Separable Conv
  const dwParams = inChannels * kernelSize * kernelSize;
  const pwParams = inChannels * outChannels;
  const dsParams = dwParams + pwParams;
  const dsMacs = dsParams * spatialSize * spatialSize;

  // Efficiency saving percentage
  const paramSavings = Math.round((1 - dsParams / stdParams) * 100);

  // Dilated receptive field
  const effectiveKernel = dilationRate * (kernelSize - 1) + 1;

  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
      {/* Compact Top Header & Navigation Bar */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-accent-strong)]">
            Convolution Explorer
          </span>
        </div>

        {/* Type Selector Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "standard", label: "Standard (Dense)" },
            { id: "depthwise", label: "Depthwise Separable" },
            { id: "dilated", label: "Dilated (Atrous)" },
            { id: "transposed", label: "Transposed (Upsampling)" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveType(tab.id as ConvType)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${
                activeType === tab.id
                  ? "bg-[var(--color-accent)] text-white shadow-sm"
                  : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
        {/* Controls Sidebar */}
        <aside className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 md:border-b-0 md:border-r">
          <div className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
            Layer Parameters
          </div>
          <div className="grid gap-3.5">
            <SliderControl
              label="Input Channels (Cin)"
              value={inChannels}
              min={3}
              max={128}
              step={1}
              suffix={`${inChannels}`}
              onChange={setInChannels}
            />
            <SliderControl
              label="Output Filters (Cout)"
              value={outChannels}
              min={16}
              max={256}
              step={8}
              suffix={`${outChannels}`}
              onChange={setOutChannels}
            />
            <SliderControl
              label="Kernel Size (Dk)"
              value={kernelSize}
              min={1}
              max={7}
              step={2}
              suffix={`${kernelSize} × ${kernelSize}`}
              onChange={setKernelSize}
            />
            <SliderControl
              label="Spatial Map (H = W)"
              value={spatialSize}
              min={7}
              max={112}
              step={7}
              suffix={`${spatialSize} × ${spatialSize}`}
              onChange={setSpatialSize}
            />
            {activeType === "dilated" && (
              <SliderControl
                label="Dilation Rate (d)"
                value={dilationRate}
                min={1}
                max={4}
                step={1}
                suffix={`d = ${dilationRate}`}
                onChange={setDilationRate}
              />
            )}
          </div>
        </aside>

        {/* Details Panel */}
        <div className="p-4 sm:p-5">
          {/* Metrics comparison cards */}
          <div className="grid gap-3.5 sm:grid-cols-3">
            <MetricCard
              title="Parameters (Weights)"
              value={
                activeType === "depthwise"
                  ? dsParams.toLocaleString()
                  : stdParams.toLocaleString()
              }
              subtext={
                activeType === "depthwise"
                  ? `DW: ${dwParams.toLocaleString()} + PW: ${pwParams.toLocaleString()}`
                  : `${inChannels} × ${outChannels} × ${kernelSize}²`
              }
              highlight={activeType === "depthwise"}
            />
            <MetricCard
              title="Multiply-Adds (MACs)"
              value={
                activeType === "depthwise"
                  ? (dsMacs / 1e6).toFixed(2) + " M"
                  : (stdMacs / 1e6).toFixed(2) + " M"
              }
              subtext={`For ${spatialSize}×${spatialSize} feature map`}
              highlight={false}
            />
            <MetricCard
              title={
                activeType === "depthwise"
                  ? "Parameter Reduction"
                  : activeType === "dilated"
                  ? "Receptive Field Expansion"
                  : "Key Attribute"
              }
              value={
                activeType === "depthwise"
                  ? `${paramSavings}% Savings`
                  : activeType === "dilated"
                  ? `${effectiveKernel} × ${effectiveKernel}`
                  : activeType === "transposed"
                  ? "Spatial Upsampling"
                  : "Full Connectivity"
              }
              subtext={
                activeType === "depthwise"
                  ? `vs Standard Conv (${stdParams.toLocaleString()} params)`
                  : activeType === "dilated"
                  ? `Same params as ${kernelSize}×${kernelSize}`
                  : activeType === "transposed"
                  ? "Increases feature map resolution"
                  : "Learns spatial cross-channel features"
              }
              highlight={activeType === "depthwise" || activeType === "dilated"}
            />
          </div>

          {/* Type Explanatory Box */}
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
            <h4 className="m-0 text-sm font-extrabold text-[var(--color-fg)]">
              {activeType === "standard" && "1. Standard (Dense) Convolution"}
              {activeType === "depthwise" && "2. Depthwise Separable Convolution"}
              {activeType === "dilated" && "3. Dilated (Atrous) Convolution"}
              {activeType === "transposed" && "4. Transposed Convolution (Deconvolution)"}
            </h4>

            <p className="mt-1.5 text-xs leading-5 text-[var(--color-fg-muted)]">
              {activeType === "standard" &&
                "Standard 2D convolution applies C_out 3D filters simultaneously across all C_in input channels. Each output pixel sums across all channels and kernel spatial positions."}
              {activeType === "depthwise" &&
                "Factored into two light steps: (1) Depthwise Conv applies a separate spatial filter to each channel individually. (2) Pointwise Conv uses 1×1 filters to combine channel outputs. This reduces compute by 80-90% (used heavily in MobileNet)."}
              {activeType === "dilated" &&
                "Inserts spaces (zeros) between kernel elements according to dilation rate d. This expands the receptive field exponentially without increasing the number of learnable parameters or memory footprint."}
              {activeType === "transposed" &&
                "Reverses spatial reduction by inserting zeros between input pixels before convolving. Essential for image generation (GANs), autoencoders, and semantic segmentation head networks (U-Net)."}
            </p>

            {/* Formula display */}
            <div className="mt-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 font-mono text-xs font-semibold text-[var(--color-accent-strong)]">
              {activeType === "standard" && `Params = C_in × C_out × D_k² = ${inChannels} × ${outChannels} × ${kernelSize}² = ${stdParams.toLocaleString()}`}
              {activeType === "depthwise" && `Params = (C_in × D_k²) + (C_in × C_out) = (${inChannels}×${kernelSize}²) + (${inChannels}×${outChannels}) = ${dsParams.toLocaleString()}`}
              {activeType === "dilated" && `Effective Receptive Field = D_k + (D_k - 1)(d - 1) = ${kernelSize} + (${kernelSize}-1)(${dilationRate}-1) = ${effectiveKernel}`}
              {activeType === "transposed" && `Output Height = (H_in - 1) × s - 2p + D_k`}
            </div>
          </div>

          {/* Visual Architecture Diagram */}
          <div className="mt-4">
            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Architecture Dataflow Diagram
            </div>
            <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-center">
              {activeType === "standard" && (
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-[var(--color-fg)]">
                  <div className="rounded border border-blue-400 bg-blue-50 px-2.5 py-1.5 text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                    Input Map ({inChannels} channels)
                  </div>
                  <div>➔</div>
                  <div className="rounded border border-purple-400 bg-purple-50 px-2.5 py-1.5 text-purple-900 dark:bg-purple-950 dark:text-purple-200">
                    {outChannels} Filters of ({inChannels} × {kernelSize} × {kernelSize})
                  </div>
                  <div>➔</div>
                  <div className="rounded border border-emerald-400 bg-emerald-50 px-2.5 py-1.5 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                    Output Map ({outChannels} channels)
                  </div>
                </div>
              )}

              {activeType === "depthwise" && (
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-[var(--color-fg)]">
                  <div className="rounded border border-blue-400 bg-blue-50 px-2.5 py-1.5 text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                    Input ({inChannels} ch)
                  </div>
                  <div>➔</div>
                  <div className="rounded border border-amber-400 bg-amber-50 px-2.5 py-1.5 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                    Depthwise Conv ({inChannels} × {kernelSize}×{kernelSize})
                  </div>
                  <div>➔</div>
                  <div className="rounded border border-indigo-400 bg-indigo-50 px-2.5 py-1.5 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200">
                    Pointwise 1×1 ({inChannels} × {outChannels})
                  </div>
                  <div>➔</div>
                  <div className="rounded border border-emerald-400 bg-emerald-50 px-2.5 py-1.5 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                    Output ({outChannels} ch)
                  </div>
                </div>
              )}

              {activeType === "dilated" && (
                <div className="flex flex-col items-center gap-1.5 text-xs">
                  <div className="font-bold text-[var(--color-fg)]">
                    Kernel element spacing at dilation rate d = {dilationRate}
                  </div>
                  <div className="flex gap-1 font-mono">
                    {Array.from({ length: kernelSize * 2 - 1 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`flex h-6 w-6 items-center justify-center rounded text-[11px] font-bold ${
                          idx % dilationRate === 0
                            ? "bg-[var(--color-accent)] text-white"
                            : "border border-dashed border-slate-400 bg-slate-100 text-slate-400 dark:bg-slate-800"
                        }`}
                      >
                        {idx % dilationRate === 0 ? "w" : "0"}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-[var(--color-fg-subtle)]">
                    Dilation rate d={dilationRate}: spaces added between weight taps
                  </span>
                </div>
              )}

              {activeType === "transposed" && (
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-[var(--color-fg)]">
                  <div className="rounded border border-rose-400 bg-rose-50 px-2.5 py-1.5 text-rose-900 dark:bg-rose-950 dark:text-rose-200">
                    Low-Res Feature Map ({spatialSize}×{spatialSize})
                  </div>
                  <div>➔ [Zero Padding Expansion] ➔</div>
                  <div className="rounded border border-emerald-400 bg-emerald-50 px-2.5 py-1.5 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                    High-Res Output Feature Map (Upsampled)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-xs text-[var(--color-fg-muted)]">
        <strong>Convolution Variants Explorer:</strong> Compare Standard, Depthwise Separable, Dilated, and Transposed convolutions to analyze learnable parameters, FLOPs, and architectural trade-offs.
      </footer>
    </section>
  );
}

function MetricCard({
  title,
  value,
  subtext,
  highlight,
}: {
  title: string;
  value: string;
  subtext: string;
  highlight?: boolean;
}) {
  const isLongText = value.length > 10 || isNaN(Number(value.replace(/,/g, "").replace(/ M/g, "").replace(/%/g, "").split(" ")[0]));

  return (
    <div
      className={`rounded-xl border p-3.5 transition-all ${
        highlight
          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]/50"
          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
      }`}
    >
      <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
        {title}
      </div>
      <div
        className={`mt-1 text-[var(--color-fg)] ${
          isLongText
            ? "font-sans text-base font-extrabold leading-tight break-words"
            : "font-mono text-xl sm:text-2xl font-extrabold"
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] leading-4 text-[var(--color-fg-muted)]">
        {subtext}
      </div>
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-[11px] font-bold text-[var(--color-fg-muted)]">
        <span>{label}</span>
        <output className="rounded bg-[var(--color-bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-accent-strong)]">
          {suffix}
        </output>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="block w-full accent-[var(--color-accent)]"
      />
    </label>
  );
}
