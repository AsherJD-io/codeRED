import { useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Project from "../Utils/Project/project";
import Helmet from "../Utils/SEO/helmet";
import "./projects.scss";

type ProjectType = {
  id: string;
  title: string;
  description: string;
  github?: string;
  github2?: string;
  live?: string;
  stack: string;
  isPrivate: boolean;
  isLive: boolean;
};

type ProjectsProps = {
  menu?: string[];
  // eslint-disable-next-line no-unused-vars
  activeMenu?: (arg: number) => void;
};

const projects: ProjectType[] = [
  {
    id: uuid(),
    title: "Energy Decision Support System",
    description: "Electricity demand analytics for grid planning decisions.",
    live: "",
    stack:
      "Python + SQL + PostgreSQL + BigQuery + dbt + PySpark + Kestra + Terraform + Docker",
    isPrivate: true,
    isLive: false,
  },
  {
    id: uuid(),
    title: "ordaCiti",
    description:
      "Connects government procurement records across time and place.",
    github: "https://github.com/AsherJD-io/ordaciti",
    live: "https://ordaciti.vercel.app",
    stack: "Python + Next.js + TypeScript + OCDS",
    isPrivate: false,
    isLive: true,
  },
  {
    id: uuid(),
    title: "NYC Taxi Data Platform",
    description: "Mobility trip data, ingested and modelled end to end.",
    github: "https://github.com/AsherJD-io/nyc-taxi-data-platform",
    live: "",
    stack:
      "Docker + Terraform + Kestra + BigQuery + dbt + Spark + Kafka + PyFlink",
    isPrivate: false,
    isLive: false,
  },
  {
    id: uuid(),
    title: "Trading Performance Analytics",
    description: "Trading performance as a behavioural and risk system.",
    live: "",
    stack: "Python + dbt + BigQuery + Kestra + Streamlit + Docker",
    isPrivate: true,
    isLive: false,
  },
  {
    id: uuid(),
    title: "Thesie",
    description:
      "Lending access and accountability for small businesses, in development.",
    live: "",
    stack: "Python + FastAPI + SQLAlchemy + PostgreSQL + Alembic",
    isPrivate: true,
    isLive: false,
  },
  {
    id: uuid(),
    title: "codeRED",
    description: "This portfolio site, built around a code-inspired identity.",
    github: "https://github.com/AsherJD-io/codeRED",
    live: "https://codered-azure.vercel.app",
    stack: "React + TypeScript + SCSS + Vite",
    isPrivate: false,
    isLive: true,
  },
];

export default function Projects(props: ProjectsProps) {
  useEffect(() => {
    if (props.activeMenu) {
      props.activeMenu(1);
    }
  }, [props]);

  return (
    <div className="project">
      <Helmet
        title="My Projects"
        name="Selected Projects"
        content="Selected Delebayo Asher Projects"
      />

      <div className="group portfolio_showcase">
        {projects.map((project) => (
          <Project key={project.id} {...project} />
        ))}
      </div>

      <div className="go_button_container">
        <Link to="/">
          <button>
            <b>➜ </b> Home
          </button>
        </Link>

        <Link to="/resume">
          <button>Résumé ➜ </button>
        </Link>
      </div>
    </div>
  );
}
