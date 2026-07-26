"use client";

import { useState } from "react";

export function ConvDimensionCalculator() {
  const [inputSize, setInputSize] = useState(28);
  const [kernelSize, setKernelSize] = useState(3);
  const [stride, setStride] = useState(1);
  const [padding, setPadding] = useState(1);
  const [dilation, setDilation] = useState(1);
  const [isTransposed, setIsTransposed] = useState(false);

  const effectiveKernel = dilation * (kernelSize - 1) + 1;
  const paddedInputSize = inputSize + 2 * padding;

  let outputSize = 0;
  let isValid = true;
  let formulaStr = "";
  let calculationSteps = "";

  if (isTransposed) {
    outputSize = (inputSize - 1) * stride - 2 * padding + effectiveKernel;
    isValid = outputSize > 0;
    formulaStr = `H_out = (H - 1) × s - 2p + M_eff`;
    calculationSteps = `(${inputSize} - 1) × ${stride} - 2(${padding}) + ${effectiveKernel} = ${outputSize}`;
  } else {
    const rawVal = (paddedInputSize - effectiveKernel) / stride;
    outputSize = Math.floor(rawVal) + 1;
    isValid = outputSize > 0 && effectiveKernel <= paddedInputSize;
    formulaStr = `H_out = ⌊(H - M_eff + 2p) / s⌋ + 1`;
    calculationSteps = `⌊(${inputSize} - ${effectiveKernel} + 2×${padding}) / ${stride}⌋ + 1 = ⌊${(paddedInputSize - effectiveKernel)} / ${stride}⌋ + 1 = ${outputSize}`;
  }

  const applyPreset = (type: "same" | "downsample" | "dilated" | "valid") => {
    setIsTransposed(false);
    if (type === "same") {
      setInputSize(28);
      setKernelSize(3);
      setStride(1);
      setPadding(1);
      setDilation(1);
    } else if (type === "valid") {
      setInputSize(32);
      setKernelSize(5);
      setStride(1);
      setPadding(0);
      setDilation(1);
    } else if (type === "downsample") {
      setInputSize(32);
      setKernelSize(3);
      setStride(2);
      setPadding(1);
      setDilation(1);
    } else if (type === "dilated") {
      setInputSize(28);
      setKernelSize(3);
      setStride(1);
      setPadding(2);
      setDilation(2);
    }
  };

  const previewGridSize = Math.min(12, inputSize);
  const previewKernel = Math.min(previewGridSize, effectiveKernel);
  const previewPadded = previewGridSize + (padding > 0 ? 2 : 0);

  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
      {/* Compact Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 sm:px-5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-accent-strong)]">
          Dimension Calculator
        </span>

        <button
          type="button"
          onClick={() => setIsTransposed((prev) => !prev)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${
            isTransposed
              ? "border-purple-500 bg-purple-600 text-white"
              : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg-muted)] hover:border-[var(--color-accent)]"
          }`}
        >
          Mode: {isTransposed ? "Transposed (Deconv)" : "Standard Conv"}
        </button>
      </header>

      <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
        {/* Controls sidebar */}
        <aside className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 md:border-b-0 md:border-r">
          <div className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
            Preset Configurations
          </div>
          <div className="grid grid-cols-2 gap-1.5 md:grid-cols-1">
            <button
              type="button"
              onClick={() => applyPreset("same")}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-left text-[11px] font-bold text-[var(--color-fg-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
            >
              Same Padding (3×3)
            </button>
            <button
              type="button"
              onClick={() => applyPreset("valid")}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-left text-[11px] font-bold text-[var(--color-fg-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
            >
              Valid (No Padding)
            </button>
            <button
              type="button"
              onClick={() => applyPreset("downsample")}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-left text-[11px] font-bold text-[var(--color-fg-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
            >
              Downsampling (s=2)
            </button>
            <button
              type="button"
              onClick={() => applyPreset("dilated")}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-left text-[11px] font-bold text-[var(--color-fg-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
            >
              Atrous/Dilated (d=2)
            </button>
          </div>

          <div className="mt-4 border-t border-[var(--color-border)] pt-3.5">
            <div className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
              Parameters
            </div>
            <div className="grid gap-3.5">
              <SliderControl
                label="Input size (H = W)"
                value={inputSize}
                min={4}
                max={64}
                suffix={`${inputSize} × ${inputSize}`}
                onChange={setInputSize}
              />
              <SliderControl
                label="Kernel size (M = N)"
                value={kernelSize}
                min={1}
                max={11}
                step={2}
                suffix={`${kernelSize} × ${kernelSize}`}
                onChange={setKernelSize}
              />
              <SliderControl
                label="Padding (p)"
                value={padding}
                min={0}
                max={5}
                suffix={`${padding} px`}
                onChange={setPadding}
              />
              <SliderControl
                label="Stride (s)"
                value={stride}
                min={1}
                max={4}
                suffix={`${stride}`}
                onChange={setStride}
              />
              <SliderControl
                label="Dilation (d)"
                value={dilation}
                min={1}
                max={4}
                suffix={`${dilation}`}
                onChange={setDilation}
              />
            </div>
          </div>
        </aside>

        {/* Main display & math calculation */}
        <div className="flex flex-col justify-between p-4 sm:p-5">
          {!isValid ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
              <strong>Invalid Configuration:</strong> Effective kernel size ({effectiveKernel}) is larger than padded input size ({paddedInputSize}). Increase padding or reduce kernel/dilation.
            </div>
          ) : (
            <div>
              {/* Formula Result Card */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/40 p-3.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-accent-strong)]">
                    Output Dimension
                  </div>
                  <div className="mt-0.5 font-mono text-2xl font-extrabold text-[var(--color-fg)]">
                    {outputSize} × {outputSize}
                  </div>
                  <div className="mt-1 text-[11px] text-[var(--color-fg-muted)]">
                    Resolution: {((outputSize * outputSize) / (inputSize * inputSize) * 100).toFixed(1)}% of input
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                    Receptive Field
                  </div>
                  <div className="mt-0.5 font-mono text-2xl font-bold text-[var(--color-fg)]">
                    {effectiveKernel} × {effectiveKernel}
                  </div>
                  <div className="mt-1 text-[11px] text-[var(--color-fg-muted)]">
                    {dilation > 1 ? `Kernel ${kernelSize} with dilation d=${dilation}` : `Standard kernel (${kernelSize}×${kernelSize})`}
                  </div>
                </div>
              </div>

              {/* Math breakdown equation box */}
              <div className="mt-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3.5">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                  Formula & Step-by-Step Substitution
                </div>
                <div className="mt-1 font-mono text-xs font-bold text-[var(--color-accent-strong)]">
                  {formulaStr}
                </div>
                <div className="mt-0.5 font-mono text-xs font-semibold text-[var(--color-fg)]">
                  {calculationSteps}
                </div>
              </div>

              {/* Grid visual representation */}
              <div className="mt-4">
                <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  Spatial Grid Simulation (Scaled Preview)
                </div>
                <div className="flex flex-wrap items-center justify-around gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3.5">
                  {/* Padded Input Visual */}
                  <div className="flex flex-col items-center">
                    <span className="mb-1 text-[11px] font-bold text-[var(--color-fg-muted)]">
                      Input + Padding ({paddedInputSize}×{paddedInputSize})
                    </span>
                    <div
                      className="grid gap-[2px] rounded border border-slate-300 p-1 dark:border-slate-700"
                      style={{ gridTemplateColumns: `repeat(${previewPadded}, minmax(0, 1fr))` }}
                    >
                      {Array.from({ length: previewPadded * previewPadded }).map((_, i) => {
                        const row = Math.floor(i / previewPadded);
                        const col = i % previewPadded;
                        const isPad =
                          padding > 0 &&
                          (row === 0 || row === previewPadded - 1 || col === 0 || col === previewPadded - 1);
                        const isInKernel =
                          row >= (padding > 0 ? 1 : 0) &&
                          row < (padding > 0 ? 1 : 0) + previewKernel &&
                          col >= (padding > 0 ? 1 : 0) &&
                          col < (padding > 0 ? 1 : 0) + previewKernel;

                        return (
                          <div
                            key={i}
                            className={`h-3.5 w-3.5 rounded-[2px] transition-colors ${
                              isPad
                                ? "border border-dashed border-slate-400 bg-slate-100 dark:bg-slate-800"
                                : isInKernel
                                ? "bg-[var(--color-accent)] opacity-80"
                                : "bg-blue-100 dark:bg-blue-950"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="text-lg font-bold text-[var(--color-fg-subtle)]">➔</div>

                  {/* Output Visual */}
                  <div className="flex flex-col items-center">
                    <span className="mb-1 text-[11px] font-bold text-[var(--color-fg-muted)]">
                      Feature Map ({outputSize}×{outputSize})
                    </span>
                    <div
                      className="grid gap-[2px] rounded border border-slate-300 p-1 dark:border-slate-700"
                      style={{
                        gridTemplateColumns: `repeat(${Math.min(10, outputSize)}, minmax(0, 1fr))`,
                      }}
                    >
                      {Array.from({
                        length: Math.min(10, outputSize) * Math.min(10, outputSize),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="h-3.5 w-3.5 rounded-[2px] bg-emerald-400 dark:bg-emerald-600"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-xs text-[var(--color-fg-muted)]">
        <strong>Dimension Calculator:</strong> Dynamically calculates output dimensions and receptive field sizes based on input resolution, kernel, padding, stride, and dilation.
      </footer>
    </section>
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
