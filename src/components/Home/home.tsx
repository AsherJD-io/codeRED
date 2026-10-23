import { useSubstackFeed } from "../../hooks/useSubstackFeed";
import TerminalHero from "../TerminalHero/terminalhero";
import Experience from "../Experience/experience";
import ToolStrip from "../Utils/ToolStrip/toolstrip";
import BlogScout from "../Writing/blogscout";
import BioParagraphs from "../Utils/BioParagraph/bioparagraph";
import RevealHeading from "../Utils/RevealHeading/revealheading";
import Form from "../Utils/Form/form";
import arrow from "../../assets/svgs/arrow.svg";
import { PROJECT_LIST } from "../../constants/projects";
import "./home.scss";

const BOOKING_URL = "https://cal.com/delebayo-asher-fzwdtb";

const SOCIALS = [
  {
    href: "https://www.linkedin.com/in/delebayo-joea/",
    label: "LinkedIn",
    icon: "fab fa-linkedin",
  },
  {
    href: "https://github.com/AsherJD-io",
    label: "GitHub",
    icon: "fab fa-github",
  },
  {
    href: "https://x.com/23asher_io",
    label: "Twitter",
    icon: "fab fa-x-twitter",
  },
];

/**
 * The homepage is one continuous, vertically stacked journey. Each section
 * is a stage of the same document. The terminal hero is the first stage:
 * the personal introduction on the left, the animated portrait rendering on
 * the right. Nothing is moved below the terminal.
 */
export default function Home() {
  useSubstackFeed();

  return (
    <div className="home">
      {/* a. Terminal hero — introduction on the left, animated portrait to the right. */}
      <TerminalHero />

      {/* b. Work — wide editorial rows, alternating image and text. */}
      <section className="home__section" id="work">
        <RevealHeading className="section-title reveal">
          <span className="section-title__tag">&lt;Work /&gt;</span>
          <span className="section-title__rule" aria-hidden="true" />
        </RevealHeading>
        <p className="home__section-lede reveal">
          Selected work across data platforms, procurement transparency and
          product backends. Each entry lists the stack actually used and the
          state it is in now.
        </p>
        <div className="work_rows">
          {PROJECT_LIST.map((project, index) => (
            <article
              className={`work_row reveal reveal--stagger-${index % 3}${
                index % 2 === 1 ? " is-right" : ""
              }`}
              key={project.id}
            >
              {/* Row 1: preview left, information right. Row 2: mirrored. */}
              <a
                className="work_row__preview"
                href={project.live || project.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} preview`}
              >
                <img
                  src={project.preview}
                  alt={`${project.title} preview`}
                  loading="lazy"
                />
              </a>

              <div className="work_row__info">
                <div className="work_row__meta">
                  {project.status ? (
                    <span
                      className={`work_row__status work_row__status--${project.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {project.status}
                    </span>
                  ) : null}
                  <span className="work_row__role">{project.role}</span>
                </div>

                <h3 className="work_row__title">{project.title}</h3>

                <p className="work_row__description">{project.description}</p>

                <p className="work_row__contribution">
                  <strong>What I built.</strong> {project.contribution}
                </p>

                <div className="work_row__stacks">
                  {project.stack.split(" · ").map((stack) => (
                    <span key={stack} className="work_row__stack">
                      {stack}
                    </span>
                  ))}
                </div>

                <div className="work_row__links">
                  {project.live ? (
                    <a
                      className="work_row__link"
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="far fa-eye" aria-hidden="true" />
                      Live
                    </a>
                  ) : null}
                  {project.github ? (
                    <a
                      className="work_row__link"
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-code-branch" aria-hidden="true" />
                      Code
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* c. Experience — scroll-driven timeline. */}
      <Experience />

      {/* d. Blogs — image-led grid of three articles. */}
      <section className="home__section" id="blogs">
        <RevealHeading className="section-title reveal">
          <span className="section-title__tag">&lt;Blogs /&gt;</span>
          <span className="section-title__rule" aria-hidden="true" />
        </RevealHeading>
        <p className="home__section-lede reveal">
          My unscripted ripples and waves on systems, life in tech and everything
          alike.
        </p>
        <BlogScout />
      </section>

      {/* e. About and skills. */}
      <section className="home__section" id="about">
        <RevealHeading className="section-title reveal">
          <span className="section-title__tag">&lt;About /&gt;</span>
          <span className="section-title__rule" aria-hidden="true" />
        </RevealHeading>
        <div className="home__about reveal">
          <BioParagraphs />
        </div>

        {/*
          The strip gets its own heading. It is a label for the tools below
          the about copy, not a page section, so it is not offered in the nav.

          It carries the same top divider as every other section heading, so
          the strip is not a heading without a line above it.
        */}
        <RevealHeading className="section-title home__tools-heading reveal">
          <span className="section-title__tag">&lt;My stack /&gt;</span>
          <span className="section-title__rule" aria-hidden="true" />
        </RevealHeading>
        {/*
          The nav's Skills & Tools entry targets this anchor. The heading names
          the strip rather than being a page section of its own, so the anchor
          is a thin marker around the strip rather than a heading of its own.
        */}
        <div id="skills" className="home__skills-anchor">
          <ToolStrip />
        </div>
      </section>

      {/* f. Contact — the form is the section, as in the reference: a big
             centred line above a centred card holding the fields, the booking
             action at the card's top-right corner, and the socials centred
             beneath it. The section id stays so the nav's Contact link still
             scrolls here; there is no <Contact /> heading of its own. */}
      <section
        className="home__section home__section--contact reveal"
        id="contact"
      >
        <h2 className="home__contact-heading reveal">
          <span className="reveal-heading__word">Let&apos;s</span>{" "}
          <span className="reveal-heading__word home__contact-heading-em">
            build
          </span>{" "}
          <span className="reveal-heading__word">it.</span>
        </h2>

        <div className="home__contact-card">
          <h3 className="home__contact-card-title">Say hello</h3>

          {/*
            The booking action sits directly under the heading rather than in
            the card's corner: a filled pill in the corner competed with the
            filled submit button and made the card read as two equal actions.
          */}
          <a
            className="home__contact-book"
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a call
          </a>

          <Form />
        </div>

        <div className="home__social">
          {SOCIALS.map((social) => (
            <a
              key={social.href}
              className="home__social-link"
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={social.icon} aria-hidden="true" />
              <span>{social.label}</span>
              {/*
                The slanting arrow from the revamped build, not a Font Awesome
                glyph: it is the mark the rest of the page uses for an outward
                link.
              */}
              <img className="home__social-arrow" src={arrow} alt="" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
