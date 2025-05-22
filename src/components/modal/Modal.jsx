import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import GoogleLoginButton from "../googleLogInButton/GoogleLogInButton";

import DataToDB from "../../dataToDB/dataToDB";
import ReCAPTCHA from "react-google-recaptcha";


import { toast } from "react-toastify";

import "./css/Modal.css";

import Cross from "../../icons/cross.png";

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
  setCsrfToken,
  setIsPasswordWillBeReset,
}) => {
  const { t } = useTranslation();

  const [isChecked, setIsChecked] = useState(false);
  const [isUserMakeAMistake, setIsUserMakeAMistake] = useState(0);

  useEffect(() => {
    console.log(`Пользователь совершил ошибку ${isUserMakeAMistake} раз.`);
  }, [isUserMakeAMistake]);

  const modalRef = useRef(null);

  const modalButtonRef = useRef(null);

  const dataToDB = new DataToDB(
    setIsLoggedIn,
    setUserData,
    setIsModalOpened,
    setCsrfToken
  );

  const handleRecaptchaChange = (value) => {
    setSignInData((prevData) => ({ ...prevData, recaptchaValue: value }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let failTimeout;

  const handleLogIn = (e) => {
    if (!logInData.email || !logInData.password) {
      setIsLoggedIn(false);
      e.preventDefault();
      modalButtonRef.current.classList.add("shake-animation");
      failTimeout = setTimeout(() => {
        modalButtonRef.current.classList.remove("shake-animation");
      }, 4000);
    } else {
      const loadToast = toast.loading("Recalling your profile...")
      dataToDB.validateLogIn(logInData).then((response) => {
        if (response.message === true) {
          toast.dismiss(loadToast)
          modalRef.current.classList.remove("open");
          setTimeout(() => {
            setIsModalOpened(false);
          }, 500);
          document.body.style.overflow = "";
        } else {
          toast.dismiss(loadToast)
          setTimeout(() => {
            setIsUserMakeAMistake((prevState) => prevState + 1);
            toast.error("Wrong password, or account doesn't exist");
          }, 100);
        }
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
      modalButtonRef.current.classList.add("shake-animation");
      failTimeout = setTimeout(() => {
        modalButtonRef.current.classList.remove("shake-animation");
      }, 4000);
    } else {
      modalRef.current.classList.remove("open");
      setTimeout(() => {
        setIsModalOpened(false);
        setIsDataFilledIn(true);
        document.body.style.overflow = "";
      }, 600);
    }
  };

  useEffect(() => {
    if (isModalOpened) {
      setTimeout(() => {
        modalRef.current.classList.add("open");
        document.body.style.overflow = "hidden";
      }, 10);
    } else {
      modalRef.current.classList.remove("open");
    }
  }, [isModalOpened]);

  return (
    <section className={`modal ${isModalOpened ? "active" : ""}`}>
      <div
        ref={modalRef}
        onClick={() => {
          modalRef.current.classList.remove("open");
          setTimeout(() => {
            document.body.style.overflow = "";
            setIsModalOpened(false);
          }, 300);
        }}
        className="modal__overlay"
      >
        <div onClick={(e) => e.stopPropagation()} className="modal__block">
          <button
            onClick={() => {
              modalRef.current.classList.remove("open");
              setTimeout(() => {
                setIsModalOpened(false);
              }, 600);
              document.body.style.overflow = "";
            }}
            className="modal__close"
          >
            <img className="modal__close-img" src={Cross} alt="close button" />
          </button>
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
              placeholder={t("username,3 characters min.")}
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
            placeholder={t("password,5 characters min.")}
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
            ref={modalButtonRef}
          >
            {t("con")}<span>{t("tinue")}</span>
          </button>

          {entryMethod === "logIn" ? (
            <>
              <a
                onClick={() => {
                  if (logInData.email && isUserMakeAMistake) {
                    setIsModalOpened(false);
                    setIsPasswordWillBeReset(true);
                  } else {
                    return 
                  }
                }}
                className={`modal__forgot-password hide ${
                  isUserMakeAMistake > 1 ? "show" : ""
                }`}
              >
                Forgot your <span>password</span>?
              </a>
            </>
          ) : null}

          {entryMethod === "logIn" ? (
            ""
          ) : (
            <input
              className="modal__checkbox"
              type="checkbox"
              required
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
          )}
          {entryMethod === "SignIn" ? (
            <ReCAPTCHA
              className="captcha"
              sitekey="6LcxnbQqAAAAALV-GfKKoJPxRVIshbTjTa5izOVr"
              onChange={handleRecaptchaChange}
              data-size="compact"
            />
          ) : null}
          {entryMethod === "SignIn" ? (
            <h3 className="modal-checkbox__text">
              {t("I have read the")}{" "}
              <Link to="/terms">{t("user agreement,")}</Link>{" "}{t("and ")}<Link to="/dataprocessing">{t("Personal Data Processing Agreement")}</Link>
               {t(" and accept all its terms and conditions")}
            </h3>
          ) : null}

          {entryMethod === "logIn" ? (
            <div className="modal-continue__buttons">
              <button type="submit" className="modal-continue__button">
                <GoogleLoginButton
                  setIsModalOpened={setIsModalOpened}
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
