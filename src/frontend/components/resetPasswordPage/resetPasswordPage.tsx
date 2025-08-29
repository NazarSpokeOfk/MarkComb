import "./resetPasswordPage.css";

import { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import smoothThumbnail from "../../utilities/smoothThumbnail";
import AuthorizationThumbnail from "../authorizationThumbnail/authorizationThumbnail";
import { statusMessages } from "../../interfaces/interfaces";

import ResetPasswordFunctions from "./functions/resetPasswordPageFunctions";

import loading from "../../images/loading-gif.gif";
import saveIcon from "../../icons/saveIcon.png";

const ResetPasswordPage = ({}) => {
  const { t } = useTranslation();
  const resetPasswordFunctions = new ResetPasswordFunctions();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(true);
  const [isReseted, setIsReseted] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");

  const thumbnailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    smoothThumbnail(thumbnailRef);
  }, [isReseted]);

  return (
    <>
      {isLoading ? (
        <>
          <img className="delete__loading" src={loading} alt="" />
        </>
      ) : null}
      {show ? (
        <>
          <h2 className="password__changing-title">{t("Password reset")}</h2>
          <div className="password__changing-flex">
            <input
              value={newPassword}
              onChange={(e) => {
                const value = e.target.value;
                setNewPassword(value);
              }}
              type="text"
              className="curtain__input"
            />
            <img
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                const token = params.get("token");
                if (!token) return;
                resetPasswordFunctions.changePassword({
                  newPassword,
                  token,
                  setIsLoading,
                  setShow,
                  setIsReseted,
                });
              }}
              src={saveIcon}
              alt=""
              className="curtain__input-btn"
            />
          </div>
        </>
      ) : null}
      {isReseted ? (
        <AuthorizationThumbnail
          thumbnailRef={thumbnailRef}
          statusMessages={statusMessages}
          status="successfullReset"
        />
      ) : null}
    </>
  );
};
export default ResetPasswordPage;
