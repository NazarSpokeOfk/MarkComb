import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import DataToDB from "../../Client-ServerMethods/dataToDB";

import ForbiddenImage from "../../icons/ForbiddenImage.png";

import { defaultUserData } from "../../types/types";

import { ForbiddenThumbnailProps } from "../../types/types";

import "./ForbiddenThumbnail.css";
import { useEffect } from "react";

const ForbiddenThumbnail = ({
  setUserData,
  setIsLoggedIn,
}: ForbiddenThumbnailProps) => {
  const dataToDB = new DataToDB({});

  const { t } = useTranslation();

  useEffect(() => {
    console.log("Сброс фекалий")
    dataToDB.logOut();
    setUserData(defaultUserData);
    setIsLoggedIn(false);
  })

  return (
    <>
      <div className="forbidden__container">
        <img src={ForbiddenImage} alt="" className="forbidden__image" />

        <h1 className="forbidden__title">
          {t("Usually this error occurs due to an")} <br />{" "}
          {t("expired session")}.{" "}
        </h1>
        <Link className="forbidden__link" to="/authorization">
          <button className="forbidden__button">
            <span>{t("Log in again")}</span>
          </button>
        </Link>
      </div>
    </>
  );
};
export default ForbiddenThumbnail;
