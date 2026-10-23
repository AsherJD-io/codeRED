/* ==========================================================================
   Technology signal strip. A continuous, endless horizontal loop of the real
   tools behind this portfolio.
   ---------------------------------------------------------------------------
   Font Awesome brand icons only. No brand logos and no emoji are used.
   Reduced motion yields a stationary, completely readable strip.
   ========================================================================== */
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import "./toolstrip.scss";

/* Load all icon definitions once; the module-level call is safe in Vite. */
library.add(fab, fas);

/*
 * The tool inventory, taken from the profile generator's curated stack
 * (AsherJD-io/main.py) plus the skills and stacks actually used across the
 * projects, so the strip names what the account really works with.
 *
 * Each entry carries the icon that stands for it. Where Font Awesome has no
 * brand mark for a tool (TypeScript, PostgreSQL, SQL, dbt, Kestra) a solid
 * glyph is used instead, so no entry is left text-only.
 */
const TOOLS: Array<{ name: string; icon: IconProp }> = [
  { name: "Python", icon: "fab fa-python" as IconProp },
  { name: "SQL", icon: "fas fa-database" as IconProp },
  { name: "TypeScript", icon: "fas fa-code" as IconProp },
  { name: "JavaScript", icon: "fas fa-file-code" as IconProp },
  { name: "PostgreSQL", icon: "fas fa-database" as IconProp },
  { name: "BigQuery", icon: "fab fa-google" as IconProp },
  { name: "dbt", icon: "fas fa-code-branch" as IconProp },
  { name: "Kestra", icon: "fas fa-cloud" as IconProp },
  { name: "PySpark", icon: "fas fa-fire" as IconProp },
  { name: "Kafka", icon: "fas fa-stream" as IconProp },
  { name: "Redpanda", icon: "fas fa-fish" as IconProp },
  { name: "Flink", icon: "fas fa-bolt" as IconProp },
  { name: "Docker", icon: "fab fa-docker" as IconProp },
  { name: "Docker Compose", icon: "fas fa-cubes" as IconProp },
  { name: "Kubernetes", icon: "fas fa-dharmachakra" as IconProp },
  { name: "Terraform", icon: "fas fa-server" as IconProp },
  { name: "Linux", icon: "fab fa-linux" as IconProp },
  { name: "Bash", icon: "fas fa-terminal" as IconProp },
  { name: "React", icon: "fab fa-react" as IconProp },
  { name: "Next.js", icon: "fas fa-layer-group" as IconProp },
  { name: "Node.js", icon: "fab fa-node-js" as IconProp },
  { name: "FastAPI", icon: "fas fa-bolt" as IconProp },
  { name: "SQLAlchemy", icon: "fas fa-link" as IconProp },
  { name: "Alembic", icon: "fas fa-arrows-rotate" as IconProp },
  { name: "Streamlit", icon: "fas fa-chart-line" as IconProp },
  { name: "Vite", icon: "fas fa-bolt" as IconProp },
  { name: "SCSS", icon: "fas fa-palette" as IconProp },
  { name: "REST APIs", icon: "fas fa-plug" as IconProp },
  { name: "ETL/ELT", icon: "fas fa-arrows-rotate" as IconProp },
  { name: "Parquet", icon: "fas fa-table" as IconProp },
  { name: "Data modelling", icon: "fas fa-diagram-project" as IconProp },
  { name: "Arduino", icon: "fas fa-microchip" as IconProp },
  { name: "C", icon: "fas fa-code" as IconProp },
  { name: "IoT", icon: "fas fa-wifi" as IconProp },
  { name: "OCDS", icon: "fas fa-file-lines" as IconProp },
  { name: "GitHub", icon: "fab fa-github" as IconProp },
];

/*
 * A full loop is one copy of the list. The track holds the list twice, and the
 * animation moves exactly one copy's width, so the second copy lands where the
 * first started and the loop can repeat with no visible seam or jump back to
 * the beginning.
 */
const ITEM_GAP = 24;

export default function ToolStrip() {
  const forwardRef = useRef<HTMLDivElement | null>(null);
  const reverseRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) return;

    let raf = 0;
    let start = 0;
    let halfWidth = 0;

    const measure = () => {
      const track = forwardRef.current;
      if (!track) return 0;
      const items = Array.from(track.children) as HTMLElement[];
      if (items.length < 2) return 0;
      /*
       * One copy's width: from the start of the first item to the start of the
       * first item in the second copy. Measured rather than assumed, so the
       * loop stays seamless whatever the item widths and gap turn out to be.
       * Both lanes hold the same list, so one measurement covers them.
       */
      const first = items[0].getBoundingClientRect();
      const second = items[items.length / 2].getBoundingClientRect();
      return Math.abs(second.left - first.left) || track.scrollWidth / 2;
    };

    const tick = (now: number) => {
      if (!start) start = now;
      if (!halfWidth) halfWidth = measure();

      /*
       * A steady 50px per second, endless. The modulo keeps the offset inside
       * one copy, so neither lane drifts and neither snaps back to zero.
       * The lanes share the offset and apply it in opposite directions.
       */
      const elapsed = now - start;
      const raw = (elapsed / 1000) * 50;
      setOffset(halfWidth > 0 ? raw % halfWidth : 0);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    /* Re-measure on resize: the copy width changes with the viewport. */
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  /*
   * Two lanes, each holding the list twice so a lane can loop seamlessly. The
   * reverse lane is pre-shifted by one copy so the two rows are never showing
   * the same tool in the same place.
   */
  const laneItems = [...TOOLS, ...TOOLS];

  return (
    <div
      className={`tools${reduced ? " is-static" : ""}`}
      aria-label="Technologies used"
    >
      <div
        ref={forwardRef}
        className="tools__track tools__track--forward"
        style={
          reduced
            ? undefined
            : { gap: ITEM_GAP, transform: `translateX(-${offset}px)` }
        }
      >
        {laneItems.map((tool, index) => (
          <div key={`${tool.name}-${index}`} className="tools__item">
            <span className="tools__icon">
              <FontAwesomeIcon icon={tool.icon} aria-hidden="true" fixedWidth />
            </span>
            <span className="tools__label">{tool.name}</span>
          </div>
        ))}
      </div>

      <div
        ref={reverseRef}
        className="tools__track tools__track--reverse"
        style={
          reduced
            ? undefined
            : {
                gap: ITEM_GAP,
                /*
                 * Pre-shifted by one copy, then moved right by the same
                 * offset the top lane moves left by, so the rows travel in
                 * opposite directions and stay out of step with each other.
                 */
                transform: `translateX(calc(-50% + ${offset}px))`,
              }
        }
      >
        {laneItems.map((tool, index) => (
          <div key={`${tool.name}-b-${index}`} className="tools__item">
            <span className="tools__icon">
              <FontAwesomeIcon icon={tool.icon} aria-hidden="true" fixedWidth />
            </span>
            <span className="tools__label">{tool.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
