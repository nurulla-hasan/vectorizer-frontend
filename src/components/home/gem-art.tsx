const GEM_ROWS = [
  ".....11.....",
  "....1221....",
  "...122221...",
  "..12233221..",
  ".1223443221.",
  ".1223443221.",
  "..12233221..",
  "...122221...",
  "....1221....",
  ".....11.....",
];

// 0 = empty, 1..4 = quantized shades of the vector gradient.
const PIXEL_SHADES = ["", "#312e81", "#4338ca", "#6366f1", "#67e8f9"];

const GEM_POINTS = [
  [60, 6],
  [114, 58],
  [60, 112],
  [6, 58],
];

interface GemArtProps {
  className?: string;
  idPrefix?: string;
}

/** Blocky, quantized gem used to represent the raster side of a comparison. */
export function RasterGem({ className }: GemArtProps) {
  return (
    <svg
      viewBox="0 0 12 10"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {GEM_ROWS.flatMap((row, y) =>
        [...row].map((cell, x) => {
          const shade = PIXEL_SHADES[Number(cell)];
          if (!shade) return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x + 0.06}
              y={y + 0.06}
              width={0.88}
              height={0.88}
              fill={shade}
            />
          );
        }),
      )}
    </svg>
  );
}

/** Clean vector gem with facets, cyan wireframe, and editable-point anchors. */
export function VectorGem({ className, idPrefix = "gem" }: GemArtProps) {
  const gradientId = `${idPrefix}-fill`;
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      <polygon
        points="60,6 114,58 60,112 6,58"
        fill={`url(#${gradientId})`}
        opacity="0.92"
      />
      <polygon points="60,6 114,58 60,58" fill="#ffffff" opacity="0.18" />
      <polygon points="114,58 60,112 60,58" fill="#000000" opacity="0.16" />
      <polygon points="60,112 6,58 60,58" fill="#000000" opacity="0.28" />
      <polygon points="6,58 60,6 60,58" fill="#000000" opacity="0.06" />

      <g
        fill="none"
        stroke="#22d3ee"
        strokeWidth="0.75"
        opacity="0.55"
        strokeDasharray="3 3"
      >
        <path d="M60 6v106M6 58h108M6 58l54-52 54 52M6 58l54 54 54-54" />
      </g>

      <polygon
        points="60,6 114,58 60,112 6,58"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M60 6v52h54M60 58v54H6"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.85"
      />

      {GEM_POINTS.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x - 2.2}
          y={y - 2.2}
          width="4.4"
          height="4.4"
          fill="#0b1120"
          stroke="#67e8f9"
          strokeWidth="1.1"
        />
      ))}

      <path
        d="M60 6c20 16 38 36 54 52"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity="0.7"
      />
      <circle cx="78" cy="20" r="2.2" fill="#67e8f9" />
      <circle cx="103" cy="42" r="2.2" fill="#67e8f9" />
    </svg>
  );
}
