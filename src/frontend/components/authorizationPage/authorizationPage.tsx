import React from "react";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "../../types/declarations.d.ts";

import "./authorizationPage.css";
import "../../fonts/font.css";


import logInIcon from "../../images/logInIcon.png";
import signUpIcon from "../../images/signUpIcon.png";
import backIcon from "../../icons/backbutton.png";
import decoration from "../../icons/decoration.png";

const AuthorizationPage = ({}) => {

  const { t } = useTranslation();

  return (
    <>
      <Link to={"/search"}>
        <img src={backIcon} alt="" className="back__button" />
      </Link>

      <div className="authrorization__block">
        <img
          src={decoration}
          id="first__decoration"
          alt=""
          className="decoration"
        />
  
        <h1 className="authorization__page-title">
          {t("What would you like to do?")}
        </h1>

        <div className="authorization__page-block">
          <div className="authorization__page-icon_block">
            <Link to="/signup">
              <img
                src={signUpIcon}
                alt=""
                className="authorization__page-icon"
              />
            </Link>
            <h3 className="authorization__page-text">{t("Sign Up")}</h3>
          </div>

          <div className="authorization__page-icon_block">
            <Link to="/login">
              <img
                src={logInIcon}
                alt=""
                className="authorization__page-icon"
              />
            </Link>
            <h3 className="authorization__page-text">{t("Log In")}</h3>
          </div>
        </div>

        <img
          src={decoration}
          id="second__decoration"
          alt=""
          className="decoration"
        />
      </div>
    </>
  );
};

export default AuthorizationPage;
