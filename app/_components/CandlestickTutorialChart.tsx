"use client";

import { useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  Chart,
  LineSeries,
  PriceLine,
} from "lightweight-charts-react-wrapper";
import {
  ColorType,
  CrosshairMode,
  LineStyle,
  type CandlestickData,
  type LineData,
  type Time,
} from "lightweight-charts";

export type CandlestickTutorialVariant =
  | "anatomy"
  | "ohlc"
  | "levels"
  | "range"
  | "uptrend"
  | "pullbacks"
  | "momentum-gain"
  | "momentum-loss"
  | "timeframes"
  | "live-ohlc"
  | "downtrend"
  | "trend-change-up-to-down"
  | "trend-change-down-to-up";

type Candle = CandlestickData<Time>;
type LinePoint = LineData<Time>;

type LessonLine = {
  data: LinePoint[];
  color: string;
  lineWidth?: 1 | 2 | 3 | 4;
  lineStyle?: LineStyle;
};

type LessonPriceLine = {
  price: number;
  title: string;
  color: string;
};

type Callout = {
  title: string;
  body: string;
  top: string;
  left?: string;
  right?: string;
  width?: string;
};

type Highlight = {
  top: string;
  left: string;
  width: string;
  height: string;
};

type LessonChart = {
  eyebrow: string;
  title: string;
  description: string;
  candles: Candle[];
  lines?: LessonLine[];
  priceLines?: LessonPriceLine[];
  callouts: Callout[];
  highlights?: Highlight[];
  barSpacing?: number;
};

type Props = {
  variant: CandlestickTutorialVariant;
};

const UP_COLOR = "#20d986";
const DOWN_COLOR = "#ff2f2f";
const WICK_UP = "#95dbc6";
const WICK_DOWN = "#e8a3aa";
const GRID = "#edf2f7";

export function CandlestickTutorialChart({ variant }: Props) {
  const lesson = lessons[variant];
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(760);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const resize = () => {
      setWidth(Math.max(320, Math.floor(node.clientWidth)));
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="not-prose my-8 rounded-[26px] border border-[#d9e7dd] bg-white p-4 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#15924c]">
            {lesson.eyebrow}
          </div>
          <h3 className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-[#122131]">
            {lesson.title}
          </h3>
        </div>
        <div className="max-w-[380px] text-[13px] leading-6 text-[#5f6f7f]">
          {lesson.description}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-[20px] border border-[#e3ece6] bg-white"
      >
        <Chart
          width={width}
          height={420}
          layout={{
            background: { type: ColorType.Solid, color: "#ffffff" },
            textColor: "#6b7280",
            fontFamily: "var(--font-manrope, ui-sans-serif), system-ui, sans-serif",
          }}
          grid={{
            vertLines: { color: GRID },
            horzLines: { color: GRID },
          }}
          crosshair={{ mode: CrosshairMode.Normal }}
          rightPriceScale={{ borderVisible: false }}
          timeScale={{
            borderVisible: false,
            barSpacing: lesson.barSpacing ?? 18,
            rightOffset: 5,
            fixLeftEdge: true,
          }}
          handleScroll={false}
          handleScale={false}
        >
          <CandlestickSeries
            data={lesson.candles}
            reactive
            upColor={UP_COLOR}
            downColor={DOWN_COLOR}
            borderUpColor="#12b971"
            borderDownColor="#df2424"
            wickUpColor={WICK_UP}
            wickDownColor={WICK_DOWN}
          >
            {lesson.priceLines?.map((line) => (
              <PriceLine
                key={`${line.title}-${line.price}`}
                price={line.price}
                title={line.title}
                color={line.color}
                lineWidth={2}
                lineStyle={LineStyle.Dashed}
                axisLabelVisible
              />
            ))}
          </CandlestickSeries>

          {lesson.lines?.map((line, index) => (
            <LineSeries
              key={`${line.color}-${index}`}
              data={line.data}
              color={line.color}
              lineWidth={line.lineWidth ?? 3}
              lineStyle={line.lineStyle ?? LineStyle.Solid}
              priceLineVisible={false}
              lastValueVisible={false}
              crosshairMarkerVisible={false}
            />
          ))}
        </Chart>

        {lesson.highlights?.map((highlight, index) => (
          <div
            key={index}
            className="pointer-events-none absolute rounded-[18px] border-[5px] border-black/85 bg-[#20d986]/5"
            style={highlight}
          />
        ))}

        {lesson.callouts.map((callout) => (
          <div
            key={callout.title}
            className="pointer-events-none absolute rounded-[14px] border-2 border-black bg-white/95 px-3 py-2 shadow-[0_8px_18px_rgba(15,23,42,0.10)]"
            style={{
              top: callout.top,
              left: callout.left,
              right: callout.right,
              width: callout.width ?? "260px",
            }}
          >
            <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#111827]">
              {callout.title}
            </div>
            <div className="mt-1 text-[12px] font-semibold leading-5 text-[#243140]">
              {callout.body}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-semibold text-[#607080]">
        <span className="rounded-full bg-[#e9fbf1] px-3 py-1 text-[#128447]">green = close above open</span>
        <span className="rounded-full bg-[#fff0f0] px-3 py-1 text-[#b92323]">red = close below open</span>
        <span className="rounded-full bg-[#f3f7f4] px-3 py-1 text-[#506070]">synthetic lesson data</span>
      </div>
    </section>
  );
}

function time(day: number): Time {
  return `2024-01-${String(day).padStart(2, "0")}` as Time;
}

function candle(day: number, open: number, high: number, low: number, close: number): Candle {
  return { time: time(day), open, high, low, close };
}

function point(day: number, value: number): LinePoint {
  return { time: time(day), value };
}

const appleLikeCandles: Candle[] = [
  candle(1, 147.4, 151.0, 145.2, 146.2),
  candle(2, 146.1, 147.2, 141.0, 142.1),
  candle(3, 142.0, 144.1, 140.5, 141.3),
  candle(4, 141.5, 143.0, 141.0, 141.6),
  candle(5, 141.7, 144.7, 141.0, 143.8),
  candle(6, 143.8, 145.8, 139.9, 140.7),
  candle(7, 140.8, 141.2, 132.1, 133.6),
  candle(8, 133.5, 134.5, 130.5, 131.1),
  candle(9, 131.0, 132.3, 128.2, 130.1),
  candle(10, 130.2, 132.0, 129.0, 130.8),
  candle(11, 130.9, 131.3, 127.4, 128.2),
  candle(12, 128.2, 130.0, 126.0, 129.4),
  candle(13, 129.5, 130.6, 126.1, 127.1),
  candle(14, 127.0, 130.1, 125.2, 129.2),
  candle(15, 129.4, 133.2, 128.7, 131.9),
  candle(16, 131.8, 132.5, 130.5, 132.2),
  candle(17, 132.3, 136.1, 131.7, 135.0),
  candle(18, 135.1, 136.5, 133.1, 134.1),
  candle(19, 134.2, 138.5, 133.4, 137.7),
  candle(20, 137.9, 143.6, 137.2, 141.2),
  candle(21, 141.2, 143.4, 140.1, 142.3),
  candle(22, 142.1, 145.8, 141.1, 144.5),
];

// Jan 3 and Jan 6 Apple candles with exact OHLC from the tutorial screenshots
const liveOHLCCandles: Candle[] = [
  candle(1,  147.4, 151.0, 145.2, 146.2),
  candle(2,  146.1, 147.2, 141.0, 142.1),
  candle(3,  142.0, 144.1, 140.5, 141.3),
  candle(4,  141.5, 143.0, 141.0, 141.6),
  candle(5,  141.7, 144.7, 141.0, 143.8),
  candle(6,  143.8, 145.8, 139.9, 140.7),
  candle(7,  140.8, 141.2, 132.1, 133.6),
  candle(8,  133.5, 134.5, 130.5, 131.1),
  candle(9,  131.0, 132.3, 128.2, 130.1),
  candle(10, 130.2, 132.0, 129.0, 130.8),
  candle(11, 130.9, 131.3, 127.4, 128.2),
  candle(12, 128.2, 130.0, 126.0, 129.4),
  candle(13, 130.24, 130.93, 124.21, 125.13), // Jan 3, 2023 — exact red candle
  candle(14, 126.05, 130.30, 124.90, 129.61), // Jan 6, 2023 — exact green candle
  candle(15, 129.4,  133.2,  128.7,  131.9),
  candle(16, 131.8,  132.5,  130.5,  132.2),
  candle(17, 132.3,  136.1,  131.7,  135.0),
  candle(18, 135.1,  136.5,  133.1,  134.1),
  candle(19, 134.2,  138.5,  133.4,  137.7),
  candle(20, 137.9,  143.6,  137.2,  141.2),
  candle(21, 141.2,  143.4,  140.1,  142.3),
  candle(22, 142.1,  145.8,  141.1,  144.5),
];

const downtrendCandles: Candle[] = [
  candle(1,  148, 150, 146, 149),
  candle(2,  149, 153, 147, 152),  // last HH before downtrend
  candle(3,  152, 154, 148, 149),
  candle(4,  149, 151, 143, 144),  // impulse 1 — LL1 forming
  candle(5,  144, 148, 142, 147),  // bounce — LH1 (< 154)
  candle(6,  147, 149, 140, 141),  // impulse 2 — LL2
  candle(7,  141, 145, 139, 144),  // bounce — LH2 (< 149)
  candle(8,  144, 146, 136, 137),  // impulse 3 — LL3
  candle(9,  137, 141, 135, 140),  // bounce — LH3 (< 145)
  candle(10, 140, 142, 132, 133),  // impulse 4 — LL4
  candle(11, 133, 137, 131, 136),  // bounce — LH4 (< 141)
  candle(12, 136, 138, 128, 129),  // impulse 5 — LL5
  candle(13, 129, 132, 127, 131),  // bounce — LH5 (< 137)
  candle(14, 131, 133, 124, 125),  // impulse 6 — LL6
  candle(15, 125, 128, 123, 127),
];

const trendChangeUpToDownCandles: Candle[] = [
  candle(1,  100, 103, 98,  102),
  candle(2,  102, 107, 101, 106), // HH1
  candle(3,  106, 108, 102, 103), // pullback — HL1
  candle(4,  103, 110, 102, 109), // HH2
  candle(5,  109, 113, 107, 112), // HH3
  candle(6,  112, 114, 108, 109), // pullback — HL2 (key level)
  candle(7,  109, 116, 108, 115), // HH4
  candle(8,  115, 118, 112, 117), // HH5 — near the peak
  candle(9,  117, 119, 114, 116), // starts to slow — HL3
  candle(10, 116, 119, 113, 115), // fails to extend cleanly
  candle(11, 115, 117, 109, 110), // drops — warning sign
  candle(12, 110, 113, 106, 107), // FIRST LOWER LOW — breaks HL2 at 108
  candle(13, 107, 111, 105, 109), // weak bounce
  candle(14, 109, 110, 103, 104), // lower high + lower low confirmed
  candle(15, 104, 107, 102, 106),
  candle(16, 106, 107, 100, 101),
];

const trendChangeDownToUpCandles: Candle[] = [
  candle(1,  152, 154, 148, 150), // top of downtrend
  candle(2,  150, 152, 144, 145), // impulse down
  candle(3,  145, 148, 143, 147), // bounce — LH1
  candle(4,  147, 149, 140, 141), // impulse down to LL1
  candle(5,  141, 144, 138, 142), // bounce — LH2 (< LH1=148)
  candle(6,  142, 144, 136, 137), // impulse down to LL2
  candle(7,  137, 139, 134, 138), // bounce — LH3 (< LH2=144)
  candle(8,  138, 140, 132, 133), // impulse down to LL3
  candle(9,  133, 138, 131, 137), // larger bounce
  candle(10, 137, 140, 134, 139), // continues up
  candle(11, 139, 143, 137, 142), // FIRST HIGHER HIGH — breaks LH3 at 139
  candle(12, 142, 144, 137, 139), // pullback — higher low forming
  candle(13, 139, 145, 138, 144), // HH2 confirms new uptrend
  candle(14, 144, 147, 142, 146),
  candle(15, 146, 149, 144, 148),
];

const lessons: Record<CandlestickTutorialVariant, LessonChart> = {
  anatomy: {
    eyebrow: "Chapter visual 01",
    title: "Candle Anatomy: Body, Wick, Open, Close",
    description: "A doji-style candle compresses a full trading period into one bar and shows that neither side won decisively.",
    barSpacing: 52,
    candles: [
      candle(1, 99, 104, 94, 102),
      candle(2, 102.1, 121, 82, 101.8),
      candle(3, 101.7, 107, 96, 102.4),
    ],
    callouts: [
      {
        title: "Upper wick",
        body: "Price traded above the body, but buyers could not keep it there.",
        top: "11%",
        left: "8%",
      },
      {
        title: "Tiny body",
        body: "Open and close are almost equal, so the candle signals indecision.",
        top: "40%",
        right: "8%",
      },
      {
        title: "Lower wick",
        body: "Sellers pushed lower, then price recovered before the period closed.",
        top: "66%",
        left: "8%",
      },
    ],
  },
  ohlc: {
    eyebrow: "Chapter visual 02",
    title: "Read One Candle as OHLC Data",
    description: "The screenshot hovered one Apple daily candle; this version marks the same idea with open, high, low, and close levels.",
    candles: appleLikeCandles,
    priceLines: [
      { price: 130.24, title: "Open 130.24", color: "#111827" },
      { price: 133.2, title: "High", color: "#15924c" },
      { price: 125.2, title: "Low", color: "#b92323" },
      { price: 127.1, title: "Close", color: "#475569" },
    ],
    callouts: [
      {
        title: "One daily candle",
        body: "A 1D candle represents one full trading day, not one tick.",
        top: "13%",
        right: "5%",
      },
      {
        title: "Open vs close",
        body: "When close is below open, the candle is red because sellers controlled the period.",
        top: "56%",
        right: "6%",
        width: "300px",
      },
    ],
  },
  levels: {
    eyebrow: "Chapter visual 03",
    title: "Support and Resistance From Repeated Reactions",
    description: "Horizontal levels matter when candles reject the same area multiple times or change behavior near it.",
    candles: appleLikeCandles,
    priceLines: [
      { price: 130.24, title: "Support", color: "#111827" },
      { price: 142.21, title: "Resistance", color: "#15924c" },
    ],
    highlights: [
      { top: "46%", left: "34%", width: "34%", height: "30%" },
    ],
    callouts: [
      {
        title: "Work from zones",
        body: "A level is useful because price reacts around an area, not because a single exact number is magic.",
        top: "14%",
        right: "5%",
        width: "340px",
      },
      {
        title: "Break and retest",
        body: "When price moves above a former ceiling, that area can become a reference point for buyers.",
        top: "69%",
        left: "5%",
        width: "310px",
      },
    ],
  },
  range: {
    eyebrow: "Chapter visual 04",
    title: "Sideways Market: Mixed Candles Inside a Box",
    description: "A range has no clean directional control. The lesson is to read boundaries before assuming trend continuation.",
    candles: [
      candle(1, 132, 134, 131, 133),
      candle(2, 133, 134.3, 129.5, 130.2),
      candle(3, 130.1, 132.2, 129.2, 131.8),
      candle(4, 132, 133.6, 130.6, 131.2),
      candle(5, 131.1, 132.8, 130.0, 132.3),
      candle(6, 132.4, 133.1, 129.8, 130.6),
      candle(7, 130.4, 131.7, 129.6, 131.4),
      candle(8, 131.5, 134.2, 130.9, 133.6),
      candle(9, 133.5, 134.8, 132.1, 132.7),
      candle(10, 132.6, 133.8, 130.5, 131.0),
      candle(11, 131.1, 132.6, 129.9, 132.0),
      candle(12, 132.1, 134.1, 131.6, 133.1),
      candle(13, 133.0, 135.4, 132.5, 135.0),
      candle(14, 135.2, 138.0, 134.8, 137.4),
    ],
    priceLines: [
      { price: 134.2, title: "Range top", color: "#111827" },
      { price: 130.0, title: "Range bottom", color: "#111827" },
    ],
    highlights: [
      { top: "30%", left: "15%", width: "56%", height: "42%" },
    ],
    callouts: [
      {
        title: "Indecision",
        body: "Red and green candles alternate while price moves sideways.",
        top: "11%",
        right: "5%",
        width: "310px",
      },
      {
        title: "Plan around edges",
        body: "Inside a range, the middle is noise; the boundaries carry the information.",
        top: "72%",
        left: "5%",
        width: "320px",
      },
    ],
  },
  uptrend: {
    eyebrow: "Chapter visual 05",
    title: "Uptrend Structure: Higher Highs and Higher Lows",
    description: "The trend is not just green candles. It is a sequence of swing highs and lows stepping upward.",
    candles: [
      candle(1, 100, 103, 98, 102),
      candle(2, 102, 107, 101, 106),
      candle(3, 106, 108, 100, 102),
      candle(4, 102, 104, 99, 100),
      candle(5, 100, 105, 99, 104),
      candle(6, 104, 111, 103, 110),
      candle(7, 110, 114, 108, 113),
      candle(8, 113, 115, 107, 109),
      candle(9, 109, 112, 106, 111),
      candle(10, 111, 118, 110, 117),
      candle(11, 117, 121, 115, 120),
      candle(12, 120, 122, 116, 118),
      candle(13, 118, 121, 115, 116),
      candle(14, 116, 119, 114, 118),
      candle(15, 118, 126, 117, 125),
      candle(16, 125, 133, 124, 132),
      candle(17, 132, 138, 131, 137),
      candle(18, 137, 140, 135, 139),
    ],
    lines: [
      {
        data: [point(4, 99), point(9, 106), point(14, 114)],
        color: "#15924c",
      },
      {
        data: [point(3, 108), point(8, 115), point(12, 122), point(18, 140)],
        color: "#111827",
        lineStyle: LineStyle.Dashed,
        lineWidth: 2,
      },
    ],
    callouts: [
      {
        title: "Higher high",
        body: "Each rally clears the prior swing high.",
        top: "14%",
        left: "8%",
      },
      {
        title: "Higher low",
        body: "Pullbacks stop above the previous low, showing buyers defend higher prices.",
        top: "61%",
        right: "6%",
        width: "300px",
      },
    ],
  },
  pullbacks: {
    eyebrow: "Chapter visual 06",
    title: "Pullbacks: Corrective Moves Against the Trend",
    description: "In a downtrend, small bullish bounces can be pullbacks rather than true reversals.",
    candles: [
      candle(1, 149, 151, 146, 147),
      candle(2, 147, 148, 142, 143),
      candle(3, 143, 145, 141, 144),
      candle(4, 144, 145, 139, 140),
      candle(5, 140, 142, 136, 137),
      candle(6, 137, 140, 136, 139),
      candle(7, 139, 140, 132, 133),
      candle(8, 133, 135, 130, 131),
      candle(9, 131, 134, 130, 133),
      candle(10, 133, 134, 126, 127),
      candle(11, 127, 129, 124, 125),
      candle(12, 125, 128, 124, 127),
      candle(13, 127, 128, 121, 122),
      candle(14, 122, 124, 119, 120),
    ],
    lines: [
      {
        data: [point(1, 150), point(14, 120)],
        color: "#df2424",
        lineWidth: 4,
      },
      {
        data: [point(3, 141), point(6, 140), point(9, 130), point(12, 128)],
        color: "#111827",
        lineStyle: LineStyle.Dashed,
        lineWidth: 2,
      },
    ],
    highlights: [
      { top: "28%", left: "18%", width: "13%", height: "22%" },
      { top: "47%", left: "44%", width: "13%", height: "22%" },
      { top: "64%", left: "68%", width: "13%", height: "20%" },
    ],
    callouts: [
      {
        title: "Corrective move",
        body: "The bounce is smaller than the impulse down.",
        top: "13%",
        right: "6%",
      },
      {
        title: "Trend context",
        body: "A pullback matters only after you define the active trend direction.",
        top: "72%",
        left: "5%",
        width: "330px",
      },
    ],
  },
  "momentum-gain": {
    eyebrow: "Chapter visual 07",
    title: "Momentum Gain: Tight Movement and Larger Candles",
    description: "Fast movement usually has clean direction, shallow pauses, and candles that expand as participation increases.",
    candles: [
      candle(1, 101, 102, 100, 101.5),
      candle(2, 101.6, 106, 101, 105),
      candle(3, 105.2, 111, 104.5, 110.4),
      candle(4, 110.6, 116.5, 109.8, 115.7),
      candle(5, 115.9, 123.5, 115.1, 122.8),
      candle(6, 123.2, 131.8, 122.6, 131.0),
      candle(7, 131.2, 140.5, 130.8, 139.8),
      candle(8, 140.1, 151.3, 139.5, 150.8),
    ],
    lines: [
      {
        data: [point(1, 102.5), point(8, 151.8)],
        color: "#111827",
        lineWidth: 3,
      },
      {
        data: [point(1, 99.5), point(8, 138.5)],
        color: "#111827",
        lineWidth: 3,
      },
    ],
    callouts: [
      {
        title: "Tight channel",
        body: "Candles keep advancing inside a narrow path.",
        top: "11%",
        left: "6%",
      },
      {
        title: "Body expansion",
        body: "Each candle covers more distance, so bullish momentum is increasing.",
        top: "52%",
        right: "6%",
        width: "330px",
      },
    ],
  },
  "momentum-loss": {
    eyebrow: "Chapter visual 08",
    title: "Momentum Loss: Shrinking Bodies and Color Change",
    description: "After a strong run, smaller candles and the first strong opposite-color close warn that control may be shifting.",
    candles: [
      candle(1, 90, 95, 89, 94),
      candle(2, 94, 100, 93, 99),
      candle(3, 99, 108, 98, 107),
      candle(4, 107, 117, 106, 116),
      candle(5, 116, 125, 115, 124),
      candle(6, 124, 131, 123, 130),
      candle(7, 130, 135, 129, 134),
      candle(8, 134, 138, 133, 137),
      candle(9, 137, 140, 134, 138),
      candle(10, 138, 139, 133, 134),
      candle(11, 134, 136, 125, 127),
      candle(12, 127, 131, 124, 130),
      candle(13, 130, 132, 123, 124),
      candle(14, 124, 126, 119, 120),
      candle(15, 120, 122, 116, 118),
    ],
    lines: [
      {
        data: [point(9, 139), point(14, 119)],
        color: "#df2424",
        lineWidth: 4,
      },
    ],
    highlights: [
      { top: "19%", left: "50%", width: "13%", height: "18%" },
    ],
    callouts: [
      {
        title: "Shrinking size",
        body: "The candles near the top stop expanding, showing weaker follow-through.",
        top: "10%",
        left: "6%",
        width: "310px",
      },
      {
        title: "Color change",
        body: "A red close after a green run can mark momentum loss, not an automatic short signal.",
        top: "45%",
        right: "5%",
        width: "340px",
      },
    ],
  },

  timeframes: {
    eyebrow: "Chapter visual 09",
    title: "Time Frame: One Candle = One Complete Period",
    description: "Switching from 1D to 1H shows the same price movement 24× more granularly. The structure is identical; the zoom level changes.",
    candles: appleLikeCandles,
    callouts: [
      {
        title: "1D shown here",
        body: "Each candle represents one full trading day. The horizontal axis marks where each day starts.",
        top: "12%",
        right: "4%",
        width: "340px",
      },
      {
        title: "Switch to 1H",
        body: "On a 1H chart the same section would show roughly 6× as many candles — one per market hour instead of one per day.",
        top: "63%",
        left: "4%",
        width: "330px",
      },
    ],
  },

  "live-ohlc": {
    eyebrow: "Chapter visual 10",
    title: "Red Candle: Jan 3, Apple — Open 130.24 → Close 125.13",
    description: "Apple opened at $130.24 and closed at $125.13 on January 3, 2023. The wick ends mark the session high ($130.93) and low ($124.21).",
    candles: liveOHLCCandles,
    priceLines: [
      { price: 130.24, title: "Open 130.24", color: "#111827" },
      { price: 130.93, title: "High 130.93", color: "#15924c" },
      { price: 124.21, title: "Low 124.21", color: "#b92323" },
      { price: 125.13, title: "Close 125.13", color: "#475569" },
    ],
    callouts: [
      {
        title: "Red = close below open",
        body: "Close (125.13) is below Open (130.24). Sellers controlled the full day and price dropped $5.11.",
        top: "13%",
        right: "4%",
        width: "310px",
      },
      {
        title: "Lower wick = session low",
        body: "The wick tip reaches 124.21 — the lowest price any participant agreed to on Jan 3. Buyers stepped in there and pushed price back up to 125.",
        top: "67%",
        left: "4%",
        width: "330px",
      },
    ],
  },

  downtrend: {
    eyebrow: "Chapter visual 11",
    title: "Downtrend: Lower Lows and Lower Highs",
    description: "A downtrend steps downward through repeating impulse drops and corrective bounces — the mirror image of an uptrend.",
    candles: downtrendCandles,
    lines: [
      {
        data: [point(2, 153), point(5, 148), point(7, 145), point(9, 141), point(11, 137), point(13, 132)],
        color: "#df2424",
        lineStyle: LineStyle.Dashed,
        lineWidth: 2,
      },
      {
        data: [point(4, 143), point(6, 140), point(8, 136), point(10, 132), point(12, 128), point(14, 124)],
        color: "#111827",
        lineWidth: 3,
      },
    ],
    callouts: [
      {
        title: "Lower high",
        body: "Every corrective bounce fails below the prior swing high. Sellers defend progressively lower levels.",
        top: "12%",
        right: "5%",
        width: "320px",
      },
      {
        title: "Lower low",
        body: "Each impulse drop breaks below the prior floor. Buyers cannot hold the same support area.",
        top: "62%",
        left: "5%",
        width: "310px",
      },
    ],
  },

  "trend-change-up-to-down": {
    eyebrow: "Chapter visual 12",
    title: "Trend Change: First Lower Low Signals Uptrend Damage",
    description: "An uptrend is intact while higher lows hold. The first break below a prior higher low is the structural warning to watch.",
    candles: trendChangeUpToDownCandles,
    lines: [
      {
        data: [point(1, 98), point(3, 102), point(6, 108), point(9, 114)],
        color: "#15924c",
        lineWidth: 3,
      },
      {
        data: [point(9, 114), point(12, 106)],
        color: "#df2424",
        lineWidth: 3,
        lineStyle: LineStyle.Dashed,
      },
    ],
    callouts: [
      {
        title: "Higher lows held",
        body: "Pullbacks kept stopping above the prior low — uptrend structure was clean through this section.",
        top: "11%",
        left: "5%",
        width: "320px",
      },
      {
        title: "First lower low",
        body: "Price breaks below the prior higher low here. This is the first structural warning the uptrend is damaged.",
        top: "58%",
        right: "4%",
        width: "310px",
      },
    ],
  },

  "trend-change-down-to-up": {
    eyebrow: "Chapter visual 13",
    title: "Trend Change: First Higher High Signals Downtrend Weakening",
    description: "A downtrend is intact while lower highs hold. The first break above a prior lower high is the structural signal that buyers are returning.",
    candles: trendChangeDownToUpCandles,
    lines: [
      {
        data: [point(1, 154), point(3, 148), point(5, 144), point(7, 139), point(8, 140)],
        color: "#df2424",
        lineWidth: 3,
      },
      {
        data: [point(8, 140), point(11, 143)],
        color: "#15924c",
        lineWidth: 3,
        lineStyle: LineStyle.Dashed,
      },
    ],
    callouts: [
      {
        title: "Lower highs held",
        body: "Each bounce was capped below the prior rally high — the downtrend structure was clean through this section.",
        top: "12%",
        left: "5%",
        width: "330px",
      },
      {
        title: "First higher high",
        body: "Price breaks above the prior lower high here. The downtrend rhythm is no longer clean — the structure has shifted.",
        top: "62%",
        right: "4%",
        width: "310px",
      },
    ],
  },
};
