import React from "react";

const searchActivityData = [
  { month: "Oct", value: 12500 },
  { month: "Nov", value: 14200 },
  { month: "Dec", value: 13600 },
  { month: "Jan", value: 15000 },
  { month: "Feb", value: 16500 },
  { month: "Mar", value: 15200 },
];

const Y_LABELS = [18000, 13500, 9000, 4500, 0];
const Y_MAX = 18000;
const CHART_H = 220;
const CHART_W = 600;
const PAD_TOP = 10;

function getCoords(data: { month: string; value: number }[]) {
  return data.map((d, i) => ({
    x: (i / (data.length - 1)) * CHART_W,
    y: PAD_TOP + (1 - d.value / Y_MAX) * (CHART_H - PAD_TOP),
  }));
}

function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  const t = 0.35;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) * t;
    const cp1y = p1.y + (p2.y - p0.y) * t;
    const cp2x = p2.x - (p3.x - p1.x) * t;
    const cp2y = p2.y - (p3.y - p1.y) * t;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export default function SearchActivity() {
  const coords = getCoords(searchActivityData);
  const linePath = smoothPath(coords);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Search Activity</h2>
      <div className="flex gap-3">
        {/* Y-axis */}
        <div
          className="flex flex-col justify-between text-xs text-gray-400 text-right shrink-0"
          style={{ height: CHART_H, paddingTop: PAD_TOP }}
        >
          {Y_LABELS.map((v) => (
            <span key={v}>{v.toLocaleString()}</span>
          ))}
        </div>

        {/* SVG Chart */}
        <div className="flex-1 min-w-0">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            style={{ width: "100%", height: CHART_H, display: "block" }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Dashed grid */}
            {Y_LABELS.map((v) => {
              const y = PAD_TOP + (1 - v / Y_MAX) * (CHART_H - PAD_TOP);
              return (
                <line
                  key={v}
                  x1="0" y1={y} x2={CHART_W} y2={y}
                  stroke="#d1d5db"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {/* Smooth line */}
            <path
              d={linePath}
              fill="none"
              stroke="#1b3a5c"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Dots */}
            {coords.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="3"
                fill="#1b3a5c"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {/* X-axis */}
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            {searchActivityData.map((d) => (
              <span key={d.month}>{d.month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}