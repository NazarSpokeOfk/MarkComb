import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import GoogleLoginButton from "../googleLogInButton/GoogleLogInButton";

import DataToDB from "../../dataToDB/dataToDB";
import ReCAPTCHA from "react-google-recaptcha";

import { ModalProps } from "../../types/types";

import closeModal from "../../utilities/closeModal";
import openModal from "../../utilities/openModal"

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
  setIsPasswordWillBeReset,
}: ModalProps) => {
  const { t } = useTranslation();

  const [isChecked, setIsChecked] = useState(false);
  const [isUserMakeAMistake, setIsUserMakeAMistake] = useState(0);

  useEffect(() => {
    console.log(`Пользователь совершил ошибку ${isUserMakeAMistake} раз.`);
  }, [isUserMakeAMistake]);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const modalButtonRef = useRef<HTMLButtonElement | null>(null);

  const dataToDB = new DataToDB({
    setIsLoggedIn,
    setUserData,
    setIsModalOpened,
  });

  const handleRecaptchaChange = (value: string | null) => {
    setSignInData((prevData) => ({ ...prevData, recaptchaValue: value }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let failTimeout;

  const handleLogIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  
    if (!logInData.email || !logInData.password) {
      handleValidationError();
      return;
    }
  
    const loadToast = toast.loading("Recalling your profile...");
    console.log("LogInData в Modal:", logInData);
  
    try {
      const response = await dataToDB.validateLogIn(logInData);
  
      toast.dismiss(loadToast);
  
      if (response.message === true) {
        closeModal({ref : modalRef});
      } else {
        handleLogInError();
      }
    } catch (error) {
      toast.dismiss(loadToast);
      console.error("Ошибка при логине:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  
  const handleValidationError = () => {
    setIsLoggedIn(false);
    animateModalButtonShake();
  };
  
  const animateModalButtonShake = () => {
    if (modalButtonRef.current) {
      modalButtonRef.current.classList.add("shake-animation");
  
      failTimeout = setTimeout(() => {
        modalButtonRef?.current?.classList.remove("shake-animation");
      }, 4000);
    }
  };
    
  const handleLogInError = () => {
    setTimeout(() => {
      setIsUserMakeAMistake((prev) => prev + 1);
      toast.error("Wrong password, or account doesn't exist");
    }, 100);
  };
  

  const validateFormData = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
      animateModalButtonShake()
    } else {
      closeModal({ref : modalRef})
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
        openModal({ref : modalRef})
      }, 10);
    } else {
      closeModal({ ref : modalRef})
    }
  }, [isModalOpened]);

  return (
    <section className={`modal ${isModalOpened ? "active" : ""}`}>
      <div
        ref={modalRef}
        onClick={() => {
          closeModal({ref : modalRef});
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
              closeModal({ref : modalRef});
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

          <div className="modal__flex-block">
            <form
              onSubmit={() => {
                entryMethod == "logIn" ? handleLogIn : validateFormData;
              }}
              action="submit"
            >
              <input
                required
                name="email"
                type="email"
                maxLength={255}
                placeholder={t("email")}
                className="modal__input"
                value={
                  entryMethod === "logIn" ? logInData.email : signInData.email
                }
                onChange={(e) => {
                  const { value } = e.target;
                  if (entryMethod === "logIn") {
                    setLogInData((prevData) => ({ ...prevData, email: value }));
                  } else {
                    setSignInData((prevData) => ({
                      ...prevData,
                      email: value,
                    }));
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
                  entryMethod == "logIn"
                    ? logInData.password
                    : signInData.password
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
            </form>
            <button
            onClick={(e) => {
              entryMethod == "logIn" ? handleLogIn(e) : validateFormData(e);
            }}
              type="submit"
              className="modal__button"
              ref={modalButtonRef}
            >
              {t("con")}
              <span>{t("tinue")}</span>
            </button>
          </div>

          {entryMethod === "logIn" ? (
            <>
              <a
                onClick={() => {
                  if (logInData.email && isUserMakeAMistake) {
                    setIsModalOpened(false);
                    setIsPasswordWillBeReset(true);
                  } else {
                    return;
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

          {entryMethod === "SignIn" ? (
            <ReCAPTCHA
              className="captcha"
              sitekey="6LcxnbQqAAAAALV-GfKKoJPxRVIshbTjTa5izOVr"
              onChange={handleRecaptchaChange}
              data-size="compact"
            />
          ) : null}

          <div className="other__buttons-flex">
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
              <h3 className="modal-checkbox__text">
                {t("I have read the")}{" "}
                <Link to="/terms">{t("user agreement,")}</Link> {t("and ")}
                <Link to="/dataprocessing">
                  {t("Personal Data Processing Agreement")}
                </Link>
                {" "}{t("and")} <a href="https://www.youtube.com/t/terms">{t("YouTube's terms of service")}</a>
                {t(" and accept all its terms and conditions")}
              </h3>
            ) : null}
          </div>

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
