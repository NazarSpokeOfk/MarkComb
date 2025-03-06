import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { toast } from "react-toastify";

import Modal from "../modal/Modal";
import VerifModal from "../modal/VerifModal";
import VerifCode from "../modal/verifCode";
import NewPassword from "../modal/newPassword";

import checkCookies from "../../checkCookies/checkCookies";
import manageFiltersFetch from "../../filtersRequests/filterFetches";


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
  setUserCountry,
  setUserLang,
}) => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isDataFilledIn, setIsDataFilledIn] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [entryMethod, setEntryMethod] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [contentActiveIndex, setContentActiveIndex] = useState(null);
  const [subsActiveIndex,setSubsActiveIndex] = useState(null)
  const [mainInputValue, setMainInputValue] = useState("");
  const [isPasswordWillBeReset,setIsPasswordWillBeReset] = useState(false)
  const [isVerificationCodeCorrect , setIsVerificationCodeCorrect] = useState(null)
  
  const audienceButtonLabels = [
    "Kids",
    "Adults",
    "Teenagers",
    "OlderGen",
  ];
  const contentButtonLabels = [
    "Comedy",
    "Vlogs",
    "Animation",
    "Education",
    "Entertaiment",
    "Fitness",
    "Health",
    "Music",
    "News",
    "Gaming",
    "Travel",
  ];
  const subscribersButtonLabels = {
    "0-1K" : [0,1000],
    "1-10K" : [1000,10000],
    "10-100K" : [10000,100000],
    "100-500K" : [100000,500000],
    "1-5M" : [1000000,5000000],
    "5-10M" : [5000000,10000000],
    "10-20M" : [10000000,20000000]
  }

  useEffect(() => {
    console.log("Будет ли смененен : " , isPasswordWillBeReset)
  },[isPasswordWillBeReset])

  const filterRef = useRef();
  

  const { t } = useTranslation();

  const logInFirstly = () => {
    toast.warn("Log in firstly")
  }

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

  const openFilters = () => {
    filterRef.current.classList.toggle("active");
  };

  useEffect(() => {
    checkCookies(setIsLoggedIn, setUserData, setUserLang);
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
                if(isLoggedIn){
                  searchFetch(e)
                } else {
                  logInFirstly()
                }
              }}
            >
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
                      if(isLoggedIn){
                        manageFiltersFetch(false,setSimilarChannelData,label,false,false)
                      } else {
                        logInFirstly();
                      } 
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
                {Object.entries(subscribersButtonLabels).map((label, index) => (
                  <button
                    key={index}
                    className={`filter__block ${
                      subsActiveIndex === index ? "filteractive" : ""
                    }`}
                    onClick={() => {
                      setSubsActiveIndex(index);
                       if(isLoggedIn){
                        manageFiltersFetch(false,setSimilarChannelData,false,label?.[1]?.[0],label?.[1]?.[1])
                       } else {
                        logInFirstly()
                       }
                    }} 
                  >
                    {label[0]}
                  </button>
                ))}
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
                       if(isLoggedIn){
                        manageFiltersFetch(label,setSimilarChannelData,false,false,false)
                       } else {
                        logInFirstly()
                       }
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
            setUserCountry={setUserCountry}
            setUserLang={setUserLang}
            setIsPasswordWillBeReset = {setIsPasswordWillBeReset}
          />
        ) : null}
        {isDataFilledIn ? (
          <VerifModal
            logInData = {logInData}
            isDataFilledIn={isDataFilledIn}
            setSignInData={setSignInData}
            signInData={signInData}
            setUserData={setUserData}
            setIsLoggedIn={setIsLoggedIn}
            isLoggedIn={isLoggedIn}
          />
        ) : null}

        {isPasswordWillBeReset ? (
          <VerifCode
          logInData = {logInData}
          isPasswordWillBeReset = {isPasswordWillBeReset}
          setIsPasswordWillBeReset={setIsPasswordWillBeReset}
          setIsVerificationCodeCorrect = {setIsVerificationCodeCorrect}
          />
        ) : null}

        {isVerificationCodeCorrect ? (
          <NewPassword
          email = {logInData.email}
          isVerificationCodeCorrect = {isVerificationCodeCorrect}
          setIsVerificationCodeCorrect={setIsVerificationCodeCorrect}
          />
        ) : null}

      </HelmetProvider>
    </>
  );
};

export default HeaderFilter;
