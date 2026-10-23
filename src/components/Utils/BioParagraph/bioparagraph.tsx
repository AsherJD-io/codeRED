import { resume } from "../../../constants/resume";

/**
 * Renders every bio paragraph, in order.
 *
 * The phrase is real markup here, never an HTML string passed through
 * `dangerouslySetInnerHTML`, so it cannot leak a literal `<span>` into the
 * page on any surface.
 */
export default function BioParagraphs() {
  return (
    <>
      {resume.bio.map((paragraph, i) => (
        <p key={i}>
          {paragraph.segments
            ? paragraph.segments.map((segment, j) =>
                segment.kind === "highlight" ? (
                  <span key={j} className="highlight">
                    {segment.text}
                  </span>
                ) : (
                  <span key={j}>{segment.text}</span>
                ),
              )
            : paragraph.text}
        </p>
      ))}
    </>
  );
}
