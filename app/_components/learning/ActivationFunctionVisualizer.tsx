"use client";

import { useMemo, useState } from "react";

type ActivationType =
  | "relu"
  | "leaky_relu"
  | "prelu"
  | "elu"
  | "sigmoid"
  | "tanh"
  | "gelu"
  | "swish"
  | "mish"
  | "softmax";

type Point = { x: number; y: number; dy: number };

const ACTIVATIONS: Array<{ id: ActivationType; label: string; formula: string }> = [
  { id: "relu", label: "ReLU", formula: "f(x) = max(0, x)" },
  { id: "leaky_relu", label: "Leaky ReLU", formula: "f(x) = x if x > 0 else αx" },
  { id: "prelu", label: "PReLU", formula: "f(x) = x if x > 0 else αx (learnable α)" },
  { id: "elu", label: "ELU", formula: "f(x) = x if x > 0 else α(e^x - 1)" },
  { id: "sigmoid", label: "Sigmoid", formula: "f(x) = 1 / (1 + e^-x)" },
  { id: "tanh", label: "Tanh", formula: "f(x) = (e^x - e^-x) / (e^x + e^-x)" },
  { id: "gelu", label: "GELU", formula: "f(x) = x · Φ(x)" },
  { id: "swish", label: "Swish / SiLU", formula: "f(x) = x · σ(βx)" },
  { id: "mish", label: "Mish", formula: "f(x) = x · tanh(ln(1 + e^x))" },
  { id: "softmax", label: "Softmax", formula: "p_i = e^(z_i/T) / ∑ e^(z_j/T)" },
];

export function ActivationFunctionVisualizer() {
  const [activeFn, setActiveFn] = useState<ActivationType>("relu");
  const [compareFn, setCompareFn] = useState<ActivationType | "none">("none");
  const [alpha, setAlpha] = useState(0.1);
  const [beta, setBeta] = useState(1.0);
  const [temperature, setTemperature] = useState(1.0);
  const [showDerivative, setShowDerivative] = useState(true);
  const [hoveredX, setHoveredX] = useState<number | null>(null);

  // Softmax logits simulation
  const [logits, setLogits] = useState<number[]>([2.5, 1.0, 0.2, -0.5, -1.8]);

  // Compute activation value & derivative for a given x
  const evalActivation = (type: ActivationType, x: number): { y: number; dy: number } => {
    const eps = 1e-5;
    let y = 0;

    switch (type) {
      case "relu":
        y = Math.max(0, x);
        break;
      case "leaky_relu":
      case "prelu":
        y = x > 0 ? x : alpha * x;
        break;
      case "elu":
        y = x > 0 ? x : alpha * (Math.exp(x) - 1);
        break;
      case "sigmoid":
        y = 1 / (1 + Math.exp(-x));
        break;
      case "tanh":
        y = Math.tanh(x);
        break;
      case "gelu": {
        const c = Math.sqrt(2 / Math.PI);
        y = 0.5 * x * (1 + Math.tanh(c * (x + 0.044715 * Math.pow(x, 3))));
        break;
      }
      case "swish": {
        const sig = 1 / (1 + Math.exp(-beta * x));
        y = x * sig;
        break;
      }
      case "mish": {
        const softplus = Math.log(1 + Math.exp(x));
        y = x * Math.tanh(softplus);
        break;
      }
      case "softmax":
        y = 1 / (1 + Math.exp(-x));
        break;
    }

    // Numerical derivative
    let yPlus = 0;
    let yMinus = 0;
    switch (type) {
      case "relu":
        yPlus = Math.max(0, x + eps);
        yMinus = Math.max(0, x - eps);
        break;
      case "leaky_relu":
      case "prelu":
        yPlus = x + eps > 0 ? x + eps : alpha * (x + eps);
        yMinus = x - eps > 0 ? x - eps : alpha * (x - eps);
        break;
      case "elu":
        yPlus = x + eps > 0 ? x + eps : alpha * (Math.exp(x + eps) - 1);
        yMinus = x - eps > 0 ? x - eps : alpha * (Math.exp(x - eps) - 1);
        break;
      case "sigmoid":
        yPlus = 1 / (1 + Math.exp(-(x + eps)));
        yMinus = 1 / (1 + Math.exp(-(x - eps)));
        break;
      case "tanh":
        yPlus = Math.tanh(x + eps);
        yMinus = Math.tanh(x - eps);
        break;
      case "gelu": {
        const c = Math.sqrt(2 / Math.PI);
        yPlus = 0.5 * (x + eps) * (1 + Math.tanh(c * ((x + eps) + 0.044715 * Math.pow(x + eps, 3))));
        yMinus = 0.5 * (x - eps) * (1 + Math.tanh(c * ((x - eps) + 0.044715 * Math.pow(x - eps, 3))));
        break;
      }
      case "swish": {
        const sigP = 1 / (1 + Math.exp(-beta * (x + eps)));
        const sigM = 1 / (1 + Math.exp(-beta * (x - eps)));
        yPlus = (x + eps) * sigP;
        yMinus = (x - eps) * sigM;
        break;
      }
      case "mish": {
        const spP = Math.log(1 + Math.exp(x + eps));
        const spM = Math.log(1 + Math.exp(x - eps));
        yPlus = (x + eps) * Math.tanh(spP);
        yMinus = (x - eps) * Math.tanh(spM);
        break;
      }
      default:
        yPlus = y;
        yMinus = y;
    }

    const dy = (yPlus - yMinus) / (2 * eps);
    return { y, dy };
  };

  // Generate curve dataset for range x ∈ [-6, 6]
  const mainPoints = useMemo(() => {
    const pts: Point[] = [];
    for (let x = -6; x <= 6; x += 0.05) {
      const { y, dy } = evalActivation(activeFn, x);
      pts.push({ x, y, dy });
    }
    return pts;
  }, [activeFn, alpha, beta]);

  const comparePoints = useMemo(() => {
    if (compareFn === "none") return [];
    const pts: Point[] = [];
    for (let x = -6; x <= 6; x += 0.05) {
      const { y, dy } = evalActivation(compareFn, x);
      pts.push({ x, y, dy });
    }
    return pts;
  }, [compareFn, alpha, beta]);

  // Softmax calculation
  const softmaxProbs = useMemo(() => {
    const expVals = logits.map((z) => Math.exp(z / temperature));
    const sumExp = expVals.reduce((a, b) => a + b, 0);
    return expVals.map((v) => v / sumExp);
  }, [logits, temperature]);

  // SVG coordinate transformation
  const width = 560;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 30, left: 35 };

  const xMin = -6;
  const xMax = 6;
  const yMin = -2.5;
  const yMax = 3.5;

  const toSvgX = (x: number) =>
    margin.left + ((x - xMin) / (xMax - xMin)) * (width - margin.left - margin.right);
  const toSvgY = (y: number) =>
    height - margin.bottom - ((y - yMin) / (yMax - yMin)) * (height - margin.top - margin.bottom);
  const fromSvgX = (svgX: number) => {
    const clamped = Math.max(margin.left, Math.min(width - margin.right, svgX));
    return xMin + ((clamped - margin.left) / (width - margin.left - margin.right)) * (xMax - xMin);
  };

  const buildPath = (pts: Point[], key: "y" | "dy") => {
    if (!pts.length) return "";
    return pts.reduce(
      (acc, pt, idx) =>
        `${acc} ${idx === 0 ? "M" : "L"} ${toSvgX(pt.x).toFixed(1)} ${toSvgY(pt[key]).toFixed(1)}`,
      "",
    );
  };

  const currentMeta = ACTIVATIONS.find((a) => a.id === activeFn)!;
  const hoveredPoint =
    hoveredX !== null ? evalActivation(activeFn, hoveredX) : null;

  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
      {/* Compact Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 sm:px-5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-accent-strong)]">
          Activation Graph Explorer
        </span>

        {/* Function Dropdown & Compare Select */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-[11px] font-bold text-[var(--color-fg-muted)]">
            Function:
            <select
              value={activeFn}
              onChange={(e) => setActiveFn(e.target.value as ActivationType)}
              className="ml-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1 text-xs font-bold text-[var(--color-fg)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            >
              {ACTIVATIONS.map((fn) => (
                <option key={fn.id} value={fn.id}>
                  {fn.label}
                </option>
              ))}
            </select>
          </label>

          {activeFn !== "softmax" && (
            <label className="text-[11px] font-bold text-[var(--color-fg-muted)]">
              Compare:
              <select
                value={compareFn}
                onChange={(e) => setCompareFn(e.target.value as ActivationType | "none")}
                className="ml-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-xs text-[var(--color-fg-muted)] focus:outline-none"
              >
                <option value="none">None</option>
                {ACTIVATIONS.filter((fn) => fn.id !== "softmax" && fn.id !== activeFn).map((fn) => (
                  <option key={fn.id} value={fn.id}>
                    {fn.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="grid md:grid-cols-[210px_minmax(0,1fr)]">
        {/* Controls Sidebar */}
        <aside className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 md:border-b-0 md:border-r">
          <div className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
            Parameters & Displays
          </div>

          <div className="grid gap-3.5">
            {/* Derivative toggle */}
            {activeFn !== "softmax" && (
              <label className="flex items-center gap-2 text-xs font-bold text-[var(--color-fg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDerivative}
                  onChange={(e) => setShowDerivative(e.target.checked)}
                  className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                Show Derivative f'(x)
              </label>
            )}

            {/* Sliders for parametric activations */}
            {(activeFn === "leaky_relu" || activeFn === "prelu" || activeFn === "elu") && (
              <SliderControl
                label="Negative slope (α)"
                value={alpha}
                min={0.0}
                max={0.5}
                step={0.02}
                suffix={alpha.toFixed(2)}
                onChange={setAlpha}
              />
            )}

            {activeFn === "swish" && (
              <SliderControl
                label="Beta scale (β)"
                value={beta}
                min={0.2}
                max={3.0}
                step={0.1}
                suffix={beta.toFixed(1)}
                onChange={setBeta}
              />
            )}

            {activeFn === "softmax" && (
              <SliderControl
                label="Temperature (T)"
                value={temperature}
                min={0.2}
                max={5.0}
                step={0.1}
                suffix={temperature.toFixed(1)}
                onChange={setTemperature}
              />
            )}
          </div>

          <div className="mt-4 border-t border-[var(--color-border)] pt-3 text-[11px] text-[var(--color-fg-muted)]">
            <strong className="block text-[var(--color-fg)] font-bold">Formula:</strong>
            <code className="mt-1 block rounded bg-[var(--color-bg)] p-1.5 font-mono text-[10px] text-[var(--color-accent-strong)]">
              {currentMeta.formula}
            </code>
          </div>
        </aside>

        {/* Display Canvas Panel */}
        <div className="p-4 sm:p-5">
          {activeFn === "softmax" ? (
            /* Softmax Bar Chart Visualizer */
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-fg-subtle)]">
                Softmax Multi-Class Probability Distribution (T = {temperature})
              </div>
              <div className="grid gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                {logits.map((z, idx) => {
                  const prob = softmaxProbs[idx];
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <span className="w-16 font-mono font-bold text-[var(--color-fg)]">
                        Class {idx + 1}:
                      </span>
                      <input
                        type="range"
                        aria-label={`Class ${idx + 1} logit`}
                        min={-5}
                        max={5}
                        step={0.1}
                        value={z}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setLogits((prev) => prev.map((item, i) => (i === idx ? val : item)));
                        }}
                        className="w-24 accent-[var(--color-accent)]"
                      />
                      <span className="w-12 text-right font-mono text-[11px] text-[var(--color-fg-subtle)]">
                        z={z.toFixed(1)}
                      </span>

                      {/* Bar fill */}
                      <div className="flex-1 overflow-hidden rounded-full bg-[var(--color-bg-elevated)] h-4">
                        <div
                          className="h-full bg-[var(--color-accent)] transition-all duration-150"
                          style={{ width: `${(prob * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <span className="w-14 font-mono font-bold text-[var(--color-accent-strong)] text-right">
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
                Higher Temperature ($T &gt; 1$) softens the distribution towards uniform probabilities; lower Temperature ($T &lt; 1$) amplifies confidence.
              </p>
            </div>
          ) : (
            /* SVG Graph Canvas */
            <div>
              <div className="relative">
                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const svgX = ((e.clientX - rect.left) / rect.width) * width;
                    setHoveredX(fromSvgX(svgX));
                  }}
                  onMouseLeave={() => setHoveredX(null)}
                >
                  {/* Grid Lines */}
                  {[-4, -2, 0, 2, 4].map((gridX) => (
                    <line
                      key={`x-${gridX}`}
                      x1={toSvgX(gridX)}
                      y1={margin.top}
                      x2={toSvgX(gridX)}
                      y2={height - margin.bottom}
                      stroke="var(--color-border)"
                      strokeWidth={gridX === 0 ? "1.5" : "0.5"}
                      strokeDasharray={gridX === 0 ? undefined : "3,3"}
                    />
                  ))}
                  {[-2, -1, 0, 1, 2, 3].map((gridY) => (
                    <line
                      key={`y-${gridY}`}
                      x1={margin.left}
                      y1={toSvgY(gridY)}
                      x2={width - margin.right}
                      y2={toSvgY(gridY)}
                      stroke="var(--color-border)"
                      strokeWidth={gridY === 0 ? "1.5" : "0.5"}
                      strokeDasharray={gridY === 0 ? undefined : "3,3"}
                    />
                  ))}

                  {/* Axis Ticks Labels */}
                  {[-4, -2, 0, 2, 4].map((gridX) => (
                    <text
                      key={`lbl-x-${gridX}`}
                      x={toSvgX(gridX)}
                      y={height - 10}
                      textAnchor="middle"
                      className="fill-[var(--color-fg-subtle)] text-[9px] font-mono"
                    >
                      {gridX}
                    </text>
                  ))}
                  {[-2, -1, 1, 2, 3].map((gridY) => (
                    <text
                      key={`lbl-y-${gridY}`}
                      x={margin.left - 8}
                      y={toSvgY(gridY) + 3}
                      textAnchor="end"
                      className="fill-[var(--color-fg-subtle)] text-[9px] font-mono"
                    >
                      {gridY}
                    </text>
                  ))}

                  {/* Compare Function Plot */}
                  {compareFn !== "none" && (
                    <path
                      d={buildPath(comparePoints, "y")}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2.2"
                      strokeDasharray="4,4"
                    />
                  )}

                  {/* Derivative Plot */}
                  {showDerivative && (
                    <path
                      d={buildPath(mainPoints, "dy")}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.8"
                      strokeDasharray="2,2"
                    />
                  )}

                  {/* Main Function Plot */}
                  <path
                    d={buildPath(mainPoints, "y")}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="3"
                  />

                  {/* Hover Cursor Vertical Line & Dot */}
                  {hoveredX !== null && hoveredPoint && (
                    <>
                      <line
                        x1={toSvgX(hoveredX)}
                        y1={margin.top}
                        x2={toSvgX(hoveredX)}
                        y2={height - margin.bottom}
                        stroke="var(--color-fg-subtle)"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                      <circle
                        cx={toSvgX(hoveredX)}
                        cy={toSvgY(hoveredPoint.y)}
                        r="5"
                        fill="var(--color-accent)"
                        className="stroke-white stroke-2"
                      />
                      {showDerivative && (
                        <circle
                          cx={toSvgX(hoveredX)}
                          cy={toSvgY(hoveredPoint.dy)}
                          r="4"
                          fill="#f59e0b"
                          className="stroke-white stroke-2"
                        />
                      )}
                    </>
                  )}
                </svg>
              </div>

              {/* Legend & Hover Reading Bar */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5">
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-[var(--color-accent-strong)]">
                    <span className="h-2.5 w-4 rounded bg-[var(--color-accent)] inline-block" /> f(x)
                  </span>
                  {showDerivative && (
                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <span className="h-0.5 w-4 bg-amber-500 inline-block border-dashed border-t" /> f'(x) gradient
                    </span>
                  )}
                  {compareFn !== "none" && (
                    <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                      <span className="h-0.5 w-4 bg-purple-500 inline-block border-dashed border-t" /> Compare ({ACTIVATIONS.find((a) => a.id === compareFn)?.label})
                    </span>
                  )}
                </div>

                {hoveredX !== null && hoveredPoint ? (
                  <div className="font-mono text-xs font-bold text-[var(--color-fg)]">
                    x = <span className="text-[var(--color-accent-strong)]">{hoveredX.toFixed(2)}</span> | f(x) ={" "}
                    <span className="text-[var(--color-accent-strong)]">{hoveredPoint.y.toFixed(3)}</span>
                    {showDerivative && (
                      <span> | f'(x) = <span className="text-amber-600 dark:text-amber-400">{hoveredPoint.dy.toFixed(3)}</span></span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-[var(--color-fg-subtle)]">
                    Hover graph to inspect values
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-xs text-[var(--color-fg-muted)]">
        <strong>Activation Function Visualizer:</strong> Displays activation curves $f(x)$ and gradient derivatives $f'(x)$ to illustrate vanishing gradients, non-linearity, and smooth saturation.
      </footer>
    </section>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step = 0.01,
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
