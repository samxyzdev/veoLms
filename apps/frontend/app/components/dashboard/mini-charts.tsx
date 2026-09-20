/**
 * Tiny dependency-free charts (pure SVG).
 *
 * Why no chart library? These three cover what the dashboard mockup needs,
 * keep the bundle small, and make every number easy to tweak.
 */

/* ------------------------------------------------------------------ */
/* Donut chart — shows one value as a percentage of a ring            */
/* ------------------------------------------------------------------ */

export function DonutChart({
  value,
  size = 160,
  strokeWidth = 14,
  label,
}: {
  /** Percentage between 0 and 100. */
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (value / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
      role="img"
      aria-label={`${value}% ${label ?? "progress"}`}
    >
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#262e3c"
        strokeWidth={strokeWidth}
      />
      {/* Purple filled ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#8b73fb"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference - filled}`}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Bar chart — one bar per item in the array                          */
/* ------------------------------------------------------------------ */

export function BarChart({
  values,
  height = 160,
  color = "#8b73fb",
  highlightIndex,
}: {
  /** Bar heights (any positive numbers, e.g. [40, 70, 55]). */
  values: number[];
  height?: number;
  color?: string;
  /** Bar drawn in the lighter accent color. Defaults to the last bar. */
  highlightIndex?: number;
}) {
  // `|| 1` keeps the bars at zero height when there is no data yet.
  const max = Math.max(...values) || 1;
  const highlighted = highlightIndex ?? values.length - 1;

  return (
    <div className="flex h-full items-end justify-between gap-3">
      {values.map((value, index) => (
        <div
          key={index}
          className="w-full rounded-t-md"
          style={{
            height: `${(value / max) * height}px`,
            backgroundColor: index === highlighted ? "#b3a6ff" : color,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Line chart — draws a smooth-ish line through the given points      */
/* ------------------------------------------------------------------ */

export function LineChart({
  values,
  width = 260,
  height = 140,
}: {
  /** Points from bottom-left to top-right, e.g. [20, 40, 35, 70, 60]. */
  values: number[];
  width?: number;
  height?: number;
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  // Convert each value into an (x, y) coordinate inside the SVG box.
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 16) - 8;
    return `${x},${y}`;
  });

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Line chart">
      {/* Guide lines */}
      {[0.25, 0.5, 0.75].map((fraction) => (
        <line
          key={fraction}
          x1="0"
          x2={width}
          y1={height * fraction}
          y2={height * fraction}
          stroke="#262e3c"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      {/* Line */}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#8b73fb"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots on each point */}
      {points.map((point, index) => {
        const [x, y] = point.split(",").map(Number);
        return <circle key={index} cx={x} cy={y} r="3.5" fill="#b3a6ff" />;
      })}
    </svg>
  );
}