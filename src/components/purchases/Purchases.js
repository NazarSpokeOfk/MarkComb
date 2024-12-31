import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import "./Purchases.css";
import SmoothEffect from "../smoothText";

import binBtn from "../../icons/bin.svg"
import youtuberPic from "../../images/image 65.jpg"

const Puchases = () => {

  const {t, i18n} = useTranslation()

  const changeLanguage = (lang) => {
      i18n.changeLanguage(lang)
  }
  useEffect(() => {
    //Переписать
    const block = document.querySelector("#second"),
      binButton = document.querySelector("#second_btn");

    let timer;

    binButton.addEventListener("click", () => {
      block.classList.add("unactive");
    });

    const title = document.querySelectorAll(".title");

    title.forEach((title) => {
      timer = setInterval(() => {
        title.classList.add("active");
      }, 50);
    });

    return () => {
      clearTimeout(timer);

      binButton.removeEventListener("click", () => {
        block.classList.add("unactive");
      });
    };
  }, []);
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

      <section className="recent">
        <div className="container">
          <h2 className="title none">
              {t('rec')}<span>{t('ent')}</span>
          </h2>
          <div className="recent__block">
            <h3 className="recent-block__name">Риса за творчество</h3>
            <h3 className="recent-block__email">
              em<span>ail</span> : example
            </h3>
            <button className="recent-block__bin">
              <img src={binBtn}alt="bin" className="bin" />
            </button>
            <img
              src={youtuberPic}
              alt="youtuber picture"
              className="recent-block__thumbnail"
            />
          </div>

          <h2 className="title none">
              {t('ot')}<span>{t('her')}</span>
          </h2>
          <div className="recent__block">
            <h3 className="recent-block__name">Риса за творчество</h3>
            <h3 className="recent-block__email">
              em<span>ail</span> : example
            </h3>
            <button className="recent-block__bin">
            <img src={binBtn} alt="bin" className="bin" />
            </button>
            <img
              src={youtuberPic}
              alt="youtuber picture"
              className="recent-block__thumbnail"
            />
          </div>

          <div id="second" className="recent__block">
            <h3 className="recent-block__name">Риса за творчество</h3>
            <h3 className="recent-block__email">
              em<span>ail</span> : example
            </h3>
            <button id="second_btn" className="recent-block__bin">
              <img src={binBtn} alt="bin" className="bin" />
            </button>
            <img
              src={youtuberPic}
              alt="youtuber picture"
              className="recent-block__thumbnail"
            />
          </div>
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
export default Puchases;
