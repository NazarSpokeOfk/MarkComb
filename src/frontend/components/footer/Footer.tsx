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
            A tool for promotion through YouTube. Fast. <br />
            Smart. Effective.
          </p>
        </div>

        <div className="information__flex">
          <div className="second__flex">
            <h2 className="flex__title">Documents</h2>
            <div className="links__flex">
              <Link to="" className="flex__link">
                Data processing agreement
              </Link>
              <Link to="" className="flex__link">
                Terms of service
              </Link>
              <Link to="" className="flex__link">
                Privacy policy
              </Link>
              <Link to="" className="flex__link">
                Offer
              </Link>{" "}
              <Link to="" className="flex__link">
                Our purpose
              </Link>
            </div>
          </div>

          <div className="third__flex">
            <h2 className="flex__title">Contact us</h2>
            <a className="mail" href="mailto:markcombsup@gmail.com">
              markcombsup@gmail.com
            </a>
            <div className="social__media-flex">
              <a href="" className="social__media-icon_telegram">
                <img src={TelegramLogo} alt="" />
              </a>
              <a href="" className="social__media-icon_yt">
                <img src={YTLogo} alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__divider" />

      <p className="footer__last-text">© 2025 MarkComb. All rights reserved</p>
    </section>
  );
};
export default Footer;
