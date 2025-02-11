import "./profile.css";
import Edit from "../../images/image 70.png";

import SmoothEffect from "../smoothText.js";
import VerifPassword from "../modal/verifPassword.jsx";

import { ToastContainer , toast } from "react-toastify";
import { Link,useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";

const Profile = ({ userData, setUserData , setIsLoggedIn , csrfToken , isLoggedIn }) => {
  const { t, i18n } = useTranslation();
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [localName, setLocalName] = useState(userData?.user?.username || "");
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [isAccountWillBeDeleted,setIsAccountWillBeDeleted] = useState(false)
  const [localPassword, setLocalPassword] = useState(
    userData?.user?.password || ""
  );
  const [changedData, setChangedData] = useState({
    username: "",
    newPassword: "",
    oldPassword: "",
    user_id: userData?.user?.user_id,
    changeMethod: "",
  });

  const navigate = useNavigate()

  useEffect(()=>{
    if(!isLoggedIn){
      navigate("/")
    }
  },[])

  const handleNameChange = (e) => {
    const value = e.target.value;
    setLocalName(value);
    setChangedData((prevData) => ({
      ...prevData,
      username: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setLocalPassword(value);
    setChangedData((prevData) => ({
      ...prevData,
      newPassword: value,
    }));
  };

  const checkWhatChange = () => {
    if (changedData.username != "" && changedData.newPassword === "") {
      console.log("username");
      setChangedData((prevData) => ({ ...prevData, changeMethod: "username" }));
    } else if (changedData.username != "" && changedData.newPassword != "") {
      setChangedData((prevData) => ({
        ...prevData,
        changeMethod: "username&password",
      }));
    } else if (changedData.newPassword != "" && changedData.username === "") {
      setChangedData((prevData) => ({ ...prevData, changeMethod: "password" }));
    } 
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Your profile</title>
          <meta name="description" content="Profile page" />
        </Helmet>
        <header>
          <div className="container">
            <div className="logo">
              <Link to="/">
                Mark<span>Comb</span>
              </Link>
            </div>
            <div className="header__links">
              <Link to="/purchases" className="header__link">
                {t("purc")}
                <span className="highlight">{t("hases")}</span>
              </Link>
              <Link to="/promotion" className="header__link">
                {t("prom")}
                <span>{t("otion")}</span>
              </Link>
              <Link to="/purchase" className="header__link">
                {t("purch")}
                <span>{t("ase")}</span>
              </Link>
            </div>
          </div>
        </header>

        <section className="profile">
          <div className="container">
            <button
              onClick={() => {
                setIsNameChanged(true);
              }}
              className={`username__edit-button ${
                isNameChanged ? "unactive" : ""
              }`}
            >
              <img src={Edit} alt="edit" />
            </button>

            {isNameChanged ? (
              <input
                className="name__input"
                value={localName}
                onChange={handleNameChange}
                type="text"
                placeholder="Enter your new username"
              />
            ) : (
              <h1 className="profile_name">
                {userData ? userData?.user?.username : "Log in firstly"}
              </h1>
            )}

            <h2 className="profile_uses-title none">{t("uses")}</h2>
            <h3 className="profile_uses-amount">
              {userData ? userData?.user?.uses : ""}
            </h3>

            <div className="info_block">
              <h3 className="info_block-title none">
                {t("in")}
                <span>{t("fo")}</span>
              </h3>
              <h2 className="info_block-email none">
                {t("EM")}
                <span>{t("AIL")}</span> :{" "}
                {userData ? userData?.user?.email : ""}
              </h2>
              {isPasswordChanged ? (
                <input
                  className="password__input"
                  value={localPassword}
                  onChange={handlePasswordChange}
                  type="text"
                  placeholder="Enter your new password"
                />
              ) : (
                <h2 className="info_block-password none">
                  {t("PASS")}
                  <span>{t("WORD")}</span> : *****
                </h2>
              )}
              <button
                onClick={() => {
                  setIsPasswordChanged(true);
                }}
                className={`password__edit-button ${
                  isPasswordChanged ? "unactive" : ""
                }`}
              >
                <img src={Edit} alt="edit" />
              </button>
            </div>

            <button
              onClick={() => {
                checkWhatChange();
              }}
              className="edit__button"
            >
              Save
            </button>
          </div>
          <button
            onClick={() => {
              setIsAccountWillBeDeleted(true)
            }}
            id="delete"
            className="edit__button"
          >
            <span>Delete</span> profile
          </button>
        </section>

        {changedData.changeMethod || isAccountWillBeDeleted ? (
          <VerifPassword
            changedData={changedData}
            setChangedData={setChangedData}
            setUserData={setUserData}
            isAccountWillBeDeleted = {isAccountWillBeDeleted}
            setIsLoggedIn={setIsLoggedIn}
            setIsAccountWillBeDeleted = {setIsAccountWillBeDeleted}
            csrfToken = {csrfToken}
          />
        ) : null}
        <ToastContainer />

        <section className="footer">
          <div className="footer__container">
            <h3 className="footer__logo">MK,2024</h3>
            <Link to="/terms" className="footer__terms">
              {t("Terms of Service")}
            </Link>
            <Link to="/purpose" className="footer__purpose">
              {t("Our Purpose")}
            </Link>
            <button
              onClick={() => {
                SmoothEffect().then(() => {
                  i18n.changeLanguage("en");
                });
              }}
              className="footer__button"
            >
              English
            </button>

            <button
              onClick={() => {
                SmoothEffect().then(() => {
                  i18n.changeLanguage("ru");
                });
              }}
              className="footer__button"
            >
              Русский
            </button>
          </div>
        </section>
      </HelmetProvider>
    </>
  );
};
export default Profile;
