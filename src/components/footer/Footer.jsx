import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";

import SmoothEffect from "../smoothText";

import "./Footer.css";

const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <section className="footer">
      <div className="footer__container">
        <div className="footer-first__group">
          <div id="logo_footer" className="logo">
            Mark<span>Comb</span>
          </div>
        </div>

        <div className="footer-second__group">
          <Link id="Terms" to="/terms" className="footer__terms none">
            {t("Terms of service")}
          </Link>
          <Link to="/purpose" className="footer__purpose none">
            {t("Our purpose")}
          </Link>
          <Link to="/dataprocessing" className="footer__purpose none">
            {t("Personal Data Processing Agreement")}
          </Link>
          <a
            href="/offer.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__purpose none"
          >
            {t("Offer")}
          </a>

          <h4 className="footer-third__group-text">2025 MarkComb</h4>
          <h4 className="footer-third__group-text">
            📧 <a href="mailto:markcombsup@gmail.com">markcombsup@gmail.com</a>
          </h4>
        </div>

        <div className="footer__btns-container">
          <button
            onClick={() => {
              SmoothEffect().then(() => {
                i18n.changeLanguage("ru");
              });
            }}
            className="footer__button"
            id="RuButton"
          >
            Ru
          </button>
          <button
            onClick={() => {
              SmoothEffect().then(() => {
                console.log(i18n);
                i18n.changeLanguage("en");
              });
            }}
            className="footer__button"
          >
            En
          </button>
        </div>
      </div>
    </section>
  );
};
export default Footer;
