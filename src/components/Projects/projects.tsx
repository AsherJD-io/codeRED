import { useEffect } from "react";
import { Link } from "react-router-dom";
import Helmet from "../Utils/SEO/helmet";
import { PROJECT_LIST } from "../../constants/projects";
import RevealHeading from "../Utils/RevealHeading/revealheading";
import "./projects.scss";

type ProjectsProps = {
  menu?: string[];
  // eslint-disable-next-line no-unused-vars
  activeMenu?: (arg: number) => void;
};

/**
 * The dedicated /projects route.
 *
 * The same editorial presentation as the homepage work rows: large
 * alternating image-and-copy spreads, one per project, so the two views read
 * as one document. There is no selector rail and no card grid.
 */
export default function Projects(props: ProjectsProps) {
  useEffect(() => {
    if (props.activeMenu) {
      props.activeMenu(1);
    }
  }, [props]);

  return (
    <div className="project-page">
      <Helmet
        title="Projects"
        name="Selected Projects"
        content="Selected data engineering and software projects by Delebayo Asher"
      />

      <header className="page-head">
        <RevealHeading className="section-title">
          <span className="section-title__tag">&lt;Selected work /&gt;</span>
          <span className="section-title__rule" aria-hidden="true" />
        </RevealHeading>
        <p className="page-head__intro">
          Selected work across data platforms, procurement transparency and
          product backends. Each entry lists the stack actually used, the
          engineering I did on it, and the state it is in now.
        </p>
      </header>

      <div className="project-rows">
        {PROJECT_LIST.map((project, index) => (
          <article
            className={`project_row${index % 2 === 1 ? " is-right" : ""}`}
            key={project.id}
          >
            <a
              className="project_row__preview"
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

            <div className="project_row__info">
              <div className="project_row__meta">
                {project.status ? (
                  <span
                    className={`project_row__status project_row__status--${project.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {project.status}
                  </span>
                ) : null}
                <span className="project_row__role">{project.role}</span>
              </div>

              <h3 className="project_row__title">{project.title}</h3>

              <p className="project_row__description">{project.description}</p>

              <p className="project_row__contribution">
                <strong>What I built.</strong> {project.contribution}
              </p>

              <div className="project_row__stacks">
                {project.stack.split(" · ").map((stack) => (
                  <span key={stack} className="project_row__stack">
                    {stack}
                  </span>
                ))}
              </div>

              <div className="project_row__links">
                {project.live ? (
                  <a
                    className="project_row__link"
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
                    className="project_row__link"
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

      <div className="project_page__actions">
        <Link to="/">
          <button>
            <b>&#10142; </b> Home
          </button>
        </Link>

        <Link to="/resume">
          <button>Résumé &#10142; </button>
        </Link>
      </div>
    </div>
  );
}
