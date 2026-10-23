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
 * Each path carries `pathLength="1"`, so a dasharray of 1 covers the whole
 * stroke: offset 1 hides it entirely, offset 0 reveals it completely. The CSS
 * animation runs that offset down quickly, so the strokes draw themselves on
 * from nothing when the page loads, rather than appearing already complete.
 *
 * The two passes are the same kind of curve but written in opposite
 * directions: pass 1 runs left to right, pass 2 right to left. They start
 * together and meet in the middle, which is what makes the pair read as one
 * scribble being drawn rather than two separate lines.
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
      {/* Pass 1: drawn left to right. */}
      <path
        d="M6 11.5 C 28 6.5, 50 17.5, 74 10 C 96 3.5, 118 17, 142 9.5 C 164 3, 184 12, 196 7.5"
        pathLength="1"
        className="thero__scribble-path thero__scribble-path--1"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/*
        Pass 2: the same shape written backwards, so it draws right to left.
        The control points of each segment are swapped with its end point.
      */}
      <path
        d="M186 11 C 154 16.5, 126 8.5, 98 13.5 C 68 20, 40 11.5, 16 15.5"
        pathLength="1"
        className="thero__scribble-path thero__scribble-path--2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
