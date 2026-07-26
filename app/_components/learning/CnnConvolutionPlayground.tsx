"use client";

import { useEffect, useMemo, useState } from "react";

type KernelPreset = "vertical" | "horizontal" | "sharpen" | "blur" | "custom";
type HoveredCell = { kind: "input" | "kernel" | "output"; row: number; column: number } | null;

const PRESETS: Array<{ value: Exclude<KernelPreset, "custom">; label: string }> = [
  { value: "vertical", label: "Vertical edge" },
  { value: "horizontal", label: "Horizontal edge" },
  { value: "sharpen", label: "Sharpen" },
  { value: "blur", label: "Blur" },
];

function createInput(size: number): number[][] {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => {
      const verticalBar = column >= Math.floor(size * 0.45) && column <= Math.floor(size * 0.62);
      const horizontalBar = row >= Math.floor(size * 0.62) && column >= Math.floor(size * 0.25);
      return verticalBar || horizontalBar ? 1 : 0;
    }),
  );
}

function resizeMatrix(matrix: number[][], size: number) {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => matrix[row]?.[column] ?? 0),
  );
}

function createKernel(preset: Exclude<KernelPreset, "custom">, size: number): number[][] {
  if (preset === "blur") {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => 1 / (size * size)));
  }

  const middle = Math.floor(size / 2);
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => {
      if (preset === "vertical") {
        if (column < middle) return -1;
        if (column > middle) return 1;
        return 0;
      }
      if (preset === "horizontal") {
        if (row < middle) return -1;
        if (row > middle) return 1;
        return 0;
      }
      if (row === middle && column === middle) return size === 1 ? 1 : size * size;
      return -1;
    }),
  );
}

function formatValue(value: number) {
  if (Math.abs(value) < 0.0005) return "0";
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function contributionColor(row: number, column: number, size: number, alpha = 1) {
  const index = row * size + column;
  const hue = (index * 47 + 218) % 360;
  return `hsla(${hue}, 76%, 58%, ${alpha})`;
}

export function CnnConvolutionPlayground() {
  const [inputSize, setInputSize] = useState(7);
  const [kernelSize, setKernelSize] = useState(3);
  const [padding, setPadding] = useState(0);
  const [dilation, setDilation] = useState(1);
  const [stride, setStride] = useState(1);
  const [input, setInput] = useState(() => createInput(7));
  const [kernel, setKernel] = useState(() => createKernel("vertical", 3));
  const [preset, setPreset] = useState<KernelPreset>("vertical");
  const [position, setPosition] = useState(0);
  const [hovered, setHovered] = useState<HoveredCell>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const effectiveKernelSize = dilation * (kernelSize - 1) + 1;
  const paddedSize = inputSize + padding * 2;
  const outputSize = Math.max(0, Math.floor((paddedSize - effectiveKernelSize) / stride) + 1);
  const outputCount = outputSize * outputSize;
  const safePosition = outputCount ? Math.min(position, outputCount - 1) : 0;
  const lockedOutput = {
    row: outputSize ? Math.floor(safePosition / outputSize) : 0,
    column: outputSize ? safePosition % outputSize : 0,
  };
  const activeOutput = hovered?.kind === "output" ? hovered : lockedOutput;

  const { output, calculation, minimum, maximum } = useMemo(() => {
    const values: number[][] = [];
    let activeCalculation: Array<{
      input: number;
      weight: number;
      product: number;
      kernelRow: number;
      kernelColumn: number;
      isPadding: boolean;
    }> = [];

    for (let outputRow = 0; outputRow < outputSize; outputRow += 1) {
      const line: number[] = [];
      for (let outputColumn = 0; outputColumn < outputSize; outputColumn += 1) {
        let sum = 0;
        const products = [];
        for (let kernelRow = 0; kernelRow < kernelSize; kernelRow += 1) {
          for (let kernelColumn = 0; kernelColumn < kernelSize; kernelColumn += 1) {
            const paddedRow = outputRow * stride + kernelRow * dilation;
            const paddedColumn = outputColumn * stride + kernelColumn * dilation;
            const inputRow = paddedRow - padding;
            const inputColumn = paddedColumn - padding;
            const isPadding = inputRow < 0 || inputRow >= inputSize || inputColumn < 0 || inputColumn >= inputSize;
            const inputValue = isPadding ? 0 : input[inputRow][inputColumn];
            const weight = kernel[kernelRow][kernelColumn];
            const product = inputValue * weight;
            sum += product;
            products.push({ input: inputValue, weight, product, kernelRow, kernelColumn, isPadding });
          }
        }
        if (outputRow === activeOutput.row && outputColumn === activeOutput.column) activeCalculation = products;
        line.push(sum);
      }
      values.push(line);
    }

    const flat = values.flat();
    return {
      output: values,
      calculation: activeCalculation,
      minimum: flat.length ? Math.min(...flat) : 0,
      maximum: flat.length ? Math.max(...flat) : 0,
    };
  }, [activeOutput.column, activeOutput.row, input, inputSize, kernel, kernelSize, outputSize, padding, stride, dilation]);

  const selectedValue = output[activeOutput.row]?.[activeOutput.column] ?? 0;

  useEffect(() => {
    if (!isPlaying || outputCount < 2) return;
    const timer = window.setInterval(() => {
      setPosition((current) => (current + 1) % outputCount);
      setHovered(null);
    }, 850 / speed);
    return () => window.clearInterval(timer);
  }, [isPlaying, outputCount, speed]);

  function resetPosition() {
    setPosition(0);
    setHovered(null);
    setIsPlaying(false);
  }

  function updateInputSize(value: number) {
    setInputSize(value);
    setInput((current) => resizeMatrix(current, value));
    resetPosition();
  }

  function updateKernelSize(value: number) {
    setKernelSize(value);
    setKernel((current) =>
      preset === "custom" ? resizeMatrix(current, value) : createKernel(preset, value),
    );
    resetPosition();
  }

  function choosePreset(value: Exclude<KernelPreset, "custom">) {
    setPreset(value);
    setKernel(createKernel(value, kernelSize));
    resetPosition();
  }

  function cycleInput(row: number, column: number) {
    setInput((current) =>
      current.map((line, lineIndex) =>
        line.map((value, valueIndex) => {
          if (lineIndex !== row || valueIndex !== column) return value;
          if (value === 0) return 0.5;
          if (value === 0.5) return 1;
          return 0;
        }),
      ),
    );
  }

  function cycleKernel(row: number, column: number) {
    setPreset("custom");
    setKernel((current) =>
      current.map((line, lineIndex) =>
        line.map((value, valueIndex) => {
          if (lineIndex !== row || valueIndex !== column) return value;
          if (value < 0) return 0;
          if (value === 0) return 1;
          return -1;
        }),
      ),
    );
  }

  function kernelCoordinateAt(paddedRow: number, paddedColumn: number) {
    for (let row = 0; row < kernelSize; row += 1) {
      for (let column = 0; column < kernelSize; column += 1) {
        if (
          activeOutput.row * stride + row * dilation === paddedRow &&
          activeOutput.column * stride + column * dilation === paddedColumn
        ) return { row, column };
      }
    }
    return null;
  }

  function outputUsesInput(outputRow: number, outputColumn: number, inputRow: number, inputColumn: number) {
    const paddedRow = inputRow + padding;
    const paddedColumn = inputColumn + padding;
    for (let row = 0; row < kernelSize; row += 1) {
      for (let column = 0; column < kernelSize; column += 1) {
        if (
          outputRow * stride + row * dilation === paddedRow &&
          outputColumn * stride + column * dilation === paddedColumn
        ) return true;
      }
    }
    return false;
  }

  const operationCount = outputCount * kernelSize * kernelSize;
  const parameterCount = kernelSize * kernelSize;
  const matrixWidth = (size: number, maximumWidth = 270) => Math.min(maximumWidth, Math.max(92, size * 34));

  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 sm:px-5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-accent-strong)]">
          Interactive Convolution Visualizer
        </span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { setInput(createInput(inputSize)); choosePreset("vertical"); }} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xs font-bold text-[var(--color-fg-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">Reset</button>
          <button type="button" onClick={() => setIsPlaying((current) => !current)} disabled={outputCount < 2} className="rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-extrabold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">{isPlaying ? "Pause scan" : "Play scan"}</button>
        </div>
      </header>

      <div className="grid md:grid-cols-[190px_minmax(0,1fr)]">
        <aside className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 md:border-b-0 md:border-r">
          <div className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">Parameters</div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <SliderControl label="Input size" value={inputSize} min={3} max={9} suffix={`${inputSize} × ${inputSize}`} onChange={updateInputSize} />
            <SliderControl label="Kernel size" value={kernelSize} min={1} max={5} step={2} suffix={`${kernelSize} × ${kernelSize}`} onChange={updateKernelSize} />
            <SliderControl label="Padding" value={padding} min={0} max={3} suffix={`${padding}`} onChange={(value) => { setPadding(value); resetPosition(); }} />
            <SliderControl label="Dilation" value={dilation} min={1} max={3} suffix={`${dilation}`} onChange={(value) => { setDilation(value); resetPosition(); }} />
            <SliderControl label="Stride" value={stride} min={1} max={3} suffix={`${stride}`} onChange={(value) => { setStride(value); resetPosition(); }} />
          </div>

          <div className="mt-5 border-t border-[var(--color-border)] pt-4">
            <div className="mb-2 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-[0.13em] text-[var(--color-fg-subtle)]">
              <span>Kernel preset</span>
              {preset === "custom" && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] text-amber-800">Custom</span>}
            </div>
            <div className="grid grid-cols-2 gap-1.5 md:grid-cols-1">
              {PRESETS.map((item) => (
                <button type="button" key={item.value} onClick={() => choosePreset(item.value)} aria-pressed={preset === item.value} className={`rounded-md border px-2.5 py-2 text-left text-[11px] font-bold transition focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${preset === item.value ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]" : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg-muted)] hover:border-[var(--color-accent)]"}`}>{item.label}</button>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 p-4 sm:p-5">
          {outputSize === 0 ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
              <strong>This configuration has no valid output.</strong> The effective kernel ({effectiveKernelSize}) is larger than the padded input ({paddedSize}). Reduce the kernel or dilation, or add padding.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 items-start justify-items-center gap-y-5 md:grid-cols-[auto_18px_auto_18px_auto] md:justify-between md:gap-x-2">
                <MatrixBlock title="Input" detail={padding ? `${inputSize} × ${inputSize} + padding` : `${inputSize} × ${inputSize}`} hint="Click: 0 → .5 → 1">
                  <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${paddedSize}, minmax(0, 1fr))`, width: matrixWidth(paddedSize) }} onMouseLeave={() => setHovered(null)}>
                    {Array.from({ length: paddedSize }, (_, paddedRow) =>
                      Array.from({ length: paddedSize }, (_, paddedColumn) => {
                        const inputRow = paddedRow - padding;
                        const inputColumn = paddedColumn - padding;
                        const isPaddingCell = inputRow < 0 || inputRow >= inputSize || inputColumn < 0 || inputColumn >= inputSize;
                        const value = isPaddingCell ? 0 : input[inputRow][inputColumn];
                        const coordinate = kernelCoordinateAt(paddedRow, paddedColumn);
                        const hoveredKernel = hovered?.kind === "kernel" && coordinate && hovered.row === coordinate.row && hovered.column === coordinate.column;
                        const hoveredInput = hovered?.kind === "input" && hovered.row === inputRow && hovered.column === inputColumn;
                        const background = coordinate ? contributionColor(coordinate.row, coordinate.column, kernelSize, hoveredKernel ? 0.96 : 0.55) : undefined;

                        if (isPaddingCell) {
                          return (
                            <div key={`${paddedRow}-${paddedColumn}`} title="Zero padding" className="flex aspect-square items-center justify-center rounded-[3px] border border-dashed border-[var(--color-border)] text-[8px] font-bold text-[var(--color-fg-subtle)]" style={{ backgroundColor: background ?? "transparent" }}>0</div>
                          );
                        }

                        return (
                          <button type="button" key={`${paddedRow}-${paddedColumn}`} onClick={() => cycleInput(inputRow, inputColumn)} onMouseEnter={() => setHovered({ kind: "input", row: inputRow, column: inputColumn })} aria-label={`Input row ${inputRow + 1}, column ${inputColumn + 1}, value ${formatValue(value)}. Click to change.`} className={`flex aspect-square items-center justify-center rounded-[3px] border text-[10px] font-extrabold transition focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${hoveredInput ? "scale-110 border-white ring-2 ring-[var(--color-accent)]" : "border-[var(--color-border)]"} ${background ? "text-white" : value ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]" : "bg-[var(--color-bg)] text-[var(--color-fg-subtle)]"}`} style={background ? { backgroundColor: background } : undefined}>{formatValue(value)}</button>
                        );
                      }),
                    )}
                  </div>
                </MatrixBlock>

                <div className="pt-0 text-lg font-light text-[var(--color-fg-subtle)] md:pt-16" aria-hidden="true">×</div>

                <MatrixBlock title="Kernel" detail={`${kernelSize} × ${kernelSize}`} hint="Click: −1 → 0 → 1">
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${kernelSize}, minmax(0, 1fr))`, width: matrixWidth(kernelSize, 160) }} onMouseLeave={() => setHovered(null)}>
                    {kernel.flatMap((line, row) => line.map((value, column) => {
                      const isHovered = hovered?.kind === "kernel" && hovered.row === row && hovered.column === column;
                      return (
                        <button type="button" key={`${row}-${column}`} onClick={() => cycleKernel(row, column)} onMouseEnter={() => setHovered({ kind: "kernel", row, column })} aria-label={`Kernel row ${row + 1}, column ${column + 1}, weight ${formatValue(value)}. Click to change.`} className={`flex aspect-square items-center justify-center rounded-[5px] border border-white/40 text-[10px] font-extrabold text-white transition focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${isHovered ? "scale-110 ring-2 ring-slate-800 dark:ring-white" : ""}`} style={{ backgroundColor: contributionColor(row, column, kernelSize, isHovered ? 1 : 0.88) }}>{formatValue(value)}</button>
                      );
                    }))}
                  </div>
                </MatrixBlock>

                <div className="pt-0 text-lg font-light text-[var(--color-fg-subtle)] md:pt-16" aria-hidden="true">=</div>

                <MatrixBlock title="Output" detail={`${outputSize} × ${outputSize}`} hint="Hover to inspect">
                  <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${outputSize}, minmax(0, 1fr))`, width: matrixWidth(outputSize) }} onMouseLeave={() => setHovered(null)}>
                    {output.flatMap((line, row) => line.map((value, column) => {
                      const isActive = activeOutput.row === row && activeOutput.column === column;
                      const isRelated = hovered?.kind === "input" && outputUsesInput(row, column, hovered.row, hovered.column);
                      const range = maximum - minimum || 1;
                      const intensity = Math.abs((value - minimum) / range - 0.5) * 2;
                      return (
                        <button type="button" key={`${row}-${column}`} onClick={() => { setPosition(row * outputSize + column); setHovered(null); setIsPlaying(false); }} onMouseEnter={() => setHovered({ kind: "output", row, column })} aria-label={`Output row ${row + 1}, column ${column + 1}, value ${formatValue(value)}. Click to select.`} className={`flex aspect-square items-center justify-center rounded-[3px] border font-mono text-[9px] font-extrabold transition focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${isActive ? "scale-110 border-amber-400 bg-amber-300 text-amber-950 ring-2 ring-amber-200" : isRelated ? "border-cyan-400 bg-cyan-100 text-cyan-900" : "border-[var(--color-border)] text-[var(--color-fg)]"}`} style={!isActive && !isRelated ? { backgroundColor: `color-mix(in srgb, var(--color-accent-soft) ${Math.round(20 + intensity * 70)}%, var(--color-bg))` } : undefined}>{outputSize <= 9 ? formatValue(value) : ""}</button>
                      );
                    }))}
                  </div>
                </MatrixBlock>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { setPosition((safePosition - 1 + outputCount) % outputCount); setIsPlaying(false); }} className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-xs font-bold text-[var(--color-fg-muted)] hover:border-[var(--color-accent)]">← Step</button>
                  <span className="min-w-[104px] text-center font-mono text-xs font-bold text-[var(--color-accent-strong)]">output[{lockedOutput.row + 1}, {lockedOutput.column + 1}]</span>
                  <button type="button" onClick={() => { setPosition((safePosition + 1) % outputCount); setIsPlaying(false); }} className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-xs font-bold text-[var(--color-fg-muted)] hover:border-[var(--color-accent)]">Step →</button>
                </div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-fg-muted)]">Scan speed
                  <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-xs text-[var(--color-fg)]"><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Output shape" value={outputSize ? `${outputSize} × ${outputSize}` : "No output"} detail={`⌊(${inputSize} + 2×${padding} − ${effectiveKernelSize}) / ${stride}⌋ + 1`} />
          <Stat label="Learnable weights" value={`${parameterCount}`} detail={`One ${kernelSize} × ${kernelSize} kernel, reused everywhere`} />
          <Stat label="Multiply-adds" value={`${operationCount}`} detail={`${outputCount} outputs × ${parameterCount} weights`} />
        </div>

        {outputSize > 0 && (
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">Live calculation</div>
                <div className="mt-1 text-sm font-bold text-[var(--color-fg)]">Output ({activeOutput.row + 1}, {activeOutput.column + 1}) = <span className="text-[var(--color-accent-strong)]">{formatValue(selectedValue)}</span></div>
              </div>
              <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[10px] font-bold text-[var(--color-accent-strong)]">Effective receptive field: {effectiveKernelSize} × {effectiveKernelSize}</span>
            </div>
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1" aria-label="Products summed for the selected output">
              {calculation.map((item, index) => (
                <div key={index} className="flex shrink-0 items-center gap-1 font-mono text-[10px]">
                  {index > 0 && <span className="text-[var(--color-fg-subtle)]">+</span>}
                  <span className={`rounded px-2 py-1.5 ${item.isPadding ? "border border-dashed border-[var(--color-border)] text-[var(--color-fg-subtle)]" : "text-white"}`} style={item.isPadding ? undefined : { backgroundColor: contributionColor(item.kernelRow, item.kernelColumn, kernelSize, 0.9) }}>{formatValue(item.input)}×{formatValue(item.weight)}={formatValue(item.product)}</span>
                </div>
              ))}
              <span className="shrink-0 self-center font-mono text-xs font-extrabold text-[var(--color-fg)]">= {formatValue(selectedValue)}</span>
            </div>
          </div>
        )}

        <p className="m-0 mt-4 text-xs leading-5 text-[var(--color-fg-muted)]"><strong className="text-[var(--color-fg)]">Why this matters:</strong> the colored kernel weights are shared at every output position. Dilation spreads those weights apart; stride changes how far the receptive field moves; padding lets it reach the image border. As in most deep-learning libraries, this visualizes cross-correlation, commonly called convolution.</p>
      </div>
    </section>
  );
}

function SliderControl({ label, value, min, max, step = 1, suffix, onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix: string; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-[var(--color-fg-muted)]"><span>{label}</span><output className="rounded bg-[var(--color-bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-accent-strong)]">{suffix}</output></span>
      <input type="range" aria-label={label} min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="block w-full accent-[var(--color-accent)]" />
    </label>
  );
}

function MatrixBlock({ title, detail, hint, children }: { title: string; detail: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-end justify-between gap-3"><div><div className="text-xs font-extrabold text-[var(--color-fg)]">{title} <span className="font-medium text-[var(--color-fg-subtle)]">({detail})</span></div><div className="mt-0.5 text-[9px] text-[var(--color-fg-subtle)]">{hint}</div></div></div>
      {children}
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3.5"><div className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-[var(--color-fg-subtle)]">{label}</div><div className="mt-1 font-mono text-lg font-extrabold text-[var(--color-fg)]">{value}</div><div className="mt-1 text-[10px] leading-4 text-[var(--color-fg-muted)]">{detail}</div></div>
  );
}
