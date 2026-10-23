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
              I build <span className="highlight">data platforms</span> and{" "}
              <span className="highlight">software products</span> for complex,
              real-world operations. My work spans data pipelines and
              warehouses, streaming and orchestration, cloud-native systems,
              backend APIs, and AI-assisted products across energy, mobility,
              public procurement, finance, and agriculture. I bring an
              engineering background to turning messy data and operational
              problems into systems people can trust and use.
            </span>
          </p>
        </div>

        <div className="go_button_container">
          <Link to="/projects">
            <button className="explore">Explore ➜</button>
          </Link>
        </div>

        <a
          className="book-call"
          href="https://cal.com/delebayo-asher-fzwdtb"
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a call
        </a>
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

          <li className={menu[4]}>
            <small>
              04
              <Link to="/writing">
                <img src={navLine} alt="menu bullet" /> WRITING
              </Link>
            </small>
          </li>

          <li className={menu[5]}>
            <small>
              05
              <Link to="/contact">
                <img src={navLine} alt="menu bullet" /> CONTACT
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
