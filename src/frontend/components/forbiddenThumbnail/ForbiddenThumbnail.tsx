import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import DataToDB from "../../dataToDB/dataToDB";

import ForbiddenImage from "../../icons/ForbiddenImage.png";

import { defaultUserData } from "../../types/types";

import { ForbiddenThumbnailProps } from "../../types/types";

import "./ForbiddenThumbnail.css";

const ForbiddenThumbnail = ({ setIsModalOpened, setEntryMethod, setUserData } : ForbiddenThumbnailProps) => {

  const dataToDB = new DataToDB({});

  const { t } = useTranslation();

  return (
    <>
      <div className="forbidden__container">
        <img src={ForbiddenImage} alt="" className="forbidden__image" />

        <h1 className="forbidden__title">
          {t("Usually this error occurs due to an")} <br />{" "}
          {t("expired session")}.{" "}
        </h1>
        <Link
          className="forbidden__link"
          onClick={() => {
            setIsModalOpened(true);
            setEntryMethod("logIn");
            dataToDB.logOut()
            setUserData(defaultUserData)
          }}
          to="/search"
        >
          <button className="forbidden__button">
            <span>{t("Log in again")}</span>
          </button>
        </Link>
      </div>
    </>
  );
};
export default ForbiddenThumbnail;
