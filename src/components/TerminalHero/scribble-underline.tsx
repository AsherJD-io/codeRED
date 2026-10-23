/**
 * Hand-drawn scribble underline for the name heading.
 *
 * Inlined as a React component rather than loaded through `<img>`. An SVG in
 * an `<img>` is an isolated document: its `currentColor` resolves against that
 * document, not the page, so it renders black regardless of the colour set on
 * the parent. Inlined, `currentColor` inherits the CSS `color` of the wrapper
 * and the stroke actually shows on the dark background.
 *
 * Two overlapping passes with an irregular, wobbling path, so it reads as a
 * deliberate pen stroke rather than a straight rule.
 *
 * The animated highlight is a second, transparent path laid exactly over the
 * first. It carries a neutral gradient (the page's own light and muted ink)
 * and is masked by its own stroke; the CSS animates that mask's
 * `background-position` so a band of light travels along the stroke, the same
 * mechanism the reference site uses for its animated text effects. That reads
 * as the pen drawing itself rather than a dash appearing.
 */
export default function ScribbleUnderline() {
  return (
    <svg
      viewBox="0 0 200 22"
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="thero-scribble-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f4f4f5" stopOpacity="0" />
          <stop offset="42%" stopColor="#f4f4f5" stopOpacity="0" />
          <stop offset="50%" stopColor="#f4f4f5" stopOpacity="0.95" />
          <stop offset="58%" stopColor="#f4f4f5" stopOpacity="0" />
          <stop offset="100%" stopColor="#f4f4f5" stopOpacity="0" />
        </linearGradient>
        <mask id="thero-scribble-mask">
          <path
            d="M6 11.5 C 28 6.5, 50 17.5, 74 10 C 96 3.5, 118 17, 142 9.5 C 164 3, 184 12, 196 7.5"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 15.5 C 40 11.5, 68 20, 98 13.5 C 126 8.5, 154 16.5, 186 11"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </mask>
      </defs>

      {/* The base stroke: the static ink, always visible. */}
      <path
        d="M6 11.5 C 28 6.5, 50 17.5, 74 10 C 96 3.5, 118 17, 142 9.5 C 164 3, 184 12, 196 7.5"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 15.5 C 40 11.5, 68 20, 98 13.5 C 126 8.5, 154 16.5, 186 11"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* The travelling highlight, masked to the strokes above. */}
      <g mask="url(#thero-scribble-mask)">
        <rect
          className="thero__scribble-sheen"
          x="0"
          y="0"
          width="200"
          height="22"
          fill="url(#thero-scribble-sheen)"
        />
      </g>
    </svg>
  );
}
