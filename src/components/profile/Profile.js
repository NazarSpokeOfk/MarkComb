import "./profile.css";
import Edit from "../../images/image 70.png";

import SmoothEffect from "../smoothText";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Profile = ({userData}) => {
  const { t, i18n } = useTranslation();
  document.body.style.overflow = "";
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Your profile</title>
          <meta name="description" content="Profile page" />
        </Helmet>
        <header>
          <div className="container">
            <div className="logo">
              <Link to="/">
                M<span>K</span>
              </Link>
            </div>
            <div className="header__links">
              <Link to="/purchases" className="header__link">
                {t("purc")}
                <span className="highlight">{t("hases")}</span>
              </Link>
              <Link to="/promotion" className="header__link">
                {t("prom")}
                <span>{t("otion")}</span>
              </Link>
              <Link to="/purchase" className="header__link">
                {t("purch")}
                <span>{t("ase")}</span>
              </Link>
            </div>
          </div>
        </header>


        <section class="profile">
          <div class="container">
            <button class="username__edit-button">
              <img src={Edit} alt="edit" />
            </button>

            <h1 class="profile_name">{userData ? userData?.user?.username : "Log in firstly"}</h1>

            <h2 class="profile_uses-title none">{t("uses")}</h2>
            <h3 class="profile_uses-amount">{userData ? userData?.user?.uses : ""}</h3>

            <div class="info_block">
              <h3 class="info_block-title none">
                {t("in")}
                <span>{t("fo")}</span>
              </h3>
              <h2 class="info_block-email none">
                {t("EM")}
                <span>{t("AIL")}</span> : {userData ? userData?.user?.email : ""}
              </h2>
              <button class="email__edit-button">
                <img src={Edit} alt="edit" />
              </button>
              <h2 class="info_block-password none">
                {t("PASS")}
                <span>{t("WORD")}</span> : {userData ? userData?.user?.password : "null"}
              </h2>
              <button class="password__edit-button">
                <img src={Edit} alt="edit" />
              </button>
            </div>
          </div>
        </section>

        <section class="footer">
          <div class="footer__container">
            <h3 class="footer__logo">MK,2024</h3>
            <Link to="/terms" class="footer__terms">
              {t("Terms of Service")}
            </Link>
            <Link to="/purpose" class="footer__purpose">
              {t("Our Purpose")}
            </Link>
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
          </div>
        </section>
      </HelmetProvider>
    </>
  );
};
export default Profile;
