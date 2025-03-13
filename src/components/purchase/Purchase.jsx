import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import "./Purchase.css";
import SmoothEffect from "../smoothText";

const Purchase = ({isLoggedIn,userData}) => {
  const titleRef = useRef();

  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  const handleClick = () => {
    if (isLoggedIn) {
      console.log("successed purchase");
    } else {
      navigate("/");
    }
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      titleRef.current.classList.add("active");
    }, 50);

    return () => {
      clearInterval(timer)
    } 
  },[]);
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Purchase uses</title>
          <meta name="description" content="You can purchase uses here."/>
        </Helmet>
        <header>
          <div className="container">
            <div className="logo">
              <Link to="/">
                Mark<span>Comb</span>
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

        <section className="balance">
          <div className="container">
            <h2 ref={titleRef} className="title__purchase">
              {t("PUR")}
              <span>{t("CHASE")}</span>
            </h2>
            <div className="balance__block">
              <h3 className="balance-block__money">
                {isLoggedIn
                  ? userData?.user?.username
                  : t("Firstly,log in to your account")}
              </h3>
              <h3 className="balance-block__uses">
                {isLoggedIn ? userData?.user?.uses + " uses" : ""}
              </h3>
            </div>
          </div>
        </section>

        <section className="packages">
          <h2 className="packages__title none">{t("packages")}</h2>
          <div className="packages__wrapper">
            <div className="packages-light__package">
              <h3 className="package__title none">{t("Light")}</h3>
              <h4 className="package__usages none">10 {t("uses(s)")}</h4>
              <h4 className="package__price">
                $<span>10 </span>usd
              </h4>
              <h4 className="package__newprice">
                $<span>5</span> usd
              </h4>
              <button
                onClick={() => handleClick()}
                className="package__button none"
              >
                {t("purch")}
                <span>{t("ase")}</span>
              </button>
            </div>

            <div className="packages-light__package">
              <h3 className="package__title none">{t("Medium")}</h3>
              <h4 className="package__usages none">50 {t("uses(s)")}</h4>
              <h4 className="package__price none">
                $<span>50 </span>usd
              </h4>
              <h4 className="package__newprice">
                $<span>15</span> usd
              </h4>
              <button
                onClick={() => handleClick()}
                className="package__button none"
              >
                {t("purch")}
                <span>{t("ase")}</span>
              </button>
            </div>

            <div className="packages-light__package">
              <h3 className="package__title none">{t("Big")}</h3>
              <h4 className="package__usages none">75 {t("uses(s)")}</h4>
              <h4 className="package__price">
                $<span>75 </span>usd
              </h4>
              <h4 className="package__newprice">
                $<span>25</span> usd
              </h4>
              <button
                onClick={() => handleClick()}
                className="package__button none"
              >
                {t("purch")}
                <span>{t("ase")}</span>
              </button>
            </div>

            <div id="business" className="packages-light__package">
              <h3 className="package__title-business none">{t("Business")}</h3>
              <h4 className="package__usages-business none">
                5 {t("uses(s)")} / {t("day")}
              </h4>
              <h4 className="package__price-business">
                $<span>225 </span>usd
              </h4>
              <h4 className="package__newprice-business none">
                $<span>45</span> usd / <span id="month none">{t("Month")}</span>
              </h4>
              <button
                onClick={() => handleClick()}
                className="package__button-bussines none"
              >
                {t("purch")}
                <span>{t("ase")}</span>
              </button>
            </div>
          </div>
        </section>

        <section className="footer">
        <div className="footer__container">
          <h3 className="footer__logo">MarkComb,2024</h3>
          <Link id="Terms" to="/terms" className="footer__terms none">
            {t("Terms of service")}
          </Link>
          <Link to="/purpose" className="footer__purpose none">
            {t("Our purpose")}
          </Link>
          <Link to="/dataprocessing" className="footer__purpose none">
            {t("Personal Data Processing Agreement")}
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
                console.log(i18n)
                i18n.changeLanguage("en");
              });
            }}
            className="footer__button"
          >
            English
          </button>
        </div>
      </section>
      </HelmetProvider>
    </>
  );
};
export default Purchase;
