import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";

import Header from "../header/Header";

import TooManyRequests from "../../images/TooManyRequests.png";

import "./tooManyRequestsThumbnail.css";

const TooManyRequestsThumbnail = ({}) => {
  const { t } = useTranslation();

  return (
    <>
      <Header />

      <div className="requests__container">
        <img src={TooManyRequests} alt="" className="requests__img" />

        <h1 className="requests__title">
          {t("Well, well, too many requests")}.
        </h1>

        <Link className="forbidden__link" to="/search">
          <button className="requests__button">
            <span>{t("To main page")}</span>
          </button>
        </Link>
      </div>
    </>
  );
};
export default TooManyRequestsThumbnail;
