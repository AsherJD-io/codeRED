import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./pillnav.scss";

const BOOKING_URL = "https://cal.com/delebayo-asher-fzwdtb";

/*
 * The five agreed destinations, in the order they appear down the page.
 * `to` is the react-router target and `section` is the homepage anchor id
 * that is scrolled to and highlighted. Blogs and Contact are real routes;
 * they keep their `section` so the highlight still follows the homepage
 * anchor when they are visited from there.
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
 * The floating pill navigation.
 *
 * Five links in one compact pill, with the booking action as a separate pill
 * outside it. No logo and no brand text.
 *
 * Active state is derived from scroll position on the homepage, and the pill
 * is driven by a plain scroll listener rather than an IntersectionObserver:
 * the page scrolls the document, and a scroll-driven calculation tracks the
 * current section continuously, including through smooth scrolling and after
 * a click. The listener is removed on unmount and re-armed when the route
 * changes.
 */
export default function PillNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

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
     * Polled rather than only rAF-driven. rAF is throttled to zero when the tab
     * is hidden, which would freeze the highlight; a short interval keeps it
     * correct in that case too, and the early-exit on an unchanged result
     * keeps the cost negligible.
     */
    const loop = () => {
      update();
      timer = window.setInterval(update, 250);
    };
    loop();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
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

  /** Bring an element to the top of the visible area. */
  const scrollToElement = (el: HTMLElement | null) => {
    if (!el) return;
    const sc = scroller();
    const top =
      el.getBoundingClientRect().top +
      (sc.scrollTop || window.scrollY) -
      sc.getBoundingClientRect().top;

    /*
     * An instant jump, not a smooth one. A smooth scroll is animated, and in a
     * hidden or backgrounded tab there are no animation frames for it to run
     * on, so it never lands and the page stays where it was. Jumping also
     * suits a section-to-section move better than an animated glide.
     */
    window.scrollTo({ top, behavior: "auto" });
  };

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
        window.scrollTo({ top: 0, behavior: "auto" });
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
          window.scrollTo({ top: 0, behavior: "auto" });
        }
        return;
      }
      attempts += 1;
      window.requestAnimationFrame(scroll);
    };
    window.requestAnimationFrame(scroll);
  };

  return (
    <>
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
                to={link.section ? `/#${link.section}` : link.to}
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
    </>
  );
}
