import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import logo from "./assets/svgs/codered-mark.svg";

import Header from "./components/Utils/Header/header";
import Base from "./components/Base/base";
import Mobile from "./components/Base/mobile";
import Projects from "./components/Projects/projects";
import Resume from "./components/Resume/resume";
import Contact from "./components/Contact/contact";
import Error404 from "./components/Error/error404";

export default function App() {
  const [menu] = useState<string[]>(["active_menu", "", ""]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <div className="flex justify-center align-middle h-full w-full">
          <img className="w-16 loader" src={logo} alt="loader" />
        </div>
      ) : (
        <BrowserRouter>
          {/* MOBILE */}
          <div className="mobile_container">
            <Header />

            <Routes>
              <Route path="/" element={<Mobile menu={menu} />} />
              <Route
                path="/resume"
                element={<Resume menu={menu} activeMenu={() => {}} />}
              />
              <Route
                path="/projects"
                element={<Projects menu={menu} activeMenu={() => {}} />}
              />
              <Route
                path="/contact"
                element={<Contact activeMenu={() => {}} />}
              />
              <Route path="*" element={<Error404 />} />
            </Routes>

            {/* MOBILE SOCIALS */}
            <div className="social_buttons">
              <a
                href="https://www.linkedin.com/in/delebayo-joea/"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-linkedin"></i>
              </a>

              <a
                href="https://https://github.com/AsherJD-io"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="https://x.com/23asher_io"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-x-twitter"></i>
              </a>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="app-container">
            <div className="m-fixed">
              <Base menu={menu} />
            </div>

            <div className="main">
              <div className="pages_container">
                <Routes>
                  <Route
                    path="/"
                    element={<Resume menu={menu} activeMenu={() => {}} />}
                  />
                  <Route
                    path="/resume"
                    element={<Resume menu={menu} activeMenu={() => {}} />}
                  />
                  <Route
                    path="/projects"
                    element={<Projects menu={menu} activeMenu={() => {}} />}
                  />
                  <Route
                    path="/contact"
                    element={<Contact activeMenu={() => {}} />}
                  />
                  <Route path="*" element={<Error404 />} />
                </Routes>
              </div>
            </div>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}
