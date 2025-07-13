import React from "react";

import TypeWriterComponent from "../../../headerFilter/functions/TypeWriterComponent";

import LogInPageFunctions from "../../functions/LogInPageFunctions";

import { useTranslation } from "react-i18next";
import { MainFormProps } from "../../../../types/types";

const MainForm = ({
  logInData,
  setLogInData,
  setUserData,
  setIsLoggedIn,
  setLogInStatus,
  setIsLoading,
  setError,
  setHide,
  isLoading,
  loading,
  setIsPasswordWillBeReset,
  google
} : MainFormProps) => {
  const {t} = useTranslation();
  const logInPageFunctions = new LogInPageFunctions();
  return (
    <>
      <h1 className="login__block-title">
        <TypeWriterComponent words={["Welcome back", "It's good to see you"]} />
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
                setIsLoading,
                setError,
                setHide,
              });
            }}
            className="fancy-button"
          >
            {t("continue")}
          </button>
        </form>

        {isLoading ? (
          <>
            <img src={loading} className="loading" alt="" />
          </>
        ) : null}

        <button
          onClick={async () => {
            setIsPasswordWillBeReset(true);
            await logInPageFunctions.forgotPassword({
              email: logInData.email,
              setHide,
              setError,
            });
          }}
          id="forgot"
          className="button"
        >
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
export default MainForm;
