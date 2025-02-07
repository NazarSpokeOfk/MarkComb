import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { ToastContainer, toast } from "react-toastify";

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
  userData,
  setCsrfToken,
  csrfToken,
  userLang,
}) => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isDataFilledIn, setIsDataFilledIn] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [entryMethod, setEntryMethod] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [contentActiveIndex, setContentActiveIndex] = useState(null);
  const [mainInputValue, setMainInputValue] = useState("");

  const audienceButtonLabels = [
    "Kids",
    "Youth",
    "Adults",
    "Teenagers",
    "Older Generation",
  ];
  const contentButtonLabels = [
    "Comedy",
    "Vlogs",
    "Animation",
    "Education",
    "Entertaiment",
    "FitnessHealth",
    "Music",
    "NewsCommentary",
    "Gaming",
    "Travel",
  ];

  const filterRef = useRef();

  const { t } = useTranslation();

  const logInErrorToast = () => {
    toast.error("Firstly,create or log in to existing account");
  };
  const searchFetch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/search", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ mainInputValue }),
      });
      const result = await response.json();
      setChannelData(result);
      setIsSearching(false);
      console.log(isSearching);
    } catch (error) {
      console.log("Ошибка в searchFetch:", error);
    }
  };

  const filterFetch = async (
    type,
    theme,
    Audience,
    subsQuantity,
    offset,
    lang
  ) => {
    try {
      const bodyData = {};

      if (theme && lang) {
        bodyData.theme = theme;
        bodyData.lang = lang;
      }

      if (Audience) {
        bodyData.Audience = Audience;
      }

      if (subsQuantity && offset) {
        console.log("offset:", offset);
        bodyData.subsQuantity = subsQuantity;
        bodyData.offset = offset;
      }

      console.log("Body data:", bodyData);

      console.log("Отправляемые данные:", JSON.stringify(bodyData));
      const response = await fetch(`http://localhost:5001/api/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ bodyData }),
      });

      const result = await response.json();
      console.log("Ответ от сервера:", result);
      if(result?.status === false){
        toast.error("Unfortunantly,there is no matching channels.Tre again little bit later.")
      } else {
        setSimilarChannelData(result.updatedData?.[0]);
      }
    } catch (error) {
      console.log("Ошибка в filterFetch:", error);
    }
  };

  // const handleSimilarSearchClick = async (
  //   theme,
  //   Audience,
  //   subsQuantity,
  //   offset,
  //   lang
  // ) => {
  //   try {
  //     if (!isLoggedIn) {
  //       logInErrorToast();
  //       return;
  //     }

  //     const promises = [];
  //     if (theme !== "") {
  //       filterFetch("content-type", theme,false,false,false,lang); // promises.push(similarChannel.searchByContentType(theme, lang));
  //     }
  //     if (Audience !== "") {
  //       filterFetch("audience",false,Audience,false,false,false); // promises.push(similarChannel.searchContentByTargetAudience(Audience));
  //     }

  //     if (subsQuantity > 0 && offset > 0) {
  //       promises.push(
  //         filterFetch("subscribers",false,false,subsQuantity,offset,userLang) // similarChannel.searchContentBySubsQuantity(subsQuantity, offset)
  //       );
  //     }

  //     const results = await Promise.all(promises);

  //     let finalData = {};
  //     if (theme) {
  //       finalData = { ...finalData, ...(results[0] || {}) };
  //     }
  //     if (Audience) {
  //       const audienceDataIndex = theme ? 1 : 0;
  //       finalData = { ...finalData, ...(results[audienceDataIndex] || {}) };
  //     }

  //     if (subsQuantity && offset) {
  //       const quantityDataIndex = theme && Audience ? 2 : 0;
  //       finalData = { ...finalData, ...(results[quantityDataIndex] || {}) };
  //     }

  //     if (Object.keys(finalData).length > 0) {
  //       setSimilarChannelData(finalData);
  //     }
  //   } catch (error) {
  //     console.error("Ошибка при получении данных:", error);
  //   }
  // };

  const openFilters = () => {
    filterRef.current.classList.toggle("active");
  };

  useEffect(() => {
    checkCookies(setIsLoggedIn, setUserData);
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
              Mark<span>Comb</span>
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
          {isLoggedIn ? (
            <Link className="profile__name" to={"/profile"}>
              {userData?.user?.username}
            </Link>
          ) : null}{" "}
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
              value={mainInputValue}
              onChange={(e) => {
                const { value } = e.target;
                setMainInputValue(value);
              }}
              onSubmit={(e) => {
                e.preventDefault();
                isLoggedIn
                  ? searchFetch(e)
                  : toast.warn("Firstly,you need to log in.");
              }}
            >
              {/* request.handleSearch(mainInputState, setChannelData, setIsSearching) */}
              <input className="search__main" type="text" />
              <div className="buttons">
                <button
                  onClick={openFilters}
                  type="button"
                  className="search__filters"
                >
                  <img src={FilterBtnImg} loading="lazy" alt="search_filters" />
                </button>
                <button
                  onClick={() => {
                    setIsSearching(true);
                  }}
                  type="submit"
                  className="search__glass"
                >
                  <img
                    src={isSearching ? Loading : SearchBtn}
                    alt="search_button"
                    loading="lazy"
                  />
                </button>
              </div>
            </form>
          </div>
        </section>

        <section ref={filterRef} className="filters">
          <div className="container">
            <div className="target__audence">
              <h2 className="target-audence__title text">
                {t("target")}
                <span> {t("audience")}</span>
              </h2>
              <div className="target-audence__blocks">
                {audienceButtonLabels.map((label, index) => (
                  <button
                    key={index}
                    className={`filter__block ${
                      contentActiveIndex === index ? "filteractive" : ""
                    }`}
                    onClick={() => {
                      setContentActiveIndex(index);
                      filterFetch(
                        "audience",
                        false,
                        label,
                        false,
                        false,
                        false
                      );
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="number__of__subs">
              <h2 className="target-audence__title">
                {t("number of")}
                <span> {t("subscribers")}</span>
              </h2>
              <div className="number__ofsubs__blocks">
                <div
                  onClick={() => filterFetch("subscribers", false,false, 1000, 0, false)}
                  id="low"
                  className="filter__block"
                >
                  <ToastContainer />
                  0-1K
                </div>
                <div
                  onClick={() =>
                    filterFetch("subscribers", false,false, 10000, 1000, false)
                  }
                  id="lowplus"
                  className="filter__block"
                >
                  <ToastContainer />
                  1-10K
                </div>
                <div
                  onClick={() =>
                    filterFetch("subscribers", false,false, 100000, 10000, false)
                  }
                  id="medium"
                  className="filter__block"
                >
                  <ToastContainer />
                  10-100K
                </div>
                <div
                  onClick={() =>
                    filterFetch("subscribers", false , false, 500000, 100000, false)
                  }
                  id="mediumplus"
                  className="filter__block"
                >
                  <ToastContainer />
                  100-500K
                </div>
                <div
                  onClick={() =>
                    filterFetch(
                      "subscribers",
                      false,
                      false,
                      1000000,
                      5000000,
                      false
                    )
                  }
                  id="hi"
                  className="filter__block"
                >
                  <ToastContainer />
                  1-5M
                </div>
                <div
                  onClick={() =>
                    filterFetch("subscribers", false,false, 10000000, 5000000, false)
                  }
                  id="hiplus"
                  className="filter__block"
                >
                  <ToastContainer />
                  5-10M
                </div>
                <div
                  onClick={() =>
                    filterFetch("subscribers", false,false, 20000000, 10000000, false)
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
                {contentButtonLabels.map((label, index) => (
                  <button
                    key={index}
                    className={`filter__block ${
                      activeIndex === index ? "filteractive" : ""
                    }`}
                    onClick={() => {
                      setActiveIndex(index);
                      filterFetch(
                        "content-type",
                        label,
                        false,
                        false,
                        false,
                        userLang
                      );
                    }}
                  >
                    {label}
                  </button>
                ))}
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
            setCsrfToken={setCsrfToken}
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
        <ToastContainer />
      </HelmetProvider>
    </>
  );
};

export default HeaderFilter;
