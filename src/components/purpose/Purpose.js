import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

import SmoothEffect from "../smoothText";

import "./Purpose.css"

const Purpose = () => {
  const {t, i18n} = useTranslation()
    document.body.style.overflow = "";
  return (
    <>
      <header>
        <div className="container">
          <div className="logo">
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
      <section className="terms">
        <h1 className="terms__title">{t("Our purpose")}</h1>
        <div className="terms__container">
        <h3 className="terms__subtitle none"><Trans i18nKey="purpose-title">
        Our purpose is to provide data for     
        the people who need it. 
            </Trans> </h3>
          <h3 className="terms__subtitle none"><Trans i18nKey="first-question">
          Why should I use this service?</Trans></h3>
          <p className="terms__defenition none">
          <Trans i18nKey="first-answer">
          Our service uses publicly available methods of obtaining contact information about video bloggers, contentmakers on the world famous platform “YouTube”
          Our service will save time and money for people who want to buy advertising from bloggers
          </Trans>        
          </p>

          <h3 className="terms__subtitle none"><Trans i18nKey="second-question">
          What do I pay money for?</Trans></h3>
          <p className="terms__defenition none">
          <Trans i18nKey="second-answer">
          To use our service, you purchase usage that can be spent on any contentmaker to find out their contact information.</Trans>
          </p>

          <h3 className="terms__subtitle none"><Trans i18nKey="Third-question">
          Will my usage go away over time?</Trans></h3>
          <p className="terms__defenition none">
          <Trans i18nKey="Third-answer">
          No, your uses will not disappear over time, but this policy may change.</Trans>
          </p>

          <h3 className="terms__subtitle none"><Trans i18nKey="Fourth-question">
          Will contentmaker contact information that has already been purchased be stored?</Trans></h3>
          <p className="terms__defenition none">
          <Trans i18nKey="Fourth-answer">
          Yes, previously purchased data will be stored on your account, but
it is also worth considering that the contentmaker may change their contact details and they may not be up to date. In such situations, no refunds are available. And it is also worth considering that the contentmaker may stop his activity, and in order to optimize the work of the service, the contact details of the contentmaker who is no longer engaged in his activity will be deleted.</Trans>
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
export default Purpose;
