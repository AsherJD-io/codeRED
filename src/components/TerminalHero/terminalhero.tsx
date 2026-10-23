import { useEffect, useRef, useState } from "react";
import myPic from "../../assets/imgs/my-pic.jpg";
import scribble from "../../assets/svgs/scribble-underline.svg";
import "./terminalhero.scss";

/**
 * The homepage hero.
 *
 * LEFT — the reader's original personal introduction, restored from the
 * previous working homepage: the name heading, the original write-up with its
 * highlighted phrases, an "Open to work" status line, and the actions.
 *
 * RIGHT — ONE compact terminal display. It types the fetch command from the
 * GitHub profile README and then its output, line by line, at a deliberately
 * slow pace with a blinking cursor. Once the output has settled the same
 * display cross-fades into the portrait, holds, fades back to the terminal,
 * clears, and types again. The loop never stops.
 *
 * The display is sized to its content, so it is a compact terminal rather than
 * a large empty rectangle. When the portrait is showing, the terminal chrome
 * is gone: no frame, no bar, no caption, no name or title under the image.
 *
 * MOBILE — the same sequence runs top to bottom: display first, then the
 * introduction and actions beneath. Reduced motion shows a stable portrait
 * with no typing and no waiting.
 *
 * Every string below comes from the profile README's own generator
 * (AsherJD-io/main.py) or from the GitHub account. Nothing is invented: the
 * portfolio URL is deliberately omitted, and no CodeRED branding appears.
 */

/* The prompt is assembled from parts so the identity, the path and the shell
   symbols can carry separate colours, exactly as the README renders them. */
const PROMPT = {
  identity: "asher@ASHER-SGNL7CR",
  sep: "@",
  path: "~",
  sym: "$ ",
};

/* The command the terminal types out. */
const COMMAND = "fetch.sh -u asher";

/*
 * The terminal output, in the README's own key/value shape: a dim label, a
 * readable value, nothing decorative.
 *
 * All of it is queried live from the GitHub account (gh api), not copied from
 * the README render and not guessed:
 *   - repositories owned: 16
 *   - pull requests authored: 26
 *   - stars received: 15
 *   - languages: the account's own language signal by repo count, top three
 *     (Python, TypeScript, JavaScript), with the rest carried on a second row.
 *
 * The fetch output comes first, then the welcome note closes it. None of it
 * repeats the page's own copy: the left column states who he is and what he
 * works on, and the Work section below lists the projects.
 */
type Row = { label?: string; values: string[] };

const ROWS: Row[] = [
  { label: "github", values: ["16 repos"] },
  { label: "", values: ["26 PRs", "15 stars"] },
  {
    label: "langs",
    values: ["Python", "TypeScript", "JavaScript"],
  },
  { label: "", values: ["Shell", "CSS"] },
  { label: "", values: ["Welcome to my page."] },
];

const TYPE_CHAR_MS = 46;
const TYPE_LINE_MS = 620;
const HOLD_BEFORE_PORTRAIT_MS = 1400;
const HOLD_PORTRAIT_MS = 4200;

export default function TerminalHero() {
  const [phase, setPhase] = useState<"typing" | "output" | "portrait">(
    "typing",
  );
  const [charIndex, setCharIndex] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [settled, setSettled] = useState(false);
  const reducedRef = useRef(false);

  /* Reduced motion: no typing, no loop. The display holds the portrait. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = mq.matches;
      if (mq.matches) {
        setPhase("portrait");
        setSettled(true);
      }
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  /* Phase 1 — type the command one character at a time. */
  useEffect(() => {
    if (reducedRef.current || phase !== "typing") return;
    if (charIndex >= COMMAND.length) {
      const timer = setTimeout(() => setPhase("output"), 380);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(
      () => setCharIndex((c) => c + 1),
      charIndex === 0 ? 420 : TYPE_CHAR_MS,
    );
    return () => clearTimeout(timer);
  }, [phase, charIndex]);

  /* Phase 2 — reveal the profile rows one at a time. */
  useEffect(() => {
    if (reducedRef.current || phase !== "output") return;
    if (rowCount >= ROWS.length) {
      const timer = setTimeout(() => setSettled(true), HOLD_BEFORE_PORTRAIT_MS);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setRowCount((r) => r + 1), TYPE_LINE_MS);
    return () => clearTimeout(timer);
  }, [phase, rowCount]);

  /* Phase 3 — hold the portrait, then start the loop again. */
  useEffect(() => {
    if (reducedRef.current || phase !== "portrait") return;
    const timer = setTimeout(() => {
      setCharIndex(0);
      setRowCount(0);
      setSettled(false);
      setPhase("typing");
    }, HOLD_PORTRAIT_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  /* The settled profile is the trigger for the flip. */
  useEffect(() => {
    if (settled && !reducedRef.current) setPhase("portrait");
  }, [settled]);

  const typed = COMMAND.slice(0, charIndex);

  return (
    <div className="thero">
      {/* LEFT — the original introduction. */}
      <div className="thero__intro">
        <h1 className="thero__name">
          <span className="thero__name-line">Hi! I&apos;m</span>
          <span className="thero__name-line thero__name-line--name">
            Delebayo{" "}
            <span className="thero__name-word">
              Asher
              <span className="thero__scribble" aria-hidden="true">
                <img src={scribble} alt="" />
              </span>
            </span>
          </span>
        </h1>

        <div className="thero__bio">
          <p>
            <span>
              I build <span className="highlight">data platforms</span> and{" "}
              <span className="highlight">software products</span> for complex,
              real-world operations. My work spans data pipelines and
              warehouses, streaming and orchestration, cloud-native systems,
              backend APIs, and AI-assisted products across energy, mobility,
              public procurement, finance, and agriculture. I bring an
              engineering background to turning messy data and operational
              problems into systems people can trust and use.
            </span>
          </p>
        </div>

        {/* The action, then the status line beneath it. */}
        <div className="thero__aside">
          <div className="thero__actions">
            <a
              className="thero__cta thero__cta--mail"
              href="mailto:josephdelebayo@gmail.com"
            >
              <i className="far fa-envelope" aria-hidden="true" />
              Email me
            </a>
          </div>

          <p className="thero__status">
            <span className="thero__status-dot" aria-hidden="true" />
            Open to work
          </p>
        </div>
      </div>

      {/* RIGHT — one compact display: the running terminal, then the portrait
          in the very same box. */}
      <div
        className={`thero__display${phase === "portrait" ? " is-portrait" : ""}`}
      >
        {/* Face 1 — the terminal. */}
        <div
          className={`thero__face${phase === "portrait" ? "" : " is-active"}`}
        >
          <div className="thero__body">
            <div className="thero__bar">
              <span className="thero__dot thero__dot--r" aria-hidden="true" />
              <span className="thero__dot thero__dot--y" aria-hidden="true" />
              <span className="thero__dot thero__dot--g" aria-hidden="true" />
              <span className="thero__title">fetch.sh — asher profile</span>
            </div>

            <div className="thero__screen">
              <p className="thero__cmdline">
                <span className="thero__prompt">
                  <span className="thero__prompt-id">{PROMPT.identity}</span>
                  <span className="thero__prompt-sep">{PROMPT.sep}</span>
                  <span className="thero__prompt-sep">:</span>
                  <span className="thero__prompt-path">{PROMPT.path}</span>
                  <span className="thero__prompt-sym">{PROMPT.sym}</span>
                </span>
                <span className="thero__command">{typed}</span>
                <span className="thero__caret" aria-hidden="true" />
              </p>

              {ROWS.slice(0, rowCount).map((row, i) => (
                <p className="thero__row" key={i}>
                  {row.label ? (
                    <span className="thero__label">
                      {row.label.padEnd(6, " ")}
                    </span>
                  ) : (
                    <span className="thero__label">{" ".repeat(6)}</span>
                  )}
                  {row.values.map((value, j) => (
                    <span className="thero__value" key={j}>
                      {j > 0 ? (
                        <span className="thero__dot-sep"> · </span>
                      ) : null}
                      {value}
                    </span>
                  ))}
                </p>
              ))}

              {settled ? (
                <p className="thero__row thero__row--done">
                  <span className="thero__done">✓ ready to build</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Face 2 — the portrait, alone in the same box. */}
        <div
          className={`thero__face thero__portrait${phase === "portrait" ? " is-active" : ""}`}
        >
          <div className="thero__portrait-frame">
            <img
              className="thero__portrait-img"
              src={myPic}
              alt="Portrait of Delebayo Asher"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
