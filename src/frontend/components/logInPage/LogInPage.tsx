import { Link } from "react-router-dom";

import { ToastIcon } from "react-toastify";

import smoothThumbnail from "../../utilities/smoothThumbnail";

import { useState, useEffect, useRef } from "react";

import { toast } from "react-toastify";

import CodeInput from "../codeInput/CodeInput";
import LogInAndLogOutThumbnail from "./components/LogInAndLogOutThumbnail/LogInAndLogOutThumbnail";
import MainForm from "./components/mainForm/MainForm";

import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import "../../types/declarations.d.ts";

import backIcon from "../../icons/backbutton.png";
import google from "../../icons/Google.png";
import loading from "../../images/loading-gif.gif";
import decoration from "../../icons/decoration.png";

import "./LogInPage.css";
import "../../fonts/font.css";

import TypeWriterComponent from "../headerFilter/functions/TypeWriterComponent.js";
import AuthorizationThumbnail from "../authorizationThumbnail/authorizationThumbnail";

import { LogInPageProps } from "../../types/types.js";

import {
  RegistrationStatusKey,
  statusMessages,
  verificationCode,
} from "../../interfaces/interfaces";

import LogInPageFunctions from "./functions/LogInPageFunctions.js";

const LogInPage = ({
  logInData,
  setLogInData,
  setUserData,
  setIsLoggedIn,
  userData,
}: LogInPageProps) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const logInPageFunctions = new LogInPageFunctions();

  const [logInStatus, setLogInStatus] = useState<string | "fail" | "success">(
    ""
  );
  const [userName, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordWillBeReset, setIsPasswordWillBeReset] =
    useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<verificationCode>();
  const [hide, setHide] = useState<boolean>(false);
  const [isVerificationCodeCorrect, setIsVerificationCodeCorrect] =
    useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [isPasswordChangedSuccessfully, setIsPasswordChangedSuccessfully] =
    useState<RegistrationStatusKey | null>(null);

  const thumbnailRef = useRef<HTMLDivElement>(null);

  const showErrorToast = (message: string, icon: ToastIcon) => {
    toast(t(message), {
      icon,
      hideProgressBar: true,
      theme: "dark",
      autoClose: 5000,
    });
  };

  useEffect(() => {
    isPasswordWillBeReset ? setHide(true) : null
  },[isPasswordWillBeReset])
  //track thumbnail show
  useEffect(() => {
    if(logInStatus === "success"){
      setHide(true)
    }

    if (!userData) return;

    setUsername(userData.userInformation.username);

    logInPageFunctions.redirectToMainPage({ logInStatus, navigate });
  }, [logInStatus]);

  useEffect(() => {
    if (error) {
      toast.dismiss();
      showErrorToast(error, <>❌</>);
    }
  }, [error]);

  useEffect(() => {
    if (
      isPasswordChangedSuccessfully === "invalid" ||
      isPasswordChangedSuccessfully === "wrong"
    ) {
      const msg = statusMessages[isPasswordChangedSuccessfully];
      showErrorToast(msg.title, <>{msg.emoji}</>);
    }
    smoothThumbnail(thumbnailRef);
  }, [isPasswordChangedSuccessfully, logInStatus]);

  return (
    <>
      {logInStatus === "success" ? null : (
        <Link to={"/authorization"}>
          <img src={backIcon} alt="" className="back__button" />
        </Link>
      )}

      {logInStatus === "success" ? (
        <LogInAndLogOutThumbnail
          thumbnailRef={thumbnailRef}
          userName={userName}
          text="Welcome"
        />
      ) : null}

      {hide ? null : (
        <MainForm
          logInData={logInData}
          setLogInData={setLogInData}
          setUserData={setUserData}
          setIsLoggedIn={setIsLoggedIn}
          setLogInStatus={setLogInStatus}
          setIsLoading={setIsLoading}
          setError={setError}
          isLoading={isLoading}
          loading={loading}
          setIsPasswordWillBeReset={setIsPasswordWillBeReset}
          userData = {userData}
        />
      )}

      {isPasswordWillBeReset && hide ? (
        <>
          <div className="code__input-block">
            <h1 className="sign__up-title">
              <TypeWriterComponent words={["Enter verification code"]} />
            </h1>
            <CodeInput
              onComplete={(code) => {
                setVerificationCode((prev) => ({
                  ...prev,
                  verification_code: code,
                }));

                logInPageFunctions.isVerificationCodeCorrect({
                  email: logInData.email,
                  verificationCode: code,
                  setIsVerificationCodeCorrect: setIsVerificationCodeCorrect,
                  setIsPasswordWillBeReset,
                  setError,
                });
              }}
              setData={setVerificationCode}
            />
          </div>
        </>
      ) : null}
    </>
  );
};
export default LogInPage;
