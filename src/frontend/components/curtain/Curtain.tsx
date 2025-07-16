import { toast } from "react-toastify";

import { useState, useEffect } from "react";

import { CurtainProps } from "../../types/types";
import "./Curtain.css";

import saveIcon from "../../icons/saveIcon.png";
import crossIcon from "../../icons/crossIcon.png";
import loading from "../../images/loading-gif.gif";

import { useTranslation } from "react-i18next";

import CurtainFunctions from "./functions/CurtainFunctions";
import { Status } from "../../interfaces/interfaces";

const Curtain = ({
  action,
  isCurtainOpen,
  setIsDataChanged,
  userData,
  setUserData,
}: CurtainProps) => {
  const curtainFunctions = new CurtainFunctions();
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status | null>(null);
  const [newValue, setNewValue] = useState<string>("");
  const [isLoading,setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (status) {
      toast(t(status.message), {
        hideProgressBar: true,
        theme: "dark",
        autoClose: 5000,
      });
    }
  }, [status]);
  return (
    <>
      <div className={`curtain__flex ${isCurtainOpen ? "open" : ""}`}>
        <img
          onClick={() => {
            setIsDataChanged((prev) => ({ ...prev, isDataChanged: false }));
          }}
          src={crossIcon}
          alt=""
          className="curtain__flex-close_btn"
        />
        <div className="curtain__text-bg">
          <h1 className="curtain__text">
            {t("Your new")} <br />
            {t(action)}?
          </h1>
        </div>
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
                changeMethod: "username",
                newValue,
                userData,
                setStatus,
                setUserData,
                setIsLoading,
                setIsDataChanged
              });
            }}
            src={isLoading ? loading : saveIcon}
            alt=""
            className="curtain__input-btn"
          />
        </div>
      </div>
    </>
  );
};
export default Curtain;
