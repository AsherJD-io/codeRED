import { Link } from "react-router-dom";
import myPic from "../../assets/imgs/my-pic.jpg";
import arrow from "../../assets/svgs/arrow.svg";
import navLine from "../../assets/svgs/menu-line.svg";
import "./base.scss";

export default function Base({ menu }: any) {
  return (
    <div className="base_container">
      <div className="hero">
        <div className="intro_box">
          <h1>
            Hi! I'm <br /> Delebayo Asher.
          </h1>
          <div className="my-pic">
            <img
              className="w-48 h-48 rounded-full"
              src={myPic}
              alt="my-avatar"
            />
          </div>
        </div>

        <div className="description">
          <p>
            <span>
              I’m a <span className="highlight">Data Engineer</span> with an
              engineering background across{" "}
              <span className="highlight">energy systems</span> and{" "}
              <span className="highlight">
                agricultural & environmental engineering
              </span>
              , focused on building reliable data pipelines and backend systems
              that turn real-world operational data into analytics-ready
              insights.
            </span>
          </p>
        </div>

        <div className="go_button_container">
          <Link to="/projects">
            <button className="explore">Explore ➜</button>
          </Link>
        </div>
      </div>

      <nav>
        <ul>
          <li className={menu[2]}>
            <small>
              02
              <Link to="/resume">
                <img src={navLine} alt="menu bullet" /> RESUME
              </Link>
            </small>
          </li>

          <li className={menu[3]}>
            <small>
              03
              <Link to="/projects">
                <img src={navLine} alt="menu bullet" /> PROJECTS
              </Link>
            </small>
          </li>
        </ul>
      </nav>

      <div className="footer">
        <img className="w-16 h-16 rounded-full" src={myPic} alt="" />
        <div className="social">
          <a
            href="https://www.linkedin.com/in/delebayo-joea/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin"></i> LinkedIn
            <img src={arrow} alt="pointer" />
          </a>

          <a
            href="https://github.com/AsherJD-io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github"></i> Github
            <img src={arrow} alt="pointer" />
          </a>

          <a
            href="https://x.com/23asher_io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-x-twitter"></i> Twitter
            <img src={arrow} alt="pointer" />
          </a>
        </div>
      </div>
    </div>
  );
}
