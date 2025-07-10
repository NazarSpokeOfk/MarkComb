import React from "react";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import "../../types/declarations.d.ts";

import backIcon from "../../icons/backbutton.png";
import google from "../../icons/Google.png";
// import decoration from "../../icons/decoration.png"

import "./LogInPage.css";

import TypeWriterComponent from "../headerFilter/functions/TypeWriterComponent.js";
import { LogInPageProps } from "../../types/types.js";

import LogInPageFunctions from "./functions/LogInPageFunctions.js";

const LogInPage = ({
  logInData,
  setLogInData,
  setUserData,
  setIsLoggedIn,
  userData,
}: LogInPageProps) => {
  const navigate = useNavigate();
  const logInPageFunctions = new LogInPageFunctions();
  const [logInStatus, setLogInStatus] = useState<string | "fail" | "success">(
    ""
  );
  const { t } = useTranslation();
  const [userName, setUsername] = useState<string>("");

  useEffect(() => {
    if (!userData) return;

    setUsername(userData.userInformation.username);
  }, [logInStatus]);


  useEffect(() => {
    if(logInStatus === "fail") {
      alert("Пиздец")
      setLogInStatus("")
    } else if (logInStatus === "success"){
      console.log("Ало")
      const timeout = setTimeout(() => {
        navigate("/search")
      }, 2000);
  
      return () => clearTimeout(timeout)
    }
  },[logInStatus])

  return (
    <>
      {logInStatus === "success" ? null : (
        <Link to={"/authorization"}>
          <img src={backIcon} alt="" className="back__button" />
        </Link>
      )}

      {logInStatus === "success" ? (
        <div className="log__in-result_block">
          <h2 className="log__in-result_block--title">
            {t("Welcome")}, {userName} 
          </h2>
          <h2 className="emoji">
             👋
          </h2>
          <p className="log__in-result_block-subtitle shimmer-text">{t("Redirecting")}...</p>
        </div>
      ) : (
        <>
          <h1 className="login__block-title">
            <TypeWriterComponent
              words={["Welcome back", "It's good to see you"]}
            />
          </h1>
          <div className="login__block">
            <form className="form__input-block" action="submit">
              <div className="input__block">
                <input
                  value={logInData.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLogInData((prev) => ({ ...prev, email: value }));
                  }}
                  required
                  type="email"
                  className="input"
                />
                <div className="placeholder">
                  <span>{t("email")}</span>
                </div>
              </div>

              <div className="input__block">
                <input
                  value={logInData.password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLogInData((prev) => ({ ...prev, password: value }));
                  }}
                  required
                  type="text"
                  className="input"
                />
                <div className="placeholder">
                  <span>{t("password")}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  logInPageFunctions.logIn({
                    logInData,
                    setUserData,
                    setIsLoggedIn,
                    setLogInStatus,
                  });
                }}
                className="fancy-button"
              >
                {t("continue")}
              </button>
            </form>

            <button id="forgot" className="button">
              {t("forgot password")}
            </button>

            <div className="divider__container">
              <div className="divider"></div>
              {t("OR")}
              <div className="divider"></div>
            </div>

            <button className="button">
              <div className="google__container">
                {t("continue with google")}{" "}
                <img className="google__btn" src={google} alt="" />
              </div>
            </button>
          </div>
        </>
      )}
    </>
  );
};
export default LogInPage;
