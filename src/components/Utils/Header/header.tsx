import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/svgs/codered-logo.svg';
import './header.scss';

export default function Header() {
  const [isClosed, setIsClosed] = useState<boolean>(true);

  const toggleMenu = () => setIsClosed(!isClosed);

  return (
    <div id="header">
      <div className="header_wrapper">
        <div className="logo_container pt 1">
          <Link to="/">
            <img className="w-32" src={logo} alt="logo" />
          </Link>
        </div>

        <div className="menu_btn_wrapper">
          <button
            className={isClosed ? 'menu_btn' : 'menu_btn menu_btn_open'}
            onClick={toggleMenu}
          >
            <div className="menu_btn_line"></div>
            <div className="menu_btn_line"></div>
          </button>
        </div>
      </div>

      {!isClosed && (
        <nav>
          <div className="mobile_menu_container">
            <ul>
              <li>
                <Link to="/" onClick={toggleMenu}>Home</Link>
              </li>
              <li>
                <Link to="/projects" onClick={toggleMenu}>Projects</Link>
              </li>
              <li>
                <Link to="/resume" onClick={toggleMenu}>Résumé</Link>
              </li>
            </ul>

            <div className="social_box">
              <h3>Reach Me Here</h3>
              <a href="mailto:josephdelebayo@gmail.com" className="mt 1">
                josephdelebayo@gmail.com
              </a>

              <div className="social_icons">
                <a href="https://www.linkedin.com/in/delebayo-joeA/" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                
                <a href="https://github.com/AsherJD-io" aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </a>

                <a href="https://x.com/23asher_io" aria-label="X (Twitter)">
                  <i className="fab fa-x-twitter"></i>
                </a>
                
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
