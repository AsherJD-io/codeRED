import { useEffect } from "react";
import Helmet from "../Utils/SEO/helmet";
import Form from "../Utils/Form/form";
import "./contact.scss";

const BOOKING_URL = "https://cal.com/delebayo-asher-fzwdtb";

type ContactProps = {
  menu?: string[];
  // eslint-disable-next-line no-unused-vars
  activeMenu?: (arg: number) => void;
};

export default function Contact(props: ContactProps) {
  useEffect(() => {
    if (props.activeMenu) {
      props.activeMenu(2);
    }
  }, [props]);

  return (
    <div className="contact">
      <Helmet
        title="Contact"
        name="Contact Delebayo Asher"
        content="Reach out to Delebayo Asher"
      />

      {/* The heading, then the form, then booking. Nothing else belongs here;
          the old-build footer links are removed (see contact.scss). */}
      <div className="contact_container">
        <header className="contact_head">
          <h2 className="section-title">
            <span className="section-title__tag">&lt;Contact /&gt;</span>
            <span className="section-title__rule" aria-hidden="true" />
          </h2>
          <p className="contact_lede">
            For data engineering, platform builds, advisory or collaboration,
            send a message below and I will reply within 24 hours.
          </p>
        </header>

        <Form />

        <div className="contact_cta">
          <p>Prefer to talk it through first?</p>
          <a
            className="book-call"
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a call
          </a>
        </div>
      </div>
    </div>
  );
}
