import { useCallback, useEffect, useRef, useState } from "react";
import { resume } from "../../constants/resume";
import RevealHeading from "../Utils/RevealHeading/revealheading";
import "./experience.scss";

/** The résumé on Drive, the same file the Resume route links to. */
const RESUME_URL =
  "https://drive.google.com/file/d/1dJoSM0Dksn_k4PwfquTXXvDvndGEYCeC/view?usp=sharing";

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

    /*
     * The reference line is a fraction of the VIEWPORT. `.App` spans the whole
     * document, so both its `height` and its `clientHeight` are the full
     * document height; using either put the line thousands of pixels below the
     * visible area and the fill could never grow. `window.innerHeight` is the
     * area the visitor is actually reading.
     */
    const viewHeight = window.innerHeight;
    const reference = viewHeight * 0.32;

    const listRect = list.getBoundingClientRect();

    const fill = fillRef.current;
    if (fill) {
      const span = listRect.height;
      const travelled = reference - listRect.top;
      const progress =
        span > 0 ? Math.min(1, Math.max(0, travelled / span)) : 0;
      fill.style.height = `${progress * 100}%`;
    }

    /*
     * The active node is the entry the reference line is currently inside,
     * rather than the node geometrically nearest to it.
     *
     * Nearest-node has a failure mode: when the list sits entirely below the
     * fold, every node is below the line and the nearest one is always the
     * first, so the emphasis sticks to the first entry no matter how far the
     * page is scrolled. Comparing the line against each item's own span keeps
     * the emphasis with the entry actually being read.
     */
    let best = 0;
    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const rect = item.getBoundingClientRect();
      const inside = reference >= rect.top && reference < rect.bottom;
      if (inside) best = index;
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

    /*
     * A short poll backs up the rAF-driven measurement. rAF is throttled to
     * zero in a backgrounded or hidden tab, which would otherwise leave the
     * fill and the active node frozen at their first reading. The poll also
     * self-corrects: if the emphasis ever lands on an entry the line has left,
     * the next tick moves it.
     */
    const timer = window.setInterval(measure, 250);

    return () => {
      cancelAnimationFrame(frame.current);
      window.clearInterval(timer);
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
      <RevealHeading className="section-title reveal" id="experience-heading">
        <span className="section-title__tag">&lt;Experience /&gt;</span>
        <span className="section-title__rule" aria-hidden="true" />
      </RevealHeading>

      {/*
        The résumé download. It sits ABOVE the heading's rule line, at the
        right-hand edge, so it reads as an action attached to the section rather
        than a row in the timeline.
      */}
      <a
        className="experience__download"
        href={RESUME_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fas fa-download" aria-hidden="true" />
        <span>Download Résumé</span>
      </a>
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
