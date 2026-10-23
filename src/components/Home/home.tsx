import { useSubstackFeed } from "../../hooks/useSubstackFeed";
import { Link } from "react-router-dom";
import TerminalHero from "../TerminalHero/terminalhero";
import Experience from "../Experience/experience";
import ToolStrip from "../Utils/ToolStrip/toolstrip";
import BlogScout from "../Writing/blogscout";
import BioParagraphs from "../Utils/BioParagraph/bioparagraph";
import RevealHeading from "../Utils/RevealHeading/revealheading";
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
  { href: "https://x.com/23asher_io", label: "X", icon: "fab fa-x-twitter" },
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
                  <span className="work_row__year">{project.year}</span>
                  <span
                    className={`work_row__status work_row__status--${project.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {project.status}
                  </span>
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
        <RevealHeading className="section-title">
          <span className="section-title__tag">&lt;Blogs /&gt;</span>
          <span className="section-title__rule" aria-hidden="true" />
        </RevealHeading>
        <p className="home__section-lede">
          Latest writing on data engineering, systems and building in the open.
        </p>
        <BlogScout />
      </section>

      {/* e. About and skills. */}
      <section className="home__section" id="about">
        <RevealHeading className="section-title">
          <span className="section-title__tag">&lt;About /&gt;</span>
          <span className="section-title__rule" aria-hidden="true" />
        </RevealHeading>
        <div className="home__about">
          <BioParagraphs />
        </div>
        <ToolStrip />
      </section>

      {/* f. Contact and booking. */}
      <section className="home__section home__section--contact" id="contact">
        <RevealHeading className="section-title">
          <span className="section-title__tag">&lt;Contact /&gt;</span>
          <span className="section-title__rule" aria-hidden="true" />
        </RevealHeading>
        <p className="home__section-lede">
          For data engineering, platform builds, advisory or collaboration, the
          fastest route is a message or a call.
        </p>
        <div className="home__contact-actions">
          <Link className="home__primary" to="/contact">
            Send a message
          </Link>
          <a
            className="book-call"
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a call
          </a>
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
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
