import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState, useEffect , useRef } from "react";
import React from "react";

import Request from "../../requests/Requests";
import SimilarChannel from "../../requests/SimilarChannel";

import "./Header&Filter.css";

import Loading from "../../images/loading-gif.gif";
import FilterBtnImg from "../../icons/filters.png";
import SearchBtn from "../../icons/magnifing_glass.png";

const HeaderFilter = ({setChannelData,setSimilarChannelData,setIsLoggedIn,isLoggedIn,}) => {
  const request = new Request();
  const similarChannel = new SimilarChannel();

  const { t } = useTranslation();

  // const searchRef = useRef(null);
  // const imgRef = useRef(null);
  // const modalRef = useRef(null);
  // const inputRef = useRef(null);
  // const filtersRef = useRef(null);
  // const openFiltersRef = useRef(null)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    balance: 0,
    uses: 0,
  });
  const [isChecked, setIsChecked] = useState(false);

  const handleSimilarSearchClick = async (
    theme = "",
    Audience = "",
    subsQuantity = 0,
    offset = 0
  ) => {
    try {
      if (!isLoggedIn) {
        alert("Firstly,you need to Log in or Register");
        return;
      }

      const promises = [];
      if (theme !== "") {
        promises.push(similarChannel.searchByContentType(theme));
      }
      if (Audience !== "") {
        promises.push(similarChannel.searchContentByTargetAudience(Audience));
      }

      if (subsQuantity > 0 && offset > 0) {
        promises.push(
          similarChannel.searchContentBySubsQuantity(subsQuantity, offset)
        );
      }

      const results = await Promise.all(promises);

      let finalData = {};
      if (theme) {
        finalData = { ...finalData, ...(results[0] || {}) };
      }
      if (Audience) {
        const audienceDataIndex = theme ? 1 : 0;
        finalData = { ...finalData, ...(results[audienceDataIndex] || {}) };
      }

      if (subsQuantity && offset) {
        const quantityDataIndex = theme && Audience ? 2 : 0;
        finalData = { ...finalData, ...(results[quantityDataIndex] || {}) };
      }

      if (Object.keys(finalData).length > 0) {
        setSimilarChannelData(finalData);
      }
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };

  let loadingTimer;
  const setLoading = (selector) => {
    const element = document.querySelector(`.${selector}`); // Ищем элемент по классу
    if (element) {
      const img = element.querySelector("img"); // Находим вложенное изображение
      if (img) {
        img.src = Loading; // Указываем путь к GIF
        loadingTimer = setTimeout(() => {
          img.src = SearchBtn;
        }, 500);
      }
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const modal = document.querySelector(".modal"),
    input = document.querySelector(".modal__input");
  let failTimeout, elseFailTimeout, closeTimeout, openTimeout;

  const validateFormData = (e) => {
    if (
      formData.email === "" ||
      !isChecked ||
      !emailRegex.test(formData.email) ||
      !formData.password
    ) {
      setIsLoggedIn(false);
      e.preventDefault();
      input.placeholder = "Please, fill the field and checkbox";
      input.classList.add("placeholder__fail");
      failTimeout = setTimeout(() => {
        input.classList.remove("placeholder__fail");
        input.placeholder = "email";
      }, 2000);
    } else {
      setIsLoggedIn(true);
      modal.style.opacity = "0";
      elseFailTimeout = setTimeout(() => {
        modal.style.display = "none";
      }, 200);
      document.body.style.overflow = "";
      input.value = "";
    }
  };

  const closeModal = () => {
    modal.style.opacity = "0";
    closeTimeout = setTimeout(() => {
      modal.style.display = "none";
    }, 200);
    document.body.style.overflow = "";
    input.value = "";
  };

  const openModal = () => {
    modal.style.opacity = "0.5";
    openTimeout = setTimeout(() => {
      modal.style.opacity = "1";
    }, 20);
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  };

  const openFilters = () => {
    const filters = document.querySelector(".filters");
    if (filters) {
      filters.classList.toggle("active");
    } else {
      console.error("Элемент 'filters' не найден");
    }
  };
  useEffect(() => {
    const FilterBtn = document.querySelectorAll(".filter__block");

    FilterBtn.forEach((button) => {
      button.addEventListener("click", () => {
        FilterBtn.forEach((btn) => btn.classList.remove("filteractive"));
        button.classList.add("filteractive");
      });
    });

    const triggerBtn = document.querySelector(".search__filters");

    if (!triggerBtn) {
      console.error("Элемент 'triggerBtn' не найден");
      return;
    }
    return () => {
      FilterBtn.forEach((button) => {
        button.removeEventListener("click", () => {});
      });
    };
  }, []);

  return (
    <>
      <header>
        <div className="container">
          <div className="logo">
            M<span>K</span>
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

      <section className="login">
        <a onClick={openModal} href="#" className="log__in">
          {t("Log in")} /
        </a>
        <a href="#" className="sign__in">
          {t("Sign in")}
        </a>
      </section>

      <section className="search">
        <div className="container">
          <form
            className="maininput"
            onSubmit={(e) =>
              isLoggedIn
                ? request.handleSearch(e, setChannelData)
                : alert("Firstly,you need to log in")
            }
          >
            <input className="search__main" type="text" />
            <div className="buttons">
              <button
                onClick={openFilters}
                type="button"
                className="search__filters"
              >
                <img src={FilterBtnImg} alt="search_filters" />
              </button>
              <button
                onClick={() => {
                  setLoading("search__glass");
                }}
                type="submit"
                className="search__glass"
              >
                <img src={SearchBtn} alt="search_button" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="filters">
        <div className="container">
          <div className="target__audence">
            <h2 className="target-audence__title text">
              {t("target")}
              <span> {t("audience")}</span>
            </h2>
            <div className="target-audence__blocks">
              <div
                className="filter__block"
                onClick={() => handleSimilarSearchClick("", "Kids")}
              >
                {t("Kids")}
              </div>
              <div
                className="filter__block"
                onClick={() => handleSimilarSearchClick("", "Teenagers")}
              >
                {t("Teenagers")}
              </div>
              <div
                id="youth"
                className="filter__block"
                onClick={() => handleSimilarSearchClick("", "Youth")}
              >
                {t("Youth")}
              </div>
              <div
                id="adults"
                className="filter__block"
                onClick={() => handleSimilarSearchClick("", "Adults")}
              >
                {t("Adults")}
              </div>
              <div
                id="older"
                className="filter__block"
                onClick={() => handleSimilarSearchClick("", "OlderGeneration")}
              >
                {t("Older generation")}
              </div>
            </div>
          </div>

          <div className="number__of__subs">
            <h2 className="target-audence__title">
              {t("number of")}
              <span> {t("subscribers")}</span>
            </h2>
            <div className="number__ofsubs__blocks">
              <div
                onClick={() => handleSimilarSearchClick("", "", 1000, 0)}
                id="low"
                className="filter__block"
              >
                0-1K
              </div>
              <div
                onClick={() => handleSimilarSearchClick("", "", 10000, 1000)}
                id="lowplus"
                className="filter__block"
              >
                1-10K
              </div>
              <div
                onClick={() => handleSimilarSearchClick("", "", 100000, 10000)}
                id="medium"
                className="filter__block"
              >
                10-100K
              </div>
              <div
                onClick={() => handleSimilarSearchClick("", "", 500000, 100000)}
                id="mediumplus"
                className="filter__block"
              >
                100-500K
              </div>
              <div
                onClick={() =>
                  handleSimilarSearchClick("", "", 5000000, 1000000)
                }
                id="hi"
                className="filter__block"
              >
                1-5M
              </div>
              <div
                onClick={() =>
                  handleSimilarSearchClick("", "", 10000000, 5000000)
                }
                id="hiplus"
                className="filter__block"
              >
                5-10M
              </div>
              <div
                onClick={() =>
                  handleSimilarSearchClick("", "", 20000000, 10000000)
                }
                id="highest"
                className="filter__block"
              >
                10M-20M
              </div>
            </div>
          </div>

          <div className="content__type">
            <h2 className="target-audence__title">
              {t("content")}
              <span> {t("type")}</span>
            </h2>
            <div className="content__type__blocks">
              <div
                className="filter__block"
                onClick={() => handleSimilarSearchClick("Comedy")}
              >
                {t("Comedy")}
              </div>
              <div
                className="filter__block"
                onClick={() => handleSimilarSearchClick("Entertainment")}
                data-id="24"
              >
                {t("Entertainment")}
              </div>
              <div
                className="filter__block"
                onClick={() => handleSimilarSearchClick("News&Commentary")}
                data-id="25"
              >
                {t("News&Commentary")}
              </div>
              <div
                className="filter__block"
                onClick={() => handleSimilarSearchClick("Vlogs")}
                data-id="21"
              >
                {t("Vlogs")}
              </div>
              <div
                className="filter__block"
                onClick={() => handleSimilarSearchClick("Fitness&Health")}
                data-id="17"
              >
                {t("Fitness&Health")}
              </div>
              <div
                className="filter__block"
                onClick={() => handleSimilarSearchClick("gaming")}
                data-id="20"
              >
                {t("Gaming")}
              </div>
              <div
                className="filter__block"
                onClick={() => handleSimilarSearchClick("Animation")}
                data-id="1"
              >
                {t("Animation")}
              </div>
              <div
                className="filter__block"
                onClick={() => handleSimilarSearchClick("Music")}
                data-id="10"
              >
                {t("Music")}
              </div>
              <div
                className="filter__block"
                onClick={() => handleSimilarSearchClick("Travel")}
                data-id="19"
              >
                {t("Travel")}
              </div>
              <div
                className="filter__block"
                onClick={() => handleSimilarSearchClick("Education")}
                data-id="27"
              >
                {t("Education")}
              </div>
            </div>
          </div>
        </div>
        <hr className="filter__divider" />
      </section>

      <section className="modal">
        <div className="container">
          <div className="modal__overlay">
            <button onClick={closeModal} className="modal__close">
              X
            </button>
            <div className="modal__block">
              <h2 className="modal__title">{t("Welcome")}</h2>
              <input
                required
                name="email"
                type="email"
                maxLength={255}
                placeholder={t("email")}
                className="modal__input"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                required
                name="password"
                type="text"
                maxLength={255}
                placeholder={t("password")}
                className="modal__input"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                onClick={validateFormData}
                type="submit"
                className="modal__button"
              >
                {t("Continue")}
              </button>
              <input
                className="modal__checkbox"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <h3 className="modal-checkbox__text">
                {t("I have read the")}{" "}
                <Link to="/terms">{t("user agreement")}</Link>{" "}
                {t("and accept all its terms and conditions")}
              </h3>
              <div className="modal-other__buttons">
                <h3 className="modal-other__title">
                  {t("Don’t have an account?")}
                </h3>
                <Link to="/profile" href="#" className="modal-other__button">
                  {t("Register")}
                </Link>
              </div>
              <div className="modal-continue__buttons">
                <button className="modal-continue__button">
                  <img src="./icons/Google.png" alt="google" />
                  <a className="modal-continue__text" href="#">
                    {t("Continue with")} Google
                  </a>
                </button>

                <button className="modal-continue__button">
                  <img src="./icons/Microsoft.png" alt="microsoft" />
                  <a className="modal-continue__text" href="#">
                    {t("Continue with")} Microsoft
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeaderFilter;
