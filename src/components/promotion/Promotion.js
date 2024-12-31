import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import "./Promotion.css";
import SmoothEffect from "../smoothText";

import videoPic from "../../images/VideoPic.png";
import buttonIcon from "../../icons/morefilters.png";
import glass from "../../icons/magnifing_glass.png";

const Promotion = (isLoggedIn) => {
  

  const {t, i18n} = useTranslation()

  const changeLanguage = (lang) => {
      i18n.changeLanguage(lang)
  }
  useEffect(() => {
    //Переписать
    let timer;

    const moreYoutubers = document.querySelector(".list__container__more");
    const triggerBtn = document.querySelector(".list-container__button");

    // Выносим обработчик в переменную
    const handleToggle = () => {
      moreYoutubers.classList.toggle("active");
      triggerBtn.classList.toggle("rotate");
    };

    // Добавляем обработчик
    triggerBtn.addEventListener("click", handleToggle);

    const titleElements = document.querySelectorAll(".title");
    titleElements.forEach((title) => {
      timer = setInterval(() => {
        title.classList.add("active");
      }, 50);
    });

    return () => {
      // Удаляем обработчик
      triggerBtn.removeEventListener("click", handleToggle);

      // Очищаем таймер
      clearInterval(timer);
    };
  }, []); // Добавьте [] в зависимости, чтобы useEffect срабатывал только один раз при монтировании

  return (
    <>
      <header>
        <div className="container">
          <div className="logo">
            <Link to="/">
              M<span>K</span>
            </Link>
          </div>
          <div className="header__links">

            <Link to="/purchases" className="header__link">
                {t('purc')}<span className="highlight">{t('hases')}</span>
            </Link>

            <Link to="/promotion" className="header__link">
                {t('prom')}<span>{t('otion')}</span>
            </Link>
            <Link to="/purchase" className="header__link">         
                {t('purch')}<span>{t('ase')}</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="list">
        <div className="container">
          <h1 className="title none">
              {t('li')}<span>{t('st')}</span>
          </h1>
          <div className="list__container">
            <h2 className="list-container__member">{isLoggedIn.isLoggedIn ? "Риса за творчество" : "Firstly,log in to your account"}</h2>
            <h2 className="list-container__member">{isLoggedIn.isLoggedIn ? "MrBeast" : ""}</h2>
            <h2 className="list-container__member">{isLoggedIn.isLoggedIn ? "A4" : ""}</h2>
            <h2 className="list-container__member">{isLoggedIn.isLoggedIn ? "Heronwater" : ""}</h2>
            <h2 className="list-container__member hidden">{isLoggedIn.isLoggedIn ? "Звездный капитан" : ""}</h2>
            <br />
          </div>

          <button className="list-container__button">
            <img src={buttonIcon} alt="moreyoutubers" />
          </button>

          <div className="list__container__more">
            <h2 className="list-container__member">{isLoggedIn.isLoggedIn ? "Риса за творчество" : ""}</h2>
            <h2 className="list-container__member">{isLoggedIn.isLoggedIn ? "MrBeast" : ""}</h2>
            <h2 className="list-container__member">{isLoggedIn.isLoggedIn ? "A4" : ""}</h2>
            <h2 className="list-container__member">{isLoggedIn.isLoggedIn ? "Heronwater" : ""}</h2>
            <h2 className="list-container__member hidden">{isLoggedIn.isLoggedIn ? "Звездный капитан" : ""}</h2>
            <br />
          </div>
        </div>
      </section>

      <section className="search">
        <input type="text" className="search__input" />
        <button className="search-input__button">
          <img src={glass} alt="find" />
        </button>
        <div className="search-suggested__block">
          <h2 className="suggested-block__name">
            ROCKET - Mansplain | Реакция и разбор
          </h2>
          <img
            src={videoPic}
            alt="video image"
            className="suggested-block__img"
          />
        </div>
      </section>

      <section className="footer">
        <div className="footer__container">
          <h3 className="footer__logo">MK,2024</h3>
          <Link to="/terms" className="footer__terms">
            {t('Terms of service')}
          </Link>
          <Link to="/purpose" className="footer__purpose">
          {t('Our purpose')}
          </Link>
          <button
            onClick={() => {
              SmoothEffect().then(() => {
                changeLanguage("ru");
              });
            }}
            className="footer__button"
          >
            Русский
          </button>
          <button
            onClick={() => {
              SmoothEffect().then(() => {
                changeLanguage("en");
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

export default Promotion;
