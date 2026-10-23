import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import "./revealheading.scss";

/**
 * Reveals a heading's children one at a time as it enters the viewport.
 *
 * Each direct child is wrapped in its own inline-block span, and the words
 * inside each child are split into their own spans too, so a heading animates
 * word by word. The parent stays `invisible` until the section scrolls into
 * view, then the words rise and settle in sequence. That is the same treatment
 * the reference site gives its section headings ("My projects", "Experience",
 * "Let's connect").
 *
 * Children are wrapped rather than replaced, so markup like the tag span and
 * the rule span inside a section title is preserved.
 *
 * The trigger is an IntersectionObserver, not a CSS-only animation, because it
 * has to be the element arriving in the viewport: a heading further down the
 * page must not animate while it is still off screen.
 *
 * Reduced motion shows the heading immediately with no movement.
 */

const WORD_MS = 70;

function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

export default function RevealHeading({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let done = false;
    let frame = 0;
    let observer: IntersectionObserver | null = null;
    let timer = 0;

    /*
     * The observer is the primary trigger, but it is not sufficient on its
     * own. IntersectionObserver notifications are delivered asynchronously and
     * coalesced, so a heading that travels from below the root to above it
     * between two notification cycles is reported as never having
     * intersected. A fast or jump scroll does exactly that, and the heading
     * then stays invisible for the rest of the session with nothing left to
     * catch it.
     *
     * The scroll listener is the backstop: it reveals the heading as soon as
     * its top crosses into the viewport, which is the same condition the
     * observer was meant to catch. Both paths converge on `reveal`, and
     * `done` makes it idempotent, so the first one to arrive wins.
     */
    function reveal() {
      if (done) return;
      done = true;
      setShown(true);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el?.getBoundingClientRect();
        if (r && r.top < window.innerHeight) reveal();
      });
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            return;
          }
        }
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    observer.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });

    /*
     * A heading already inside the viewport on mount is revealed straight
     * away rather than waiting for an intersection callback.
     */
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal();
    }

    /*
     * Backstop for an environment that stopped producing frames: if the
     * heading is anywhere near the viewport, show it rather than leaving it
     * hidden for the session.
     */
    timer = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.5) reveal();
    }, 1200);

    onScroll();

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  /* Every animated unit gets a delay from its own position, so the sequence
     runs in document order across the whole heading. */
  let step = 0;

  /*
   * Wrap a text node in one span per word. The words keep their own inline
   * spans so each can be delayed independently.
   *
   * The delay is computed from the word's position and applied only once the
   * heading is shown; before that the words sit at their start state with no
   * delay, so they do not all appear at once when the reveal begins.
   */
  const wrapText = (text: string): ReactNode =>
    splitWords(text).map((word) => {
      const delay = step++ * WORD_MS;

      return (
        <span
          key={`${word}-${delay}`}
          className="reveal-heading__word"
          style={{ transitionDelay: shown ? `${delay}ms` : undefined }}
        >
          {word}
          {"\u00A0"}
        </span>
      );
    });

  /*
   * Walk the children. A text node is split into words. An element is cloned
   * with its own text children wrapped, so a heading built from markup (the
   * tag span and the rule span) animates the same way as plain text.
   */
  const render = (node: ReactNode): ReactNode => {
    if (node === null || node === undefined || typeof node === "boolean") {
      return node;
    }
    if (typeof node === "string" || typeof node === "number") {
      return wrapText(String(node));
    }
    if (Array.isArray(node)) {
      return node.map((child) => render(child));
    }
    if (isValidElement(node)) {
      const element = node as ReactElement<{
        children?: ReactNode;
        className?: string;
      }>;
      const { children } = element.props;
      if (children === undefined) return node;
      return cloneElement(element, undefined, render(children));
    }
    return node;
  };

  return (
    <h2
      ref={ref as never}
      className={className}
      id={id}
      data-shown={shown ? "true" : "false"}
    >
      {render(children)}
    </h2>
  );
}
