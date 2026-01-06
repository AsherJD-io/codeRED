import { useEffect } from "react";
import { Link } from "react-router-dom";
import Helmet from "../Utils/SEO/helmet";
import Form from "../Utils/Form/form";
import "./contact.scss";

interface ContactProps {
  menu?: string[];
  // eslint-disable-next-line no-unused-vars
  activeMenu?: (arg: number) => void;
}

export default function Contact(props: ContactProps) {
  useEffect(() => {
    if (props.activeMenu) {
      props.activeMenu(2);
    }
  }, [props]);

  return (
    <div className="contact">
      <Helmet
        title="Contact Me"
        name="Contact Delebayo Asher"
        content="Reach out to Delebayo Asher"
      />

      <Form />

      <div className="go_button_container">
        <Link to="/resume">
          <button>
            <b>➜ </b> Résumé
          </button>
        </Link>

        <Link to="/">
          <button> Home ➜ </button>
        </Link>
      </div>
    </div>
  );
}
