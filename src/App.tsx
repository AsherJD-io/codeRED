import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";

import PillNav from "./components/Utils/PillNav/pillnav";
import BackgroundField from "./components/BackgroundField/backgroundfield";
import Home from "./components/Home/home";
import Projects from "./components/Projects/projects";
import Resume from "./components/Resume/resume";
import Writing from "./components/Writing/writing";
import Contact from "./components/Contact/contact";
import Error404 from "./components/Error/error404";
import logo from "./assets/imgs/codered-logo.png";

/**
 * Wraps a route tree so any `.reveal` descendant fades in once it enters the
 * viewport.
 *
 * Three details matter here:
 *  - the observer root is the viewport itself (the page scrolls, so there is
 *    no inner scroll container to measure against);
 *  - an IntersectionObserver with `threshold: 0` never fires for an element
 *    that is still entirely below the root when first observed and is then
 *    scrolled past in one jump, so a scroll handler covers that case by
 *    revealing anything at or above the root's bottom edge;
 *  - content that arrives asynchronously (the Substack feed fetches after
 *    mount) is mounted after this effect first runs, so a MutationObserver
 *    re-scans the host and arms anything new. Without it those elements are
 *    never observed and stay at opacity 0 for the rest of the session.
 *
 * `key` on the caller remounts this per route, which re-arms the observer for
 * newly rendered content after client-side navigation.
 */
function RevealHost({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    let targets = Array.from(host.querySelectorAll<HTMLElement>(".reveal"));

    const reveal = (el: HTMLElement) => el.classList.add("is-visible");

    const rootBottom = () => {
      // The page scrolls, so the visible bottom edge is the viewport's.
      //
      // The trigger sits at 55% of the viewport rather than near its bottom.
      // At the bottom edge, content only started appearing once it had been
      // scrolled almost to the top of the screen, which read as content being
      // invisible until you had scrolled past it. A higher line means a section
      // reveals as it approaches the middle of the screen instead.
      const height = window.innerHeight;
      return height * 0.55;
    };

    /**
     * Progress through each target, 0 at the moment it enters the viewport and
     * 1 once it is a viewport-height past the fold. Driving `--reveal-progress`
     * from scroll (rather than a one-shot class) is what makes the movement and
     * the colour shift track the scroll continuously instead of fading in once.
     */
    const paint = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, (rootBottom() - rect.top) / (window.innerHeight * 0.9)),
      );
      el.style.setProperty("--reveal-progress", progress.toFixed(3));
    };

    /** Reveal and paint anything that has reached the visible bottom edge. */
    const check = () => {
      const limit = rootBottom();
      for (const el of targets) {
        if (el.getBoundingClientRect().top < limit) reveal(el);
        if (el.classList.contains("is-visible")) paint(el);
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      targets.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            reveal(entry.target as HTMLElement);
            // Kept observed on purpose: the scroll handler owns the
            // progress painting, and unobserve here would stop the
            // intersection signal that re-arms after a resize.
          }
        }
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    const arm = (el: HTMLElement) => {
      observer.observe(el);
      // Async content may already be past the fold when it mounts.
      if (el.getBoundingClientRect().top < rootBottom()) {
        reveal(el);
        paint(el);
      }
    };

    targets.forEach(arm);
    check();
    window.addEventListener("scroll", check, { passive: true });

    // Re-arm elements mounted after this effect ran (the Substack feed).
    const mutation = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const added = node.matches(".reveal")
            ? [node]
            : Array.from(node.querySelectorAll<HTMLElement>(".reveal"));
          added.forEach((el) => {
            if (!targets.includes(el)) {
              targets = [...targets, el];
              arm(el);
            }
          });
        });
      }
      check();
    });
    mutation.observe(host, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
      window.removeEventListener("scroll", check);
    };
  }, []);

  return (
    <div ref={ref} className="reveal-host">
      {children}
    </div>
  );
}

/**
 * Scrolls the page back to the top using the real scroller.
 *
 * Portalled to `document.body` so the control is anchored to the viewport
 * and cannot be captured by a transformed or scrolling ancestor. It is
 * `position: fixed` in the viewport's lower-right corner and stays there
 * for the whole scroll.
 */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyReduced = () => setReduced(mq.matches);
    applyReduced();
    mq.addEventListener?.("change", applyReduced);
    return () => mq.removeEventListener?.("change", applyReduced);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return createPortal(
    <button
      type="button"
      className={`back-to-top${visible ? " is-visible" : ""}`}
      onClick={toTop}
      aria-label="Back to top"
    >
      <i className="fas fa-arrow-up" aria-hidden="true" />
      <span>Top</span>
    </button>,
    document.body,
  );
}

export default function App() {
  const [intro, setIntro] = useState<"loading" | "revealed">("loading");

  /*
   * The intro is a fixed duration rather than an infinite animation, so it
   * always finishes and never traps the visitor on a loading screen. Reduced
   * motion skips it entirely.
   */
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /*
   * Whether a replay is in progress. The timer is armed by a click, not by an
   * effect: an effect would re-arm on every re-render, including the one caused
   * by unmounting the shell, which is what produced the infinite loop.
   */
  const replaying = useRef(false);

  useEffect(() => {
    if (reduced) {
      setIntro("revealed");
      return;
    }
    const timer = setTimeout(() => setIntro("revealed"), 1500);
    return () => clearTimeout(timer);
    // Run once, on mount only. The intro is the page's opening, not something
    // every re-render restarts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Replay the intro. The brand mark is a link home on both viewports, so the
   * natural way back is through the mark itself: clicking it shows the codeRED
   * intro again, and once it settles the page opens normally.
   */
  const replayIntro = () => {
    if (replaying.current) return;
    replaying.current = true;

    window.scrollTo({ top: 0, behavior: "auto" });
    setIntro("loading");

    window.setTimeout(
      () => {
        replaying.current = false;
        setIntro("revealed");
      },
      reduced ? 0 : 1500,
    );
  };

  return (
    <div className="App">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {intro === "loading" ? (
        <div className="intro">
          <img className="intro__logo loader" src={logo} alt="codeRED" />
        </div>
      ) : (
        <BrowserRouter>
          <BackgroundField />
          <Shell onReplayIntro={replayIntro} />
        </BrowserRouter>
      )}
    </div>
  );
}

/**
 * A single shared shell: one pill nav above one vertical content column.
 * The same route tree serves every viewport, so the page structure does not
 * change between desktop and mobile.
 */
function Shell({ onReplayIntro }: { onReplayIntro: () => void }) {
  return (
    <div className="mobile_container">
      <PillNav onHomeClick={onReplayIntro} />

      <main id="main-content">
        <div className="page-column">
          <RevealHost key={0}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/projects"
                element={<Projects activeMenu={() => {}} />}
              />
              <Route path="/writing" element={<Writing />} />
              <Route
                path="/resume"
                element={<Resume activeMenu={() => {}} />}
              />
              <Route
                path="/contact"
                element={<Contact activeMenu={() => {}} />}
              />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </RevealHost>

          <div className="global-footer">
            © 2026 AsherJD. All rights reserved.
          </div>
        </div>
      </main>

      <BackToTop />
    </div>
  );
}
