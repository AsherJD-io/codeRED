import { useCallback, useEffect, useRef, useState } from "react";
import { resume } from "../../constants/resume";
import "./experience.scss";

/* ==========================================================================
   Work-experience timeline.
   One vertical track, a fill that grows on scroll, one node per entry. The
   entry whose node sits nearest the reference line is emphasised in the
   accent. Every entry is always laid out and readable — active only changes
   weight, colour and node size, never visibility.
   ---------------------------------------------------------------------------
   Knob-driven: progressing through the list moves the active node and fills
   the track. Targets are measured against the real scroller (`.App`), not
   `window`, so jump-scroll, anchors and keyboard access all behave.
   ========================================================================== */
export default function Experience() {
  const listRef = useRef<HTMLOListElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const nodeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const frame = useRef(0);
  const [active, setActive] = useState(0);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const scroller = list.closest(".App") ?? document.scrollingElement;
    const scrollerRect = scroller
      ? scroller.getBoundingClientRect()
      : ({
          top: 0,
          height: window.innerHeight,
          bottom: window.innerHeight,
        } as DOMRect);

    const listRect = list.getBoundingClientRect();
    // Reference line: a fraction of the scroller height, so the active node
    // moves continuously instead of locking to the top or bottom.
    const reference = scrollerRect.top + scrollerRect.height * 0.32;

    const fill = fillRef.current;
    if (fill) {
      const span = listRect.height;
      const travelled = reference - listRect.top;
      const progress =
        span > 0 ? Math.min(1, Math.max(0, travelled / span)) : 0;
      fill.style.height = `${progress * 100}%`;
    }

    let best = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    nodeRefs.current.forEach((node, index) => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - reference);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });

    setActive((previous) => (previous === best ? previous : best));
  }, []);

  useEffect(() => {
    // Reduced motion: the section is a static, fully readable list. No
    // listeners, no active emphasis, no transitions at all.
    if (reduced) return;

    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(measure);
    };

    measure();
    const scroller = listRef.current?.closest(".App") ?? null;
    scroller?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", onScroll);
    document.fonts?.ready.then(() => measure()).catch(() => {});

    return () => {
      cancelAnimationFrame(frame.current);
      scroller?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
    };
  }, [measure, reduced]);

  // React rewrites `className` on every render, so the observer-owned flag is
  // toggled imperatively. The JSX class string stays static.
  useEffect(() => {
    if (reduced) return;
    itemRefs.current.forEach((item, index) => {
      item?.classList.toggle("is-active", index === active);
    });
  }, [active, reduced]);

  return (
    <section
      className="experience"
      id="experience"
      aria-labelledby="experience-heading"
    >
      <h2 className="section-title" id="experience-heading">
        <span className="section-title__tag">&lt;Experience /&gt;</span>
        <span className="section-title__rule" aria-hidden="true" />
      </h2>

      <ol className="timeline" ref={listRef}>
        <span className="timeline__track" aria-hidden="true">
          <span className="timeline__fill" ref={fillRef} />
        </span>

        {resume.workExperiences.map((entry, index) => (
          <li
            className={`timeline__item reveal reveal--stagger-${index % 3}`}
            key={entry.company}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          >
            <span
              className="timeline__node"
              aria-hidden="true"
              ref={(el) => {
                nodeRefs.current[index] = el;
              }}
            />

            <div className="timeline__content">
              <p className="timeline__dates">
                {entry.startDate}
                {entry.startDate && entry.endDate ? " - " : ""}
                {entry.endDate ?? ""}
                {entry.current ? " - Present" : ""}
              </p>

              <h3 className="timeline__company">{entry.company}</h3>
              <p className="timeline__role">{entry.role}</p>

              <ul className="timeline__achievements">
                {entry.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
