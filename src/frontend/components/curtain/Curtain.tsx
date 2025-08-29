import { toast } from "react-toastify";

import { useState, useEffect } from "react";

import CodeInput from "../codeInput/CodeInput";

import { CurtainProps } from "../../types/types";
import "./Curtain.css";

import saveIcon from "../../icons/saveIcon.png";
import crossIcon from "../../icons/crossIcon.png";
import loading from "../../images/loading-gif.gif";

import { useTranslation } from "react-i18next";

import CurtainFunctions from "./functions/CurtainFunctions";
import { CodeStatus, Status } from "../../interfaces/interfaces";

const Curtain = ({
  action,
  isCurtainOpen,
  setIsCurtainOpen,
  userData,
  setUserData,
}: CurtainProps) => {
  const curtainFunctions = new CurtainFunctions();
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status | null>(null);
  const [newValue, setNewValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCodeSent,setIsCodeSent] = useState<boolean>(false);

  const title = {
    password: "Enter verification code",
    username: "Your new name?",
    promocode : "Enter promocode"
  };

  useEffect(() => {
    if (status) {
      toast(t(status.message), {
        hideProgressBar: true,
        theme: "dark",
        autoClose: 5000,
      });
    }
  }, [status]);

  // useEffect(() => {
  //   if (action === "password") {
  //     curtainFunctions.sendVerificationCode({
  //       email: userData.userInformation.email,
  //       setIsCodeSent,
  //     });
  //   }
  // }, [action]);
  return (
    <>
      <div className={`curtain__flex ${isCurtainOpen ? "open" : ""}`}>
        <img
          onClick={() => {
            setIsCurtainOpen(false);
          }}
          src={crossIcon}
          alt=""
          className="curtain__flex-close_btn"
        />
        <div className="curtain__text-bg">
          <h1 className="curtain__text">
            {action ? <>{t(title[action])}</> : null}
          </h1>
        </div>

        {isCodeSent ? (
          <CodeInput onComplete={(code) => {
              console.log(code)
          }} setData={setIsCodeSent} />
          
        ) : (
          <div className="curtain__input-flex">
            <input
              value={newValue}
              onChange={(e) => {
                const value = e.target.value;
                setNewValue(value);
              }}
              type="text"
              className="curtain__input"
            />
            <img
              onClick={() => {
                curtainFunctions.saveChanges({
                  changeMethod: action,
                  newValue,
                  userData,
                  setStatus,
                  setUserData,
                  setIsLoading,
                  setIsCurtainOpen,
                });
              }}
              src={isLoading ? loading : saveIcon}
              alt=""
              className="curtain__input-btn"
            />
          </div>
        )}
      </div>
    </>
  );
};
export default Curtain;
