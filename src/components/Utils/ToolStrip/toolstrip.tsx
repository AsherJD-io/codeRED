/* ==========================================================================
   Technology signal strip. A continuous, slow horizontal loop of the real
   tools behind this portfolio — Rust, Python, React, Docker and so on.
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
 * The actual tool inventory, taken from the profile generator's curated stack
 * (AsherJD-io/main.py), so the strip and the README name the same tools.
 *
 * Font Awesome brand icons only. No brand logos and no emoji are used.
 */
const TOOLS = [
  { name: "Python", icon: "fab fa-python" as IconProp },
  { name: "SQL", icon: "fas fa-database" as IconProp },
  { name: "TypeScript", icon: "fab fa-typescript" as IconProp },
  { name: "PostgreSQL", icon: "fas fa-database" as IconProp },
  { name: "BigQuery", icon: "fab fa-google" as IconProp },
  { name: "dbt", icon: "fas fa-code-branch" as IconProp },
  { name: "Kestra", icon: "fas fa-cloud" as IconProp },
  { name: "PySpark", icon: "fas fa-fire" as IconProp },
  { name: "Kafka", icon: "fas fa-stream" as IconProp },
  { name: "Flink", icon: "fas fa-bolt" as IconProp },
  { name: "Docker", icon: "fab fa-docker" as IconProp },
  { name: "Terraform", icon: "fas fa-server" as IconProp },
  { name: "Kubernetes", icon: "fas fa-dharmachakra" as IconProp },
  { name: "Linux", icon: "fab fa-linux" as IconProp },
  { name: "Next.js", icon: "fab fa-react" as IconProp },
  { name: "React", icon: "fab fa-react" as IconProp },
  { name: "Node.js", icon: "fab fa-node-js" as IconProp },
  { name: "GitHub", icon: "fab fa-github" as IconProp },
];

/* Slow-out, slow-in easing for a natural, calm loop. */
const LOOP_EASE = (t: number) => {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

export default function ToolStrip() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) return;

    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const t = (elapsed % 6000) / 6000;
      setProgress(LOOP_EASE(t));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`tools${reduced ? " is-static" : ""}`}
      aria-label="Technologies used"
    >
      <div
        className="tools__track"
        style={{ transform: `translateX(-${progress * 100}%)` }}
      >
        {[...TOOLS, ...TOOLS].map((tool, index) => (
          <div key={`${tool.name}-${index}`} className="tools__item">
            <span className="tools__icon">
              <FontAwesomeIcon icon={tool.icon} aria-hidden="true" fixedWidth />
            </span>
            <span className="tools__label">{tool.name}</span>
          </div>
        ))}
      </div>

      <div className="tools__focus" aria-hidden="true" />
    </div>
  );
}
