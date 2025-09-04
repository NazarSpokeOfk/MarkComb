import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";

import SmoothEffect from "../../utilities/smoothText";

import HeaderLogo from "../../icons/MarkComb.png";
import YTLogo from "../../icons/ytIcon.png";
import TelegramLogo from "../../icons/telegramIcon.png";

import "../../fonts/font.css";
import "./Footer.css";

const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <section className="footer">
      <div className="footer__container">
        <div className="first__flex">
          <img src={HeaderLogo} alt="" className="first__flex-logo" />
          <p className="first__flex-text">
            {t("A tool for promotion through YouTube. Fast")}. <br />
            {t("Smart. Effective")}.
          </p>
        </div>

        <div className="information__flex">
          <div className="second__flex">
            <h2 className="flex__title">{t("Documents")}</h2>
            <div className="links__flex">
              <Link to="/dataprocessing" className="flex__link">
                {t("Data processing agreement")}
              </Link>
              <Link to="/terms" className="flex__link">
                {t("Terms of service")}
              </Link>
              <Link to="/dataprocessing" className="flex__link">
                {t("Privacy policy")}
              </Link>
              <a href="/offer.pdf" className="flex__link">
                {t("Offer")}
              </a>{" "}
              <Link to="/purpose" className="flex__link">
                {t("Our purpose")}
              </Link>
            </div>
          </div>

          <div className="third__flex">
            <h2 className="flex__title">{t("Contact us")}</h2>
            <a className="mail" href="mailto:markcombsup@gmail.com">
              markcombsup@gmail.com
            </a>
            <div className="social__media-flex">
              <a target="_blank" href="https://t.me/markcomb" className="social__media-icon_telegram">
                <img src={TelegramLogo} alt="" />
              </a>
              <a target="_blank" href="https://www.youtube.com/@MarkCombtm" className="social__media-icon_yt">
                <img src={YTLogo} alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__divider" />

      <p className="footer__last-text">{t("2025 MarkComb™")}</p>
    </section>
  );
};
export default Footer;
