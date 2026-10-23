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
}: {
  children: ReactNode;
  className?: string;
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

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
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
      data-shown={shown ? "true" : "false"}
    >
      {render(children)}
    </h2>
  );
}
