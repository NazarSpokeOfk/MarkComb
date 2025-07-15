import "./profile.css";
import "../../fonts/font.css";

import DataToDB from "../../Client-ServerMethods/dataToDB.js";
import ProfileFunctions from "./functions/ProfileFunctions";

import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";

import { ProfileProps } from "../../types/types";

import plusIcon from "../../icons/plusIcon.jpg";
import editIcon from "../../icons/editIcon.png";
import logOutIcon from "../../icons/logOutIcon.jpg";

const Profile = ({
  userData,
  setUserData,
  setIsLoggedIn,
  csrfToken,
  isLoggedIn,
}: ProfileProps) => {
  const profileFunctions = new ProfileFunctions();

  const { t } = useTranslation();

  const dataToDb = new DataToDB({ setUserData, setIsLoggedIn });

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const expirationRaw = userData?.userInformation?.subscription_expiration;
  const expirationDate = expirationRaw ? new Date(expirationRaw) : null;

  const dayAndMonth = expirationDate ? new Intl.DateTimeFormat("ru-RU", {
    day : "numeric",
    month : "short"
  }).formatToParts(expirationDate)
  : null;

  const day = dayAndMonth?.find((part) => part.type === "day")?.value;
  const month = dayAndMonth?.find((part) => part.type === "month")?.value

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Your profile")}</title>
          <meta name="description" content="Profile page" />
        </Helmet>
        <div className="profile__block">
          <div className="personal__data-block">
            <h1 className="profile__title">{t("Your Data")}</h1>

            <div className="personal__data-username_block">
              <h2 className="personal__data-username">{userData.userInformation.username}</h2>
              <img
                src={editIcon}
                alt=""
                className="personal__data-image_edit"
              />
            </div>

            <div className="credentials-block">
              <h1 className="profile__title">{t("Credentials")}</h1>
              <h3 className="credentials-block__email">{userData.userInformation.email}</h3>
              <div className="credentials-block__buttons">
                <button className="credentials-block__button">
                  {t("Change password")}
                </button>
                <button className="credentials-block__button">
                  {t("Save changes")}
                </button>
              </div>
            </div>
          </div>

          <div className="profile-second__part">
            <div className="currency-block">
              <h1 className="profile__title">{t("Currency")}</h1>
              <div className="currency__amount-block">
                <h3 className="currency-block__amount">{userData.userInformation.uses}</h3>
                <Link to="/purchase">
                  <img
                    src={plusIcon}
                    alt=""
                    className="currency-block__amount-plus"
                  />
                </Link>
              </div>
            </div>

            <div className="subscription-block">
              <h1 className="subscription__title">{t("Subscription")}</h1>
              <h4 className="subscription__active-till">{t("Active till")}</h4>
              <div className="subscription__date-expiration_block">
                <h1 className="subscription__date-expiration_block-date">{day}</h1>
                <h3 className="subscription__date-expiration_block-month">
                  {month}
                </h3>
              </div>
            </div>

            <button className="delete__account-button fancy-button">
              {t("Delete account")}
            </button>
          </div>

          <button className="logout-button" aria-label="Log out">
            <svg
              className="door"
              viewBox="0 0 80 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="25"
                y="10"
                width="30"
                height="44"
                fill="none"
                stroke="black"
                stroke-width="4"
                rx="4"
              />

              <rect
                className="door-panel"
                x="25"
                y="10"
                width="30"
                height="44"
                fill="black"
                rx="4"
              />

              <circle cx="50" cy="32" r="2" fill="white" />
            </svg>
          </button>
        </div>
      </HelmetProvider>
      <ToastContainer />
    </>
  );
};
export default Profile;
