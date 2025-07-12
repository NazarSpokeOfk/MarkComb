import backIcon from "../../icons/backbutton.png";
import { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

import "./SignUpPage.css";
import "../../fonts/font.css";

import ReCAPTCHA from "react-google-recaptcha";
import TypeWriterComponent from "../headerFilter/functions/TypeWriterComponent";
import CodeInput from "../codeInput/CodeInput";

import { SignUpPageProps } from "../../types/types";
import {
  SignInData,
  RegistrationStatusKey,
  statusMessages,
} from "../../interfaces/interfaces";

import SignUpFunctions from "./functions/SignUpFunctions";

import DataToDB from "../../Client-ServerMethods/dataToDB";

import smoothThumbnail from "../../utilities/smoothThumbnail";

import decoration from "../../icons/decoration.png";
const SignUpPage = ({ signInData, setSignInData }: SignUpPageProps) => {
  const dataToDb = new DataToDB();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const [countdown, setCountDown] = useState<number>(5);
  const [hide, setHide] = useState<boolean>(false);
  const [registrationStatus, setRegistrationStatus] =
    useState<RegistrationStatusKey | null>(null);
  const stepKeys: (keyof SignInData)[] = [
    "username",
    "email",
    "password",
    "recaptchaValue",
    "verification_code",
  ];
  const titles = [
    "Hello there, what's your name?",
    "What's your email?",
    "What password will you set?",
    "Oh, I almost forgot 🧐",
    "Enter verification code",
  ];

  const [triggerErase, setTriggerErase] = useState<
    "forward" | "backward" | null
  >(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const isCheckboxesComplete = Boolean(
    signInData.isAgreed && signInData.recaptchaValue
  );

  const thumbnailRef = useRef<HTMLDivElement>(null);

  const signUpFunctions = new SignUpFunctions();

  useEffect(() => {
    if (step >= 3) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [step]);

  useEffect(() => {
    if (registrationStatus) {
      const countDownTimer = setTimeout(() => {
        setCountDown(countdown - 1);
        if (countdown === 0) {
          clearInterval(countDownTimer);
          navigate("/search");
        }
      }, 1000);
    }
  });

  useEffect(() => {
    const isCaptchaPassed = !!signInData.recaptchaValue;
    const isAgreementChecked = signInData.isAgreed;

    if (isCaptchaPassed && isAgreementChecked && step !== 0) {
      signUpFunctions.handleContinue({
        stepKeys,
        step,
        inputValue,
        setError,
        setTriggerErase,
        setSignInData,
        signInData,
      });
      dataToDb.makeFetchForCode({
        email: signInData.email,
        operationCode: "REGISTRATION",
        isRegistration : true,
        setRegistrationStatus,
        setStep,
      });
    }
  }, [signInData.recaptchaValue, signInData.isAgreed]);

  useEffect(() => {
    smoothThumbnail(thumbnailRef)
  }, [registrationStatus]);

  return (
    <>
      {step >= 4 ? null : (
        <img
          onClick={() => {
            if (step === 0) {
              navigate("/authorization");
            } else {
              setTriggerErase("backward");
              setInputValue("");
            }
          }}
          src={backIcon}
          alt=""
          className="back__button"
        />
      )}

      <div className="sign__up-block">
        {!hide ? <img src={decoration} alt="" className="decoration" /> : null}
        <div className={`sign__up-main_flex ${hide ? "captcha__active" : ""}`}>
          {registrationStatus ? null : (
            <h1 className="sign__up-title">
              <TypeWriterComponent
                words={[titles[currentIndex]]}
                triggerErase={triggerErase}
                onEraseComplete={(direction) => {
                  setTriggerErase(null);
                  if (direction === "forward") {
                    setCurrentIndex((prev) => prev + 1);
                    setStep((prev) => prev + 1);
                  } else {
                    setCurrentIndex((prev) => prev - 1);
                    setStep((prev) => prev - 1);
                  }
                  setInputValue("");
                }}
              />
            </h1>
          )}

          {step === 3 ? (
            <div className="captcha__flex-box">
              <ReCAPTCHA
                sitekey="6LcxnbQqAAAAALV-GfKKoJPxRVIshbTjTa5izOVr"
                onChange={(token: string | null) => {
                  setSignInData((prev) => ({ ...prev, recaptchaValue: token }));
                }}
                data-size="compact"
              />

              <div className="checkbox__block">
                <input
                  onChange={() => {
                    setSignInData((prev) => ({
                      ...prev,
                      isAgreed: !prev.isAgreed,
                    }));
                  }}
                  required
                  type="checkbox"
                  className="checkbox"
                />
                <p className="agreement__text">
                  Я согласен со всеми положениями <br />
                  <Link className="agreement__link" to="/terms">
                    лицензионного соглашения
                  </Link>{" "}
                  и <br />
                  <Link className="agreement__link" to="/dataprocessing">
                    обработкой персональных данных.
                  </Link>
                  <br />
                  <br />
                  Также я принимаю{" "}
                  <a
                    className="agreement__link"
                    href="https://www.youtube.com/t/terms"
                  >
                    {t("YouTube's terms of service")}
                  </a>
                </p>
              </div>
            </div>
          ) : null}

          {hide ? null : (
            <div className="sign__up-flex">
              <input
                value={inputValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputValue(value);
                }}
                type="text"
                className="input"
              />
              <button
                onClick={() => {
                  signUpFunctions.handleContinue({
                    stepKeys,
                    step,
                    inputValue,
                    setError,
                    setTriggerErase,
                    setSignInData,
                    signInData,
                  });
                }}
                className="continue__btn"
              >
                {t("Continue")}
              </button>
            </div>
          )}

          {registrationStatus ? (
            <div ref={thumbnailRef} className="default">
              <div className="result__block">
                <div className="result__block-emoji">
                  {statusMessages[registrationStatus].emoji}
                </div>
                <h2 className="result__block-title">
                  {t(statusMessages[registrationStatus].title)}
                </h2>
                <p className="result__block-subtitle">
                  {t("We'll redirect you to main page in")}
                </p>
                <h2 className="result__block-number">{countdown}</h2>
              </div>
            </div>
          ) : null}

          {isCheckboxesComplete && step === 4 && (
            <CodeInput
              onComplete={(code) => {
                const updatedData = { ...signInData, verification_code: code };
                setSignInData(updatedData);

                setTimeout(async () => {
                  await signUpFunctions.handleRegister({
                    updatedData,
                    setRegistrationStatus,
                    setHide,
                  });
                  setStep(6);
                }, 1000);
              }}
              setData={setSignInData}
            />
          )}

          {error && <p className="error-text">{t(error)}</p>}
        </div>
      </div>
    </>
  );
};
export default SignUpPage;
