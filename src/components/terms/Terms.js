import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

import SmoothEffect from "../smoothText";

import "./Terms.css"
const Terms = () => {
  const {t, i18n} = useTranslation()

  const changeLanguage = (lang) => {
      i18n.changeLanguage(lang)
  }
    document.body.style.overflow = "";
  return (
    <>
      <header>
        <div class="container">
          <div class="logo">
            M<span>K</span>
          </div>
          <div className="header__links">
            <Link to="/purchases" className="header__link">
            <Trans i18nKey="purchases">
              purc<span>hases</span>
            </Trans>
            </Link>
            <Link to="/promotion" className="header__link">
            <Trans i18nKey="promotion">
              prom<span>otion</span>
            </Trans>
            </Link>
            <Link to="/purchase" className="header__link">
            <Trans i18nKey="purchase">
              purc<span>hase</span>
            </Trans>
            </Link>
          </div>
        </div>
      </header>
      <section class="terms">
        <h1 class="terms__title">{t('Terms of service')}</h1>
        <div class="terms__container">
          <h2 class="terms-company__name">OOO "Markkomb"</h2>
          <h3 class="terms__subtitle none">1.{t('General Provisions')}</h3>
          <p class="terms__defenition none">
            <span>1.1 {t('Contentmaker')}</span> - <Trans i18nKey="Contentmaker-defi">
            a person who independently creates and publishes various types of content (texts, images, videos, audio files and other materials) for the purpose of information dissemination, audience interaction or commercial use on various platforms and media environments.
            </Trans>
          </p>

          <p class="terms__defenition none">
            <span>1.2.{t('Uses')}</span> - <Trans i18nKey="Uses-defi">
            Uses are the internal currency of the site used to obtain contact information. They are purchased with real money and there are no refunds for unused Uses. Refunds are only available within 24 hours of purchase, provided the Uses have not been used. To request a refund, the user must contact support via [email/feedback form] within the specified timeframe.
            </Trans>
          </p>

          <p class="terms__defenition none">
            <span>1.3 {t('Authentication Data of the User')}</span> - <Trans i18nKey="Auth">
            login (cell phone number / e-mail address of the User) and password (access code, which the User comes up with on his/her own), which together are recognized as a simple electronic signature of the User. The User shall independently ensure the safety of their Authentication Data
            </Trans>
          </p>

          <p class="terms__defenition none">
            <span>1.4 {t('User')}</span> - <Trans i18nKey="User-defi">
            a person accessing the Site and using materials and services on the Site. services posted on the Site.
            </Trans>
          </p>

          <p class="terms__defenition none">
            <span>1.5 {t('Contact data')}</span> - <Trans i18nKey="Contact-defi">
            is publicly available information collected and made available to users through the technologies of our service. This data includes e-mail addresses, links to social networks and other information intended for communication with content creators. Our service uses technology to find and process such information from public sources, while not violating the privacy and rights of third parties. Contact information is provided for the purpose of interacting with content creators, but the service does not guarantee its relevance, completeness or relevance to specific user requests
            </Trans>
          </p>
        </div>
      </section>

      <section className="footer">
        <div className="footer__container">
          <h3 className="footer__logo">MK,2024</h3>
          <Link to="/terms" className="footer__terms none">
            {t('Terms of service')}
          </Link>
          <Link to="/purpose" className="footer__purpose none">
          {t('Our purpose')}
          </Link>
          <button
            onClick={() => {
              SmoothEffect().then(() => {
                i18n.changeLanguage("ru");
              });
            }}
            className="footer__button"
          >
            Русский
          </button>
          <button
            onClick={() => {
              SmoothEffect().then(() => {
                i18n.changeLanguage("en");
              });
            }}
            className="footer__button"
          >
            English
          </button>
        </div>
      </section>
    </>
  );
};
export default Terms;
