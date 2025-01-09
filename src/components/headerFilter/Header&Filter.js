import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import { ToastContainer , toast } from "react-toastify";

import DataToDB from "../../dataToDB/dataToDB";
import Request from "../../requests/Requests";
import SimilarChannel from "../../requests/SimilarChannel";

import "./Header&Filter.css";
import "react-toastify/dist/ReactToastify.css";

import microsoftImage from "../../images/Microsoft.png"
import googleImage from "../../images/Google.png"
import Loading from "../../images/loading-gif.gif";
import FilterBtnImg from "../../icons/filters.png";
import SearchBtn from "../../icons/magnifing_glass.png";

const HeaderFilter = ({setChannelData,setSimilarChannelData,setIsLoggedIn,isLoggedIn,setUserData}) => {

  
  const dataToDB = new DataToDB(setIsLoggedIn,setUserData);

  const request = new Request();
  const similarChannel = new SimilarChannel();

  const { t } = useTranslation();

  const [entryMethod,setEntryMethod] = useState('')

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [logInData, setLogInData] = useState({
    email: "",
    password: "",
  });
  

  const [isChecked, setIsChecked] = useState(false);


  const logInErrorToast = () => {
    toast.error("Firstly,create or log in to existing account")
  }

  const handleSimilarSearchClick = async (theme = "",Audience = "",subsQuantity = 0,offset = 0) => {
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
    input = document.querySelector(".modal__input"),
    modalBtn = document.querySelector(".modal__button")
  let failTimeout, elseFailTimeout, closeTimeout, openTimeout;

  const handleLogIn = (e) => {
    if(!logInData.email || !logInData.password){
      setIsLoggedIn(false);
      e.preventDefault();
      modalBtn.classList.add("shake-animation")
      failTimeout = setTimeout(() => {
        modalBtn.classList.remove("shake-animation");
      }, 4000);
    } else {dataToDB.validateLogIn(logInData,closeModal)}
  }
  const validateFormData = async (e) => {
    if (
      signInData.email === "" ||
      !isChecked ||
      !emailRegex.test(signInData.email) ||
      !signInData.password ||
      !signInData.username
    ) {
      
      setIsLoggedIn(false);
      e.preventDefault();
      modalBtn.classList.add("shake-animation")
      failTimeout = setTimeout(() => {
        modalBtn.classList.remove("shake-animation");
      }, 4000);

    } else {
      try {

        const response = await fetch("http://localhost:5001/api/user", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(signInData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Пользователь создан", result);

          setIsLoggedIn(true);
          setUserData(result)
          modal.style.opacity = "0";
          elseFailTimeout = setTimeout(() => {
            modal.style.display = "none";
          }, 200);
          document.body.style.overflow = "";
          input.value = "";
        } 
        else {
          setIsLoggedIn(false);
          console.log("Ошибка при создании пользователя.");
        }
      } catch (error) {
        console.log("Возникла ошибка при регистрации.", error);
      }
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

      <section className="login"> {
        isLoggedIn ? 
        <a onClick={() => {
          setUserData("")
          setIsLoggedIn(false)
        } }
          href="#" className="log__in">
          {t("Log out")}
        </a> 
        : (
          <><a onClick={() => {
            setEntryMethod('logIn');
            openModal();
          } }
            href="#" className="log__in">
            {t("Log in")} /
          </a><a onClick={() => {
            setEntryMethod('SignIn');
            openModal();
          } }
            href="#" className="sign__in">
              {t("Sign in")}
            </a></>
        )
        }
      </section>

      <section className="search">
        <div className="container">
          <form
            className="maininput"
            onSubmit={(e) => 
              isLoggedIn ? request.handleSearch(e, setChannelData) : alert("Firstly,you need to log in")
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
                onClick={() => handleSimilarSearchClick("", "OlderGeneration")}
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
                onClick={() => handleSimilarSearchClick("", "", 100000, 10000)}
                id="medium"
                className="filter__block"
              >
                <ToastContainer />
                10-100K
              </div>
              <div
                onClick={() => handleSimilarSearchClick("", "", 500000, 100000)}
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

      <section className="modal">
          <div className="modal__overlay">
            <button onClick={closeModal} className="modal__close">
              X
            </button>
            <div className="modal__block">
              <h2 className="modal__title">{entryMethod == "logIn" ? t("Welcome back") : t("Welcome.")}</h2>
              <input
                required
                name="email"
                type="email"
                maxLength={255}
                placeholder={t("email")}
                className="modal__input"
                value={ entryMethod === "logIn" ? logInData.email : signInData.email}
                onChange={(e) => {
                  const {value} = e.target;
                  if(entryMethod === "logIn"){
                    setLogInData((prevData) => ({ ...prevData, email: value }));
                  } else {
                    setSignInData((prevData) => ({ ...prevData, email: value }));
                  }
                }}
              />
              {
                entryMethod == "logIn" ? null : (
                  <input
                required
                name="username"
                type="text"
                maxLength={50}
                placeholder={t("username")}
                className="modal__input"
                value={signInData.username}
                onChange={(e) =>
                  setSignInData({ ...signInData, username: e.target.value })
                }
                  />
              )}

              <input
                required
                name="password"
                type="text"
                maxLength={255}
                placeholder={t("password")}
                className="modal__input"
                value={ entryMethod == "logIn" ? logInData.password : signInData.password}
                onChange={(e) => {
                  const {value} = e.target;
                  if(entryMethod === "logIn"){
                    setLogInData((prevData) => ({...prevData , password : value}))
                  } else {
                    setSignInData((prevData) => ({...prevData,password : value}))
                  }
                }}
              />
              <button
                onClick={(e) => { entryMethod == "logIn" ? handleLogIn(e) : validateFormData(e)}}
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
                  <img src={googleImage} alt="google" />
                  <a className="modal-continue__text" href="#">
                    {t("Continue with")} Google
                  </a>
                </button>

                <button className="modal-continue__button">
                  <img src={microsoftImage} alt="microsoft" />
                  <a className="modal-continue__text" href="#">
                    {t("Continue with")} Microsoft
                  </a>
                </button>
              </div>
            </div>
          </div>
      </section>
    </>
  );
};

export default HeaderFilter;
