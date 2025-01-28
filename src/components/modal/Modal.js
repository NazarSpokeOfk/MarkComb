import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import GoogleLoginButton from "../googleLogInButton/GoogleLogInButton";

import DataToDB from "../../dataToDB/dataToDB";
import ReCAPTCHA from "react-google-recaptcha";


import "./Modal.css";

const Modal = ({
  setIsLoggedIn,
  setUserData,
  isModalOpened,
  setIsModalOpened,
  entryMethod,
  setIsDataFilledIn,
  logInData,
  setLogInData,
  signInData,
  setSignInData,
  setCsrfToken
}) => {
  useEffect(() => {
    console.log("entryMethod", entryMethod);
  }, [isModalOpened]);
  const { t } = useTranslation();

  const [isChecked, setIsChecked] = useState(false);

  const modalRef = useRef(null);

  const dataToDB = new DataToDB(setIsLoggedIn, setUserData, setIsModalOpened , setCsrfToken);
  

  const handleRecaptchaChange = (value) => {
    setSignInData((prevData) => ({ ...prevData, recaptchaValue: value }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const modalBtn = document.querySelector(".modal__button");
  let failTimeout;

  const handleLogIn = (e) => {
    if (!logInData.email || !logInData.password) {
      setIsLoggedIn(false);
      e.preventDefault();
      modalBtn.classList.add("shake-animation");
      failTimeout = setTimeout(() => {
        modalBtn.classList.remove("shake-animation");
      }, 4000);
    } else {
      dataToDB.validateLogIn(logInData).then(() => {
        modalRef.current.classList.remove("open");
        setTimeout(() => {
          setIsModalOpened(false);

        }, 600);
      });
    }
  };

  const validateFormData = async (e) => {
    if (
      signInData.email === "" ||
      !isChecked ||
      !emailRegex.test(signInData.email) ||
      !signInData.password ||
      !signInData.username ||
      !signInData.recaptchaValue
    ) {
      setIsLoggedIn(false);
      e.preventDefault();
      modalBtn.classList.add("shake-animation");
      failTimeout = setTimeout(() => {
        modalBtn.classList.remove("shake-animation");
      }, 4000);
    } else {
      modalRef.current.classList.remove("open");
      setTimeout(() => {
        setIsModalOpened(false);
        setIsDataFilledIn(true);
      }, 600);
    }
  };

  useEffect(() => {
    if (isModalOpened) {
      setTimeout(() => {
        modalRef.current.classList.add("open");
      }, 10);
    } else {
      modalRef.current.classList.remove("open");
    }
  }, [isModalOpened]);

  return (
    <section className={`modal ${isModalOpened  ? "active" : ""}`}>
      <div ref={modalRef} className="modal__overlay">
        <button
          onClick={() => {
            modalRef.current.classList.remove("open");
            setTimeout(() => {
              setIsModalOpened(false);
            }, 600);
          }}
          className="modal__close"
        >
          X
        </button>
        <div className="modal__block">
          <h2 className="modal__title">
            {entryMethod == "logIn" ? t("Welcome back") : t("Welcome")}
          </h2>
          <input
            required
            name="email"
            type="email"
            maxLength={255}
            placeholder={t("email")}
            className="modal__input"
            value={entryMethod === "logIn" ? logInData.email : signInData.email}
            onChange={(e) => {
              const { value } = e.target;
              if (entryMethod === "logIn") {
                setLogInData((prevData) => ({ ...prevData, email: value }));
              } else {
                setSignInData((prevData) => ({ ...prevData, email: value }));
              }
            }}
          />
          {entryMethod == "logIn" ? null : (
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
            value={
              entryMethod == "logIn" ? logInData.password : signInData.password
            }
            onChange={(e) => {
              const { value } = e.target;
              if (entryMethod === "logIn") {
                setLogInData((prevData) => ({
                  ...prevData,
                  password: value,
                }));
              } else {
                setSignInData((prevData) => ({
                  ...prevData,
                  password: value,
                }));
              }
            }}
          />

          <button
            onClick={(e) => {
              entryMethod == "logIn" ? handleLogIn(e) : validateFormData(e);
            }}
            type="submit"
            className="modal__button"
          >
            {t("Continue")}
          </button>
          {entryMethod === "logIn" ? (
            ""
          ) : (
            <input
              className="modal__checkbox"
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
          )}
          <ReCAPTCHA
            className="captcha"
            sitekey="6LcxnbQqAAAAALV-GfKKoJPxRVIshbTjTa5izOVr"
            onChange={handleRecaptchaChange}
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
          {entryMethod === "logIn" ? (
            <div className="modal-continue__buttons">
              <button type="submit" className="modal-continue__button">
                <GoogleLoginButton 
                  setIsModalOpened = {setIsModalOpened}
                  setIsLoggedIn={setIsLoggedIn}
                  setUserData={setUserData}
                />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Modal;
