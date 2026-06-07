"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * GaltonBoard — an interactive "bean machine" simulation.
 *
 * Each ball makes `rows` independent left/right bounces (a fair coin each peg).
 * The number of rights is Binomial(rows, 1/2), and as balls accumulate the bins
 * converge to the normal distribution — a live demonstration of the central
 * limit theorem and the bell curve used in the Black–Scholes formula.
 *
 * Canvas-rendered with requestAnimationFrame; counts live in refs so the
 * animation loop never fights React state.
 */

const W = 760;
const H = 560;
const BOARD_TOP = 36;
const PEG_GAP_Y = 22;
const PEG_GAP_X = 34;
const CENTER_X = W / 2;

const GREEN = "#15924c";
const GREEN_SOFT = "#20d986";
const PEG = "#c4d3cb";
const BALL = "#ef5a3c";

type Waypoint = { x: number; y: number };
type Ball = { wps: Waypoint[]; bin: number; t: number; color: string };

function logFactorial(n: number): number {
  let s = 0;
  for (let i = 2; i <= n; i++) s += Math.log(i);
  return s;
}

export function GaltonBoard({ rows = 12 }: { rows?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countsRef = useRef<number[]>(new Array(rows + 1).fill(0));
  const ballsRef = useRef<Ball[]>([]);
  const runningRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);
  const spawnAccRef = useRef<number>(0);

  const [running, setRunning] = useState(false);
  const [total, setTotal] = useState(0);

  const boardBottom = BOARD_TOP + (rows - 1) * PEG_GAP_Y;
  const histTop = boardBottom + 26;
  const histBottom = H - 30;
  const maxBar = histBottom - histTop;

  const binCenterX = useCallback((bin: number) => CENTER_X + (bin - rows / 2) * PEG_GAP_X, [rows]);

  // Build one ball with a random path through the pegs.
  const makeBall = useCallback((): Ball => {
    const wps: Waypoint[] = [{ x: CENTER_X, y: BOARD_TOP - PEG_GAP_Y }];
    let rights = 0;
    for (let r = 0; r < rows; r++) {
      if (Math.random() < 0.5) rights++;
      const net = 2 * rights - (r + 1); // rights - lefts after r+1 rows
      wps.push({ x: CENTER_X + net * 0.5 * PEG_GAP_X, y: BOARD_TOP + r * PEG_GAP_Y });
    }
    // final drop straight into the bin
    wps.push({ x: binCenterX(rights), y: histBottom });
    return { wps, bin: rights, t: 0, color: BALL };
  }, [rows, binCenterX, histBottom]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    // pegs (triangle)
    ctx.fillStyle = PEG;
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i <= r; i++) {
        const x = CENTER_X + (i - r / 2) * PEG_GAP_X;
        const y = BOARD_TOP + r * PEG_GAP_Y;
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const counts = countsRef.current;
    const tot = counts.reduce((a, b) => a + b, 0);
    const maxCount = Math.max(1, ...counts);

    // histogram bars
    const barW = PEG_GAP_X - 6;
    for (let b = 0; b <= rows; b++) {
      const h = (counts[b] / maxCount) * maxBar;
      const x = binCenterX(b) - barW / 2;
      ctx.fillStyle = GREEN_SOFT;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(x, histBottom - h, barW, h);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, histBottom - h, barW, h);
    }

    // theoretical normal overlay (mean = rows/2, sigma = sqrt(rows)/2)
    if (tot > 0) {
      const mean = rows / 2;
      const sigma = Math.sqrt(rows) / 2;
      // peak expected count, to share the bars' scale
      const peakFrac = Math.exp(logFactorial(rows) - 2 * logFactorial(rows / 2) - rows * Math.LN2);
      const peakCount = tot * peakFrac;
      const scale = (maxBar * 0.98) / Math.max(maxCount, peakCount);
      ctx.beginPath();
      ctx.strokeStyle = GREEN;
      ctx.lineWidth = 3;
      for (let i = 0; i <= 240; i++) {
        const bin = (i / 240) * rows;
        const frac = Math.exp(-((bin - mean) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
        const count = tot * frac;
        const x = binCenterX(bin);
        const y = histBottom - count * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // baseline
    ctx.strokeStyle = "#cdd9d1";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(binCenterX(0) - barW / 2 - 6, histBottom + 0.5);
    ctx.lineTo(binCenterX(rows) + barW / 2 + 6, histBottom + 0.5);
    ctx.stroke();

    // falling balls
    for (const ball of ballsRef.current) {
      const seg = Math.min(Math.floor(ball.t), ball.wps.length - 2);
      const frac = ball.t - seg;
      const a = ball.wps[seg];
      const c = ball.wps[seg + 1];
      const x = a.x + (c.x - a.x) * frac;
      const y = a.y + (c.y - a.y) * frac;
      ctx.beginPath();
      ctx.fillStyle = ball.color;
      ctx.arc(x, y, 4.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [rows, binCenterX, histBottom, maxBar]);

  // animation loop
  useEffect(() => {
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - (lastRef.current || now)) / 1000);
      lastRef.current = now;

      if (runningRef.current) {
        spawnAccRef.current += dt;
        const spawnEvery = 0.12;
        while (spawnAccRef.current >= spawnEvery && ballsRef.current.length < 60) {
          spawnAccRef.current -= spawnEvery;
          ballsRef.current.push(makeBall());
        }
      }

      const speed = 11; // segments (rows) per second
      const landed: number[] = [];
      ballsRef.current = ballsRef.current.filter((ball) => {
        ball.t += speed * dt;
        if (ball.t >= ball.wps.length - 1) {
          landed.push(ball.bin);
          return false;
        }
        return true;
      });
      if (landed.length) {
        for (const b of landed) countsRef.current[b]++;
        setTotal((t) => t + landed.length);
      }

      draw();
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw, makeBall]);

  const toggleRun = () => {
    runningRef.current = !runningRef.current;
    setRunning(runningRef.current);
  };

  const dropMany = (n: number) => {
    const counts = countsRef.current;
    for (let k = 0; k < n; k++) {
      let rights = 0;
      for (let r = 0; r < rows; r++) if (Math.random() < 0.5) rights++;
      counts[rights]++;
    }
    setTotal((t) => t + n);
  };

  const reset = () => {
    runningRef.current = false;
    setRunning(false);
    ballsRef.current = [];
    countsRef.current = new Array(rows + 1).fill(0);
    setTotal(0);
  };

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-[22px] border border-[#d9e7dd] bg-white shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-3 border-b border-[#eef3ef] px-5 pt-4 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#15924c]">
            Interactive · the bell curve, built from coin flips
          </div>
          <h4 className="mt-1 text-[18px] font-extrabold tracking-[-0.02em] text-[#122131]">
            Galton board: {rows} random bounces → a normal distribution
          </h4>
        </div>
        <div className="text-[13px] font-semibold text-[#5f6f7f]">
          Balls dropped: <span className="font-extrabold text-[#15924c]">{total.toLocaleString()}</span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full"
        style={{ aspectRatio: `${W} / ${H}` }}
        aria-label="Animated Galton board converging to a normal distribution"
      />

      <figcaption className="flex flex-wrap items-center gap-2 border-t border-[#eef3ef] px-5 py-3 text-[12px] text-[#5f6f7f]">
        <button
          onClick={toggleRun}
          className="rounded-full bg-[#169b52] px-4 py-1.5 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(22,163,74,0.18)] transition hover:-translate-y-0.5"
        >
          {running ? "Pause" : "Drop balls"}
        </button>
        <button
          onClick={() => dropMany(500)}
          className="rounded-full border border-[#cfe3d5] bg-white px-4 py-1.5 text-[12px] font-bold text-[#15924c] transition hover:bg-[#f3faf5]"
        >
          +500 instantly
        </button>
        <button
          onClick={reset}
          className="rounded-full border border-[#e2c9c9] bg-white px-4 py-1.5 text-[12px] font-bold text-[#b92323] transition hover:bg-[#fdf3f3]"
        >
          Reset
        </button>
        <span className="ml-auto inline-flex items-center gap-2 font-semibold text-[#2b3a49]">
          <span className="inline-block h-0 w-5 rounded" style={{ borderTop: `3px solid ${GREEN}` }} />
          theoretical normal curve
        </span>
      </figcaption>
    </figure>
  );
}

export default GaltonBoard;
