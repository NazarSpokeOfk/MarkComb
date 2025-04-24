import "./profile.css";
import Edit from "../../images/image 70.png";
import bin from "../../icons/bin.svg";
import arrow from "../../icons/arrow.svg";

import SmoothEffect from "../smoothText.js";
import VerifPassword from "../modal/verifPassword.jsx";

import DataToDB from "../../dataToDB/dataToDB.js";

import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";

import VerifCode from "../modal/verifCode.jsx";
import NewPassword from "../modal/newPassword.jsx";

const Profile = ({
  userData,
  setUserData,
  setIsLoggedIn,
  csrfToken,
  isLoggedIn,
}) => {
  const { t, i18n } = useTranslation();
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [isNameSuccessFullyChanged, setIsNameSuccessFullyChanged] =
    useState(false);
  const [localName, setLocalName] = useState(userData?.user?.username || "");
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [isAccountWillBeDeleted, setIsAccountWillBeDeleted] = useState(false);
  const [isVerificationCodeCorrect, setIsVerificationCodeCorrect] =
    useState(false);

  const [changedData, setChangedData] = useState({
    username: "",
    newPassword: "",
    oldPassword: "",
    user_id: userData?.user?.user_id,
    changeMethod: "",
  });

  const [isPromocodeActive, setIsPromocodeActive] = useState(false);
  const [promocodeValue, setPromocodeValue] = useState("");

  const dataToDb = new DataToDB();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isVerificationCodeCorrect && isAccountWillBeDeleted) {
      dataToDb.deleteProfile(userData.user.user_id, csrfToken);
      document.body.style.overflow = "";

      toast.success(t("Account deleted."), {
        duration: 1500,
      });

      const timer = setTimeout(() => {
        setIsLoggedIn(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isVerificationCodeCorrect, isAccountWillBeDeleted]);


  const handleNameChange = (e) => {
    const value = e.target.value;
    setLocalName(value);
    setChangedData((prevData) => ({
      ...prevData,
      username: value,
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
            <button
              onClick={() => {
                setIsPromocodeActive(true);
              }}
              className={`profile__promocode-activation ${
                isPromocodeActive ? "none" : ""
              }`}
            >
              Activate <span>promocode</span>
            </button>
            {isPromocodeActive ? (
              <>
                {" "}
                <input
                  onChange={(e) => {
                    setPromocodeValue(e.target.value);
                  }}
                  autoFocus
                  value={promocodeValue}
                  placeholder="promocode"
                  className="promocode_input"
                  maxLength={15}
                  type="text"
                />
                <button
                  onClick={() => {
                    dataToDb
                      .activatePromocode(promocodeValue, userData.user.email)
                      .then((response) => {
                        if (response?.status === true) {
                          setIsPromocodeActive(false);
                          toast.success(
                            `Promocode activated! Your current uses: ${response?.newUses}`
                          );
                        } else {
                          toast.error(
                            "Failed to activate promocode. Please try again."
                          );
                        }
                      })
                      .catch((error) => {
                        toast.error(
                          "An error occurred while activating the promocode."
                        );
                        console.error("Error activating promocode: ", error);
                      });
                  }}
                  className="promocode__submit-btn"
                >
                  <img src={arrow} alt="send promocode" />
                </button>
              </>
            ) : null}

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

              <h2 className="info_block-password none">
                {t("PASS")}
                <span>{t("WORD")}</span> : *
              </h2>

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
              {t("Save")}
            </button>
          </div>
          <button
            onClick={() => {
              setIsAccountWillBeDeleted(true);
            }}
            id="delete"
            className="edit__button"
          >
            <img src={bin} alt="delete your profile" className="bin_btn" />
          </button>
        </section>

        {isAccountWillBeDeleted ? (
          <VerifCode
            data={userData.user}
            isTriggered={isAccountWillBeDeleted}
            setIsTriggered={setIsAccountWillBeDeleted}
            setIsVerificationCodeCorrect={setIsVerificationCodeCorrect}
          />
        ) : null}

        {isPasswordChanged ? (
          <VerifCode
            data={userData.user}
            isTriggered={isPasswordChanged}
            setIsTriggered={setIsPasswordChanged}
            setIsVerificationCodeCorrect={setIsVerificationCodeCorrect}
          />
        ) : null}

        {isVerificationCodeCorrect && isPasswordChanged ? (
          <>
            <NewPassword
              email={userData.user.email}
              isVerificationCodeCorrect={isVerificationCodeCorrect}
              setIsVerificationCodeCorrect={setIsVerificationCodeCorrect}
            />
          </>
        ) : null}

        {changedData.changeMethod ? (
          <VerifPassword
            changedData={changedData}
            setChangedData={setChangedData}
            setUserData={setUserData}
            isAccountWillBeDeleted={isAccountWillBeDeleted}
            setIsLoggedIn={setIsLoggedIn}
            setIsAccountWillBeDeleted={setIsAccountWillBeDeleted}
            csrfToken={csrfToken}
            setIsNameChanged={setIsNameChanged}
            setIsPasswordChanged={setIsPasswordChanged}
          />
        ) : null}

        <section id="profile__footer" className="footer">
          <div className="footer__container">
            <div className="footer-first__group">
              <div id="logo_footer" className="logo">
                Mark<span>Comb</span>
              </div>
            </div>

            <div className="footer-second__group">
              <Link id="Terms" to="/terms" className="footer__terms none">
                {t("Terms of service")}
              </Link>
              <Link to="/purpose" className="footer__purpose none">
                {t("Our purpose")}
              </Link>
              <Link to="/dataprocessing" className="footer__purpose none">
                {t("Personal Data Processing Agreement")}
              </Link>
              <h4 className="footer-third__group-text">2025 MarkComb</h4>
              <h4 className="footer-third__group-text">
                📧{" "}
                <a href="mailto:markcombsup@gmail.com">markcombsup@gmail.com</a>
              </h4>
            </div>
            <div className="footer__btns-container">
              <button
                onClick={() => {
                  SmoothEffect().then(() => {
                    i18n.changeLanguage("ru");
                  });
                }}
                className="footer__button"
                id="RuButton"
              >
                Ru
              </button>
              <button
                onClick={() => {
                  SmoothEffect().then(() => {
                    console.log(i18n);
                    i18n.changeLanguage("en");
                  });
                }}
                className="footer__button"
              >
                En
              </button>
            </div>
          </div>
        </section>
        <ToastContainer />
      </HelmetProvider>
    </>
  );
};
export default Profile;
