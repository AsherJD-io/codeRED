/**
 * Hand-drawn scribble underline for the name heading.
 *
 * Inlined as a React component rather than loaded through `<img>`. An SVG in
 * an `<img>` is an isolated document: its `currentColor` resolves against that
 * document, not the page, so it renders black regardless of the colour set on
 * the parent. Inlined, `currentColor` inherits the CSS `color` of the wrapper
 * and the accent stroke actually shows on the dark background.
 *
 * Two overlapping passes with an irregular, wobbling path, so it reads as a
 * deliberate pen stroke rather than a straight rule.
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
    </svg>
  );
}
