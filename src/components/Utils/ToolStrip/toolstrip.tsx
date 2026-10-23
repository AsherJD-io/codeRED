/* ==========================================================================
   Technology signal strip. A continuous, endless horizontal loop of the real
   tools behind this portfolio.
   ---------------------------------------------------------------------------
   Font Awesome brand icons only. No brand logos and no emoji are used.
   Reduced motion yields a stationary, completely readable strip.
   ========================================================================== */
import { useState } from "react";
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
  { name: "TypeScript", icon: "fas fa-file-code" as IconProp },
  { name: "JavaScript", icon: "fab fa-js" as IconProp },
  { name: "PostgreSQL", icon: "fas fa-table-cells" as IconProp },
  { name: "BigQuery", icon: "fab fa-google" as IconProp },
  { name: "dbt", icon: "fas fa-code-branch" as IconProp },
  { name: "Kestra", icon: "fas fa-cloud" as IconProp },
  { name: "PySpark", icon: "fas fa-fire" as IconProp },
  { name: "Kafka", icon: "fas fa-stream" as IconProp },
  { name: "Redpanda", icon: "fas fa-fish" as IconProp },
  { name: "Flink", icon: "fas fa-bolt-lightning" as IconProp },
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
  { name: "Vercel", icon: "fas fa-cloud-upload" as IconProp },
  { name: "Streamlit", icon: "fas fa-chart-line" as IconProp },
  { name: "Vite", icon: "fas fa-rocket" as IconProp },
  { name: "SCSS", icon: "fas fa-palette" as IconProp },
  { name: "REST APIs", icon: "fas fa-plug" as IconProp },
  { name: "ETL/ELT", icon: "fas fa-right-left" as IconProp },
  { name: "Parquet", icon: "fas fa-table" as IconProp },
  { name: "Data modelling", icon: "fas fa-diagram-project" as IconProp },
  { name: "Arduino", icon: "fas fa-microchip" as IconProp },
  { name: "C", icon: "fas fa-code" as IconProp },
  { name: "IoT", icon: "fas fa-wifi" as IconProp },
  { name: "OCDS", icon: "fas fa-file-lines" as IconProp },
  { name: "GitHub", icon: "fab fa-github" as IconProp },
];

/*
 * Two lanes, each carrying one half of the stack.
 *
 * The halves are disjoint: a tool appears in exactly one lane, so no icon is
 * ever shown twice on screen at the same time, and no lane repeats a tool
 * within itself. Each lane lays its own half out twice and the CSS animation
 * advances the track by exactly one half-width per iteration, so the content
 * at the loop boundary is identical to the content it replaces and the wrap
 * is invisible.
 */
const HALF = Math.ceil(TOOLS.length / 2);
const GROUP_A = TOOLS.slice(0, HALF);
const GROUP_B = TOOLS.slice(HALF);

export default function ToolStrip() {
  /*
   * Hovering a lane pauses it. The pause is a CSS class rather than a state
   * value driving the transform, so the lane holds its current position and
   * resumes from there, and it can never be left frozen.
   */
  const [paused, setPaused] = useState<[boolean, boolean]>([false, false]);

  const toggle = (row: number, value: boolean) =>
    setPaused((current) =>
      current[row] === value
        ? current
        : (current.map((v, i) => (i === row ? value : v)) as [
            boolean,
            boolean,
          ]),
    );

  const renderLane = (group: typeof TOOLS, keyPrefix: string) =>
    /*
     * Two identical copies of the group. The second copy is what the track
     * slides into as the first runs off, which is what makes the loop seamless
     * without any duplicated icon being visible at once.
     */
    [...group, ...group].map((tool, index) => (
      <div
        key={`${keyPrefix}-${tool.name}-${index}`}
        className="tools__item"
        title={tool.name}
      >
        <span className="tools__icon">
          <FontAwesomeIcon icon={tool.icon} aria-hidden="true" fixedWidth />
        </span>
        <span className="sr-only">{tool.name}</span>
      </div>
    ));

  return (
    <div className="tools" aria-label="Technologies used">
      <div
        className={`tools__track tools__track--forward${
          paused[0] ? " is-paused" : ""
        }`}
        onMouseEnter={() => toggle(0, true)}
        onMouseLeave={() => toggle(0, false)}
      >
        {renderLane(GROUP_A, "a")}
      </div>

      <div
        className={`tools__track tools__track--reverse${
          paused[1] ? " is-paused" : ""
        }`}
        onMouseEnter={() => toggle(1, true)}
        onMouseLeave={() => toggle(1, false)}
      >
        {renderLane(GROUP_B, "b")}
      </div>
    </div>
  );
}
