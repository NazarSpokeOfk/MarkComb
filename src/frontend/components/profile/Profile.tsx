import "./profile.css";
import "../../fonts/font.css";

import DataToDB from "../../Client-ServerMethods/dataToDB.js";
import ProfileFunctions from "./functions/ProfileFunctions";

import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";

import { ProfileProps } from "../../types/types";

import plusIcon from "../../icons/plusIcon.jpg";
import editIcon from "../../icons/editIcon.png";

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

  const finalDate = expirationDate
    ? expirationDate.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Your profile</title>
          <meta name="description" content="Profile page" />
        </Helmet>
        <div className="profile__block">
          <div className="personal__data-block">
            <h1 className="profile__title">Personal Data</h1>

            <div className="personal__data-username_block">
              <h2 className="personal__data-username">spokeofk</h2>
              <img
                src={editIcon}
                alt=""
                className="personal__data-image_edit"
              />
            </div>

            <div className="credentials-block">
              <h1 className="profile__title">Credentials</h1>
              <h3 className="credentials-block__email">kurakn10@gmail.com</h3>
              <div className="credentials-block__buttons">
                <button className="credentials-block__button">
                  Change password
                </button>
                <button className="credentials-block__button">
                  Save changes
                </button>
              </div>
            </div>
          </div>

          <div className="currency-block">
            <h1 className="profile__title">Currency</h1>
            <div className="currency__amount-block">
              <h3 className="currency-block__amount">86 uses</h3>
              <img
                src={plusIcon}
                alt=""
                className="currency-block__amount-plus"
              />
            </div>
          </div>

          <div className="subscription-block">
            <h1 className="profile__title">Subscription</h1>
            <h4 className="subscription__active-till">Active till</h4>
            <div className="subscription__date-expiration_block">
              <h1 className="subscription__date-expiration_block-date">31</h1>
              <h3 className="subscription__date-expiration_block-month">Aug</h3>
            </div>
          </div>

          <button className="delete__account-button">Delete account</button>
        </div>
      </HelmetProvider>
      <ToastContainer />
    </>
  );
};
export default Profile;
