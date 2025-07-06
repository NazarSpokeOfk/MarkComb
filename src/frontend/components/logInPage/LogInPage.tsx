import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "../../types/declarations.d.ts";

import backIcon from "../../icons/backbutton.png";
import google from "../../icons/Google.png";
// import decoration from "../../icons/decoration.png"

import "./LogInPage.css";

import TypeWriterComponent from "../headerFilter/functions/TypeWriterComponent.js";
const LogInPage = (
  {
    //   setIsLoggedIn,
    //   setUserData,
    //   isModalOpened,
    //   setIsModalOpened,
    //   logInData,
    //   setLogInData,
    //   signInData,
    //   setSignInData,
    //   setIsPasswordWillBeReset
  }
) => {
  const { t } = useTranslation();
  return (
    <>
      <Link to={"/authorization"}>
        <img src={backIcon} alt="" className="back__button" />
      </Link>

      {/* <img src={decoration} alt="" className="decoration" /> */}

      <h1 className="login__block-title">
        <TypeWriterComponent words={["Welcome back", "It's good to see you"]} isOneTime={true} />
      </h1>
      <div className="login__block">
        <div className="input__block">
          <input type="text" className="input" />
          <div className="placeholder">
            <span>{t("username")}</span>
          </div>
        </div>

        <div className="input__block">
          <input type="text" className="input" />
          <div className="placeholder">
            <span>{t("password")}</span>
          </div>
        </div>

        <button className="button">{t("continue")}</button>

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
  );
};
export default LogInPage;
