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
  activeMenu?: (arg: number) => void;
};

const projects: ProjectType[] = [
  {
    id: uuid(),
    title: "codeRED",
    description: "My Portfolio Website",
    github: "https://github.com/AsherJD-io/codered",
    live: "https://codered-azure.vercel.app",
    stack: "React + TypeScript + Vite + SCSS ",
    isPrivate: false,
    isLive: true,
  },
  {
    id: uuid(),
    title: "Activity Tab Tracker",
    description: "A desktop monitoring tool",
    github: "https://github.com/AsherJD-io/Tabs-activity_tracker",
    live: "",
    stack: "Python",
    isPrivate: false,
    isLive: false,
  },
  {
    id: uuid(),
    title: "Snake Game",
    description: "React Snake Game with two gameplay modes",
    github: "https://github.com/AsherJD-io/React-Snake-Game",
    live: "https://react-snake-game.vercel.app",
    stack: "JavaScript + React",
    isPrivate: false,
    isLive: true,
  },
  {
    id: uuid(),
    title: "Undergraduate Project",
    description: "Mini evacuator for battery cage systems",
    github: "",
    live:
      "https://drive.google.com/file/d/14HWOratSFaNGelik2H1Q5oHGAxwcv2AY/view?usp=sharing",
    stack: "Engineering Design + Fabrication + Automation",
    isPrivate: true,
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
        content="Selected Delebayo Fadejin Projects"
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
