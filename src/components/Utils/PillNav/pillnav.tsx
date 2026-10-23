import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/imgs/codered-mark.png";
import { titleFor } from "../../../lib/tabTitle";
import "./pillnav.scss";

const BOOKING_URL = "https://cal.com/delebayo-asher-fzwdtb";

/*
 * The destinations, in the order they appear down the page.
 * `to` is the react-router target and `section` is the homepage anchor id
 * that is scrolled to and highlighted. Contact is the homepage section, not
 * the /contact route: the nav takes the visitor to the contact heading on the
 * page, where the form sits.
 */
type NavLink = {
  to: string;
  section?: string;
  label: string;
};

const LINKS: NavLink[] = [
  { to: "/", label: "Home" },
  { to: "/", section: "work", label: "Work" },
  { to: "/", section: "experience", label: "Experience" },
  { to: "/", section: "about", label: "About" },
  // Contact is the homepage section, not the /contact route: the nav takes the
  // visitor to the <Contact /> heading on the page, where the form sits.
  { to: "/", section: "contact", label: "Contact" },
];

const SECTION_IDS = LINKS.map((l) => l.section).filter((s): s is string =>
  Boolean(s),
);

/*
 * The section ids in the order they actually appear down the page. Nav order
 * and page order are not the same thing: Blogs sits above About in the
 * document even though About is the earlier nav item. Reading position is what
 * decides which section is current, so the order is measured from the DOM
 * rather than assumed from SECTION_IDS.
 *
 * The comparison uses the vertical offset rather than compareDocumentPosition:
 * for nodes in different subtrees compareDocumentPosition also reports
 * FOLLOWING for disjoint trees, which does not give a usable page order.
 */
function orderedSections(): HTMLElement[] {
  const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
    (el): el is HTMLElement => Boolean(el),
  );

  return sections.sort((a, b) => {
    const delta = a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    if (Math.abs(delta) > 1) return delta;
    // Same position (a zero-height anchor): the later nav entry wins, so the
    // highlight still advances as the page is read top to bottom.
    return sections.indexOf(a) < sections.indexOf(b) ? -1 : 1;
  });
}

/**
 * The header navigation.
 *
 * One header row: the brand mark on the left, the section links and the
 * booking action grouped on the right. The brand, links and CTA share the row.
 *
 * Active state is derived from scroll position on the homepage, and the pill
 * is driven by a plain scroll listener rather than an IntersectionObserver:
 * the page scrolls the document, and a scroll-driven calculation tracks the
 * current section continuously, including through smooth scrolling and after
 * a click. The listener is removed on unmount and re-armed when the route
 * changes.
 */
export default function PillNav({ onHomeClick }: { onHomeClick: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /*
   * The menu collapses itself when it is no longer in use, so it never sits
   * open over the reading surface:
   *  - a click anywhere outside the menu closes it;
   *  - Escape closes it;
   *  - scrolling the page closes it, since the menu is anchored to the header
   *    and would otherwise float detached from the links it belongs to.
   *
   * The toggle itself is excluded from the outside-click test, otherwise its
   * own click would immediately re-open the menu it just opened.
   */
  useEffect(() => {
    if (!open) return;

    const isInside = (target: unknown) => {
      if (typeof target !== "object" || target === null) return false;
      const node = target as Record<string, unknown>;
      if (typeof node.closest !== "function") return false;
      return Boolean(
        node.closest(".pill-nav") || node.closest(".pill-nav__links"),
      );
    };

    const onPointerDown = (event: { target: unknown }) => {
      if (!isInside(event.target)) setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onScroll = () => setOpen(false);

    document.addEventListener("mousedown", onPointerDown, true);
    document.addEventListener("touchstart", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", onPointerDown, true);
      document.removeEventListener("touchstart", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  /* Active section from scroll position. */
  useEffect(() => {
    setActive(null);
    setOpen(false);

    if (pathname !== "/") return;

    const sections = orderedSections();
    if (sections.length === 0) return;

    /*
     * The current section is the last one whose top has passed the reading
     * line. Because this runs on every scroll frame, the highlight travels
     * with the page instead of latching onto the first entry.
     */
    const line = () => window.innerHeight * 0.3;

    let timer = 0;
    let last: string | null = null;

    const update = () => {
      const now = line();
      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= now) current = section.id;
      }
      if (current !== last) {
        last = current;
        setActive(current);
      }
    };

    /*
     * The tab title follows the same signal as the highlight, so it is correct
     * after a click, a direct hash load, a refresh, and back/forward navigation
     * alike. It is driven from the same poll rather than from the click handler,
     * so it cannot disagree with the visible section.
     */
    const applyTitle = () => {
      const title = titleFor(last);
      if (document.title !== title) document.title = title;
    };

    const tick = () => {
      update();
      applyTitle();
    };

    /*
     * Polled rather than only rAF-driven. rAF is throttled to zero when the tab
     * is hidden, which would freeze the highlight; a short interval keeps it
     * correct in that case too, and the early-exit on an unchanged result
     * keeps the cost negligible.
     */
    const loop = () => {
      tick();
      timer = window.setInterval(tick, 250);
    };
    loop();

    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);

    /* A back/forward move can change the scroll position without a scroll
       event, so the history API is listened to as well. */
    window.addEventListener("popstate", tick);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      window.removeEventListener("popstate", tick);
    };
  }, [pathname]);

  /*
   * The element that actually scrolls the page.
   *
   * Only a box whose own height is the viewport and whose overflow allows
   * scrolling can move. Every wrapper here (.mobile_container, .App, main,
   * .page-column) is as tall as the whole document with `overflow: visible`,
   * so calling `scrollTo` on any of them is a no-op and the page stays put.
   * The real scroller is the document root.
   */
  const scroller = (): HTMLElement =>
    document.scrollingElement instanceof HTMLElement
      ? document.scrollingElement
      : document.documentElement;

  /*
   * How much room the fixed header takes, plus breathing space below it. The
   * offset is measured from the header rather than assumed, so the target
   * heading always lands clear of the bar instead of behind it.
   */
  const headerOffset = () => {
    const header = document.querySelector<HTMLElement>(".site-header");
    return (header?.offsetHeight ?? 52) + 16;
  };

  /**
   * Bring an element to the top of the visible area, clear of the fixed
   * header.
   */
  const scrollToElement = (el: HTMLElement | null) => {
    if (!el) return;
    const sc = scroller();
    const top =
      el.getBoundingClientRect().top +
      (sc.scrollTop || window.scrollY) -
      sc.getBoundingClientRect().top -
      headerOffset();

    /*
     * An instant jump rather than an animated one. The reading line that drives
     * the highlight and the tab title advances with the scroll position, and an
     * animated smooth scroll takes several frames to travel: the highlight then
     * trails the page and the active section can disagree with the URL. A jump
     * makes the landed section and the highlight agree immediately.
     */
    window.scrollTo({ top, behavior: "auto" });
  };

  /*
   * The tab title follows the active section, so it is correct after a click,
   * a direct hash load, a refresh, and back/forward navigation alike. It is
   * driven from the same state as the highlight rather than from a click
   * handler, so it cannot disagree with the visible section.
   */
  useEffect(() => {
    if (pathname !== "/") return;
    const title = titleFor(active);
    if (document.title !== title) document.title = title;
  }, [active, pathname]);

  /*
   * The browser's own anchor navigation is not dependable here: with the root
   * pinned to the viewport and the document overflowing it, a direct hash load
   * or a refresh on a hash does not reliably move the page, and the browser's
   * scroll restoration is asynchronous. Reading the hash explicitly and
   * scrolling to the matching section makes a direct load, a refresh, and a
   * back/forward move all land on the right section.
   *
   * Restoration is disabled first, so the browser's own attempt cannot override
   * the explicit jump that follows it.
   *
   * `scrollToElement` is read from a ref rather than listed as a dependency: it
   * closes over `reduced`, and re-running the effect on every reduced-motion
   * change would re-jump the page. The ref keeps the latest implementation
   * without re-arming the listeners.
   */
  if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  const scrollToElementRef = useRef(scrollToElement);
  scrollToElementRef.current = scrollToElement;

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;

    /*
     * The highlight and the tab title follow the reading line, which only
     * advances once the page has actually moved. The scroll is an instant jump,
     * so the reading line is already at its resting place by the next frame;
     * one more frame makes sure the layout has settled before the state is
     * written, so the active link and the title agree with the section on
     * screen.
     */
    const settle = () => {
      if (cancelled) return;
      window.setTimeout(() => {
        if (cancelled) return;
        const line = window.innerHeight * 0.3;
        let current: string | null = null;
        for (const section of orderedSections()) {
          if (section.getBoundingClientRect().top <= line) current = section.id;
        }
        setActive(current);
      }, 60);
    };

    /*
     * The document is still laying out when this first runs: the intro clears,
     * images and fonts arrive, and the document height changes several times in
     * the first second. A scroll computed from a geometry reading taken during
     * that window lands in the wrong place, and re-reading while it is still
     * moving chases the moving target.
     *
     * Wait until the document height has been stable for a few frames, then
     * scroll once from a settled reading.
     */
    const jump = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      let stable = 0;
      let previousHeight = 0;
      let waited = 0;

      const attempt = () => {
        if (cancelled) return;

        const height = document.documentElement.scrollHeight;
        if (height === previousHeight) {
          stable += 1;
        } else {
          stable = 0;
          previousHeight = height;
        }

        /* Three unchanged readings, or a bounded wait if the layout settles
           early. */
        if (stable < 3 && waited < 60) {
          waited += 1;
          window.requestAnimationFrame(attempt);
          return;
        }

        scrollToElementRef.current(target);
        settle();
      };

      attempt();
    };

    jump();
    window.addEventListener("hashchange", jump);
    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", jump);
    };
  }, [pathname]);

  /*
   * Clicking a destination. On the homepage the browser's own hash navigation
   * handles it and the scroll listener updates the highlight. From another
   * route we get home first, then scroll to the anchor once the section is
   * measurable — retried on a rAF rather than a fixed delay.
   */
  const onClick = (event: MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    setOpen(false);

    if (link.to !== "/") return; // real route: react-router handles it

    event.preventDefault();

    if (pathname === "/") {
      window.history.pushState(
        null,
        "",
        link.section ? `#${link.section}` : "/",
      );
      if (link.section) {
        scrollToElement(document.getElementById(link.section));
      } else {
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }
      return;
    }

    void navigate("/");
    let attempts = 0;
    const scroll = () => {
      const target = link.section
        ? document.getElementById(link.section)
        : null;
      if (target || attempts > 40) {
        if (target) {
          scrollToElement(target);
        } else {
          window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
        }
        return;
      }
      attempts += 1;
      window.requestAnimationFrame(scroll);
    };
    window.requestAnimationFrame(scroll);
  };

  return (
    /*
      One row spanning the reading column: the brand mark at its left edge,
      the pill and the booking CTA grouped at its right edge. Because it sits
      in the content flow rather than being pinned to the viewport, the whole
      row scrolls away with the page instead of staying fixed over the content.
    */
    <div className="site-header">
      {/*
        The brand mark, top-left. It is outside the pill so the pill keeps its
        own shape. Clicking it replays the codeRED intro, which then opens the
        page again, rather than jumping straight to the top.
      */}
      <button
        type="button"
        className="pill-brand"
        aria-label="codeRED home"
        onClick={onHomeClick}
      >
        <img src={logo} alt="codeRED" />
      </button>

      {/*
        One right-anchored group holding the navigation pill and the booking CTA
        side by side. Sharing a container is what keeps them from overlapping:
        the pill no longer has to guess the CTA's width.
      */}
      <div className="pill-bar">
        <nav className="pill-nav" aria-label="Primary">
          <button
            type="button"
            className="pill-nav__toggle"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="pill-nav__toggle-line" aria-hidden="true" />
            <span className="pill-nav__toggle-line" aria-hidden="true" />
          </button>

          <div className="pill-nav__links" data-open={open}>
            {LINKS.map((link) => {
              const key = link.section ?? "home";
              return (
                <Link
                  key={key}
                  className="pill-nav__link"
                  to={link.to}
                  state={{ section: link.section }}
                  aria-current={active === link.section ? "page" : undefined}
                  onClick={(event) => onClick(event, link)}
                >
                  {link.label}
                </Link>
              );
            })}

            {/*
              On a phone the booking action lives inside the menu rather than in
              the corner: the corner is where the menu toggle is, and a second
              pill there crowds it. Hidden on desktop, where the CTA is its own
              pill beside the nav.
            */}
            <a
              className="pill-nav__link pill-nav__link--cta"
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a call
            </a>
          </div>
        </nav>

        <a
          className="pill-nav__cta"
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a call
        </a>
      </div>
    </div>
  );
}
