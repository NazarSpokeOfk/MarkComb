import TypeWriterComponent from "../../../headerFilter/functions/TypeWriterComponent";
import GoogleLoginButton from "../../../googleLogInButton/GoogleLogInButton";
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
  isLoading,
  loading,
  setIsPasswordWillBeReset,
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
                setError
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
            await logInPageFunctions.forgotPassword({
              email: logInData.email,
              setError,
              setIsPasswordWillBeReset
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

        <GoogleLoginButton setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} setLogInStatus={setLogInStatus}/>
      </div>
    </>
  );
};
export default MainForm;
