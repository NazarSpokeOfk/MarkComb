import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

import "./Purchases.css";
import SmoothEffect from "../smoothText";

import binBtn from "../../icons/bin.svg";
import noDataFound from "../../images/No results found.png";

import DataToDB from "../../dataToDB/dataToDB";

const Purchases = ({userData,setUserData}) => {
  const dataToDb = new DataToDB(true);
  const blocksRef = useRef([]),
    binButtonsRef = useRef([]),
    titlesRef = useRef([null]);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log("Данные,пришедшие в Purchases:", userData);
  });

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const removePurchase = async (index, user_id, channelName) => {
    try {
      await toast.promise(
        dataToDb.deletePurchaseData(channelName, user_id),
        {
          pending: "Removing channel...",
          success: "Channel has successfully removed!",
          error: "There was an error during removing channel!",
        }
      );
  
      setUserData((prevData) => ({
        ...prevData,
        channels: prevData.channels.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error("Error removing channel:", error);
    }
  };
  
  

  useEffect(() => {
    let timers = [];
    titlesRef.current.forEach((title, index) => {
      let timer = setInterval(() => {
        title.classList.add("active");
      }, 50 * index);
      timers.push(timer);
    });

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <>
      <header>
        <div className="container">
          <div className="logo">
            <Link to="/">
              M<span>K</span>
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

      <section className="recent">
        <div className="container">
          <h2 ref={(el) => (titlesRef.current[0] = el)} className="title none">
            {t("rec")}
            <span>{t("ent")}</span>
          </h2>
          {userData?.channels?.length > 0 ? (
            userData?.channels.map((channel, index) => (
              <div
                ref={(el) => (blocksRef.current[index] = el)}
                className="recent__block"
                key={index}
              >
                <h3 className="recent-block__name">{channel?.channel_name}</h3>
                <h3 className="recent-block__email">
                  em<span>ail</span> : {channel?.email}
                </h3>
                <button
                  onClick={() =>
                    removePurchase(
                      index,
                      userData.user.user_id,
                      channel.channel_name
                    )
                  }
                  className="recent-block__bin"
                >
                  <img src={binBtn} alt="bin" className="bin" />
                </button>
                <img
                  src={channel?.thumbnail}
                  alt="youtuber picture"
                  className="recent-block__thumbnail"
                />
              </div>
            ))
          ) : (
            <>
              <p className="no_available">No channels available.</p>
              <img className="no_available_img" src={noDataFound} alt="no data found" />
            </>
          )}
        </div>
      </section>

      <section className="footer">
        <div className="footer__container">
          <h3 className="footer__logo">MK,2024</h3>
          <Link to="/terms" className="footer__terms none">
            {t("Terms of service")}
          </Link>
          <Link to="/purpose" className="footer__purpose none">
            {t("Our purpose")}
          </Link>
          <button
            onClick={() => {
              SmoothEffect().then(() => {
                changeLanguage("ru");
              });
            }}
            className="footer__button"
          >
            Русский
          </button>
          <button
            onClick={() => {
              SmoothEffect().then(() => {
                changeLanguage("en");
              });
            }}
            className="footer__button"
          >
            English
          </button>
        </div>
      </section>
    </>
  );
};

export default Purchases;
