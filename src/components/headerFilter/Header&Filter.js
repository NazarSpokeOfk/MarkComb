import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { ToastContainer, toast } from "react-toastify";

import Request from "../../requests/Requests";
import SimilarChannel from "../../requests/SimilarChannel";
import Modal from "../modal/Modal";
import VerifModal from "../modal/VerifModal";
import checkCookies from "../../checkCookies/checkCookies";

import "./Header&Filter.css";
import "react-toastify/dist/ReactToastify.css";

import Loading from "../../images/loading-gif.gif";
import FilterBtnImg from "../../icons/filters.png";
import SearchBtn from "../../icons/magnifing_glass.png";

const HeaderFilter = ({
  setChannelData,
  setSimilarChannelData,
  setIsLoggedIn,
  isLoggedIn,
  setUserData,
  signInData,
  setSignInData,
  logInData,
  setLogInData,
}) => {
  const request = new Request();
  const similarChannel = new SimilarChannel();

  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isDataFilledIn, setIsDataFilledIn] = useState(false);

  const [entryMethod, setEntryMethod] = useState("");

  const { t } = useTranslation();

  const logInErrorToast = () => {
    toast.error("Firstly,create or log in to existing account");
  };

  const handleSimilarSearchClick = async (
    theme = "",
    Audience = "",
    subsQuantity = 0,
    offset = 0
  ) => {
    try {
      if (!isLoggedIn) {
        logInErrorToast();
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
    const element = document.querySelector(`.${selector}`);
    if (element) {
      const img = element.querySelector("img");
      if (img) {
        img.src = Loading;
        loadingTimer = setTimeout(() => {
          img.src = SearchBtn;
        }, 500);
      }
    }
  };

  const openFilters = () => {
    const filters = document.querySelector(".filters");
    if (filters) {
      filters.classList.toggle("active");
    } else {
      console.error("Элемент 'filters' не найден");
    }
  };

  useEffect(()=>{
    checkCookies(setIsLoggedIn,setUserData)
  },[])

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
      <HelmetProvider>
        <Helmet>
          <title>Main page</title>
          <meta name="description" content="Main page of the markcomb" />
        </Helmet>
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
          {" "}
          {isLoggedIn ? (
            <a
              onClick={() => {
                setUserData("");
                setIsLoggedIn(false);
              }}
              href="#"
              className="log__in"
            >
              {t("Log out")}
            </a>
          ) : (
            <>
              <a
                onClick={() => {
                  setEntryMethod("logIn");
                  setIsModalOpened(true);
                }}
                href="#"
                className="log__in"
              >
                {t("Log in")} /
              </a>
              <a
                onClick={() => {
                  setEntryMethod("SignIn");
                  setIsModalOpened(true);
                }}
                href="#"
                className="sign__in"
              >
                {t("Sign in")}
              </a>
            </>
          )}
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
                  <ToastContainer />
                  {t("Kids")}
                </div>
                <div
                  className="filter__block"
                  onClick={() => handleSimilarSearchClick("", "Teenagers")}
                >
                  <ToastContainer />
                  {t("Teenagers")}
                </div>
                <div
                  id="youth"
                  className="filter__block"
                  onClick={() => handleSimilarSearchClick("", "Youth")}
                >
                  <ToastContainer />
                  {t("Youth")}
                </div>
                <div
                  id="adults"
                  className="filter__block"
                  onClick={() => handleSimilarSearchClick("", "Adults")}
                >
                  <ToastContainer />
                  {t("Adults")}
                </div>
                <div
                  id="older"
                  className="filter__block"
                  onClick={() =>
                    handleSimilarSearchClick("", "OlderGeneration")
                  }
                >
                  <ToastContainer />
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
                  <ToastContainer />
                  0-1K
                </div>
                <div
                  onClick={() => handleSimilarSearchClick("", "", 10000, 1000)}
                  id="lowplus"
                  className="filter__block"
                >
                  <ToastContainer />
                  1-10K
                </div>
                <div
                  onClick={() =>
                    handleSimilarSearchClick("", "", 100000, 10000)
                  }
                  id="medium"
                  className="filter__block"
                >
                  <ToastContainer />
                  10-100K
                </div>
                <div
                  onClick={() =>
                    handleSimilarSearchClick("", "", 500000, 100000)
                  }
                  id="mediumplus"
                  className="filter__block"
                >
                  <ToastContainer />
                  100-500K
                </div>
                <div
                  onClick={() =>
                    handleSimilarSearchClick("", "", 5000000, 1000000)
                  }
                  id="hi"
                  className="filter__block"
                >
                  <ToastContainer />
                  1-5M
                </div>
                <div
                  onClick={() =>
                    handleSimilarSearchClick("", "", 10000000, 5000000)
                  }
                  id="hiplus"
                  className="filter__block"
                >
                  <ToastContainer />
                  5-10M
                </div>
                <div
                  onClick={() =>
                    handleSimilarSearchClick("", "", 20000000, 10000000)
                  }
                  id="highest"
                  className="filter__block"
                >
                  <ToastContainer />
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
                  <ToastContainer />
                  {t("Comedy")}
                </div>
                <div
                  className="filter__block"
                  onClick={() => handleSimilarSearchClick("Entertainment")}
                  data-id="24"
                >
                  <ToastContainer />
                  {t("Entertainment")}
                </div>
                <div
                  className="filter__block"
                  onClick={() => handleSimilarSearchClick("News&Commentary")}
                  data-id="25"
                >
                  <ToastContainer />
                  {t("News&Commentary")}
                </div>
                <div
                  className="filter__block"
                  onClick={() => handleSimilarSearchClick("Vlogs")}
                  data-id="21"
                >
                  <ToastContainer />
                  {t("Vlogs")}
                </div>
                <div
                  className="filter__block"
                  onClick={() => handleSimilarSearchClick("Fitness&Health")}
                  data-id="17"
                >
                  <ToastContainer />
                  {t("Fitness&Health")}
                </div>
                <div
                  className="filter__block"
                  onClick={() => handleSimilarSearchClick("gaming")}
                  data-id="20"
                >
                  <ToastContainer />
                  {t("Gaming")}
                </div>
                <div
                  className="filter__block"
                  onClick={() => handleSimilarSearchClick("Animation")}
                  data-id="1"
                >
                  <ToastContainer />
                  {t("Animation")}
                </div>
                <div
                  className="filter__block"
                  onClick={() => handleSimilarSearchClick("Music")}
                  data-id="10"
                >
                  <ToastContainer />
                  {t("Music")}
                </div>
                <div
                  className="filter__block"
                  onClick={() => handleSimilarSearchClick("Travel")}
                  data-id="19"
                >
                  <ToastContainer />
                  {t("Travel")}
                </div>
                <div
                  className="filter__block"
                  onClick={() => handleSimilarSearchClick("Education")}
                  data-id="27"
                >
                  <ToastContainer />
                  {t("Education")}
                </div>
              </div>
            </div>
          </div>
          <hr className="filter__divider" />
        </section>

        {isModalOpened ? (
          <Modal
            isModalOpened={isModalOpened}
            setIsModalOpened={setIsModalOpened}
            entryMethod={entryMethod}
            setIsLoggedIn={setIsLoggedIn}
            setUserData={setUserData}
            setIsDataFilledIn={setIsDataFilledIn}
            logInData={logInData}
            setLogInData={setLogInData}
            signInData={signInData}
            setSignInData={setSignInData}
          />
        ) : null}
        {isDataFilledIn ? (
          <VerifModal
            isDataFilledIn={isDataFilledIn}
            setSignInData={setSignInData}
            signInData={signInData}
            setUserData={setUserData}
            setIsLoggedIn={setIsLoggedIn}
            isLoggedIn={isLoggedIn}
          />
        ) : null}
      </HelmetProvider>
    </>
  );
};

export default HeaderFilter;
