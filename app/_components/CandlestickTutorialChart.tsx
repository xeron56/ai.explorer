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
  | "momentum-loss";

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
};
