import backIcon from "../../icons/backbutton.png";
import { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

import "./SignUpPage.css";
import "../../fonts/font.css";

import ReCAPTCHA from "react-google-recaptcha";
import TypeWriterComponent from "../headerFilter/functions/TypeWriterComponent";
import CodeInput from "../codeInput/CodeInput";
import AuthorizationThumbnail from "../authorizationThumbnail/authorizationThumbnail";

import { toast } from "react-toastify";

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

  const showTitle = !["ok", "exists", "changed"].includes(
    registrationStatus || ""
  );

  useEffect(() => {
    signUpFunctions.showInputOrNot({ step, setHide });
  }, [step]);

  useEffect(() => {
    signUpFunctions.checkIsCaptchaAndTermsPassed({
      signInData,
      step,
      stepKeys,
      setStep,
      inputValue,
      setError,
      setTriggerErase,
      setSignInData,
      setRegistrationStatus,
    });
  }, [signInData.recaptchaValue, signInData.isAgreed]);

  useEffect(() => {
    if (registrationStatus === "invalid" || registrationStatus === "wrong") {
      toast(t(statusMessages[registrationStatus].title), {
        icon: <>{statusMessages[registrationStatus].emoji}</>,
        hideProgressBar: true,
        theme: "dark",
        autoClose: 5000,
      });
    }
    smoothThumbnail(thumbnailRef);
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
          {showTitle && (
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

          {registrationStatus &&
            ["ok", "exists", "changed"].includes(registrationStatus) && (
              <AuthorizationThumbnail
                thumbnailRef={thumbnailRef}
                statusMessages={statusMessages}
                status={registrationStatus}
              />
            )}

          {isCheckboxesComplete && step === 4 && (
            <>
              <CodeInput
                onComplete={(code) => {
                  const updatedData = {
                    ...signInData,
                    verification_code: code,
                  };
                  setSignInData(updatedData);

                  setTimeout(async () => {
                    const result = await signUpFunctions.handleRegister({
                      updatedData,
                      setRegistrationStatus,
                      setHide,
                    });

                    // Переход к следующему шагу — только если результат успешный
                    if (["ok", "exists", "changed"].includes(result)) {
                      setStep(6);
                    }
                  }, 1000);
                }}
                setData={setSignInData}
              />
            </>
          )}
          {error && <p className="error-text">{t(error)}</p>}
        </div>
      </div>
    </>
  );
};
export default SignUpPage;
