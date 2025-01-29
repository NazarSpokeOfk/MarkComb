import { useTranslation } from "react-i18next";
import { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import DataToDB from "../../dataToDB/dataToDB";

import SmoothEffect from "../smoothText";
import GetData from "../../requests/getData";

import "./YoutuberBlock.css";
import "react-toastify/dist/ReactToastify.css";

import YoutuberImg from "../../images/MrBeast.webp";

const YoutuberBlock = ({ channelData, SimilarChannelData, userData , isLoggedIn , setUserData , csrfToken }) => {

  const { t, i18n } = useTranslation();
  const [btnsState, setBtnsState] = useState({});
  const isProcessingRef = useRef({});

  const dataToDB = new DataToDB(true,setUserData);

  const logInErrorToast = () => {
    toast.error(t("Firstly, find the youtuber whose contact details you want to get"));
  };

  const alreadyHave = () => {
    toast.warning(t("You already bought this data."));
  };

  useEffect(()=>{
    console.log("Токен, пришедший в покупки:",csrfToken)
  },[csrfToken])


  const handleButtonClick = async (data, buttonId) => {
    let timeout1, timeout2, timeout3;
  
    if (!data?.channelId) {
      logInErrorToast();
      return;
    }
  
    if (isProcessingRef.current[buttonId]) return;
  
    isProcessingRef.current[buttonId] = true;
  
    // Обновление состояния кнопки для начала обработки
    setBtnsState((prev) => ({
      ...prev,
      [buttonId]: { isProcessing: true },
    }));
  
    // Проверка перед выполнением, чтобы не дублировать запросы
    if (btnsState[buttonId]?.isProcessing) return;
  
    try {
      const result = await GetData(data.channelId);
  
      if (!result || result.length === 0) {
        setBtnsState((prev) => ({
          ...prev,
          [buttonId]: {
            isProcessing: false,
            class: "fail",
          },
        }));
        isProcessingRef.current[buttonId] = false;
        return;
      }
  
      if (buttonId === 1) {
        dataToDB.validatePurchaseData(
          {
            thumbnail: SimilarChannelData?.[0]?.thumbnail || "",
            email: result?.[0] || "",
            channelName: SimilarChannelData?.[0]?.title || "",
            uses: 1,
          },
          userData?.user?.user_id,
          csrfToken
        );
      } else {
        dataToDB.validatePurchaseData(
          {
            thumbnail: channelData?.[0]?.thumbnail || "",
            email: result?.[0] || "",
            channelName: channelData?.[0]?.title || "",
            uses: 1,
          },
          userData?.user?.user_id,
          csrfToken
        );
      }
  
      setBtnsState((prev) => ({
        ...prev,
        [buttonId]: {
          isProcessing: false,
          class: result.length === 0 ? "fail" : "success",
        },
      }));
    } catch (error) {
      console.log("Ошибка в передаче данных:", error);
    } finally {
      timeout2 = setTimeout(() => {
        isProcessingRef.current[buttonId] = false;
        setBtnsState((prev) => ({
          ...prev,
          [buttonId]: {
            class: "default",
            isProcessing: false,
          },
        }));
      }, 2000);
    }
  
    // Очистка таймаутов
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  };
  

  return (
    <>
      <section className="youtubers">
        <div className="container">
          <div
            className={`youtuber__block ${
              isLoggedIn && channelData ? "youtuber__block" : "pulse"
            }`}
          >
            <div className="youtuber__name none">
              { isLoggedIn && channelData ? channelData?.[0]?.title : "?"}
            </div>
            <div className="youtuber__information">
              <div className="youtuber__definitions">
                <h4 className="youtuber__definition none">
                  {t("Target Audience")}-
                </h4>
                <h4 className="youtuber__definition none">
                  {t("Number of subs")} -
                </h4>
                <h4 className="youtuber__definition none">
                  {t("Content type")} -
                </h4>
              </div>

              <div className="youtuber__stats">
                <h4 className="statistic none">
                  { isLoggedIn && channelData ? channelData?.[0]?.targetAudience : "?"}
                </h4>
                <h4 className="statistic none">
                  { isLoggedIn && channelData ? channelData?.[0].subsCount : "?"}
                </h4>
                <h4 className="statistic none">
                  { isLoggedIn && channelData ? channelData?.[0]?.genre : "?"}
                </h4>
              </div>
            </div>
            <img
              src={isLoggedIn && channelData?.[0]?.thumbnail || YoutuberImg}
              alt="MrBeast"
              className="youtuber__image"
            />
          </div>

          <button
            className={`youtuber__button ${btnsState[0]?.class || ""}`}
            onClick={() => {
              if (
                userData.channels &&
                userData.channels.some(
                  (channel) => channel.channel_name === channelData[0].title
                )
              ) {
                alreadyHave()
                return;
              } else {
                isLoggedIn ? handleButtonClick(channelData?.[0], 0) : toast.error("You need to log in firstly");
              }
            }}
          >
            {btnsState[0]?.class === "success"
              ? t("Check contact data in purchases.")
              : btnsState[0]?.class === "fail"
              ? t("Unfortunantly,we can't get contact data.")
              : `${t("Get")} ${t("data")}`}
          </button>
          <ToastContainer />
          <div
            className={`youtuber__block ${
              userData && SimilarChannelData ? "youtuber__block" : "pulse"
            }`}
          >
            <div className="youtuber__name none">
              {userData && SimilarChannelData ? SimilarChannelData?.[0]?.title : "?"}
            </div>
            <div className="youtuber__information">
              <div className="youtuber__definitions">
                <h4 className="youtuber__definition none">
                  {t("Target Audience")}-
                </h4>
                <h4 className="youtuber__definition none">
                  {t("Number of subs")} -
                </h4>
                <h4 className="youtuber__definition none">
                  {t("Content type")} -
                </h4>
              </div>

              <div className="youtuber__stats">
                <h4 className="statistic none">
                  { userData && SimilarChannelData
                    ? SimilarChannelData?.[0]?.genre?.[0]
                    : "?"}
                </h4>
                <h4 className="statistic none">
                  { userData && SimilarChannelData
                    ? SimilarChannelData?.[0]?.subsCount
                    : "?"}
                </h4>
                <h4 className="statistic none">
                  {userData && SimilarChannelData
                    ? SimilarChannelData?.[0]?.genre?.[1]
                    : "?"}
                </h4>
              </div>
            </div>
            <img
              src={userData && SimilarChannelData?.[0]?.thumbnail || YoutuberImg}
              alt="MrBeast"
              className="youtuber__image"
            />
          </div>

          <button
            className={`youtuber__button ${btnsState[1]?.class || ""}`}
            onClick={() => {
              if (
                userData.channels &&
                userData.channels.some(
                  (channel) => channel.channel_name === SimilarChannelData[0].title
                )
              ) {
                alreadyHave()
                return;
              } else {
                handleButtonClick(SimilarChannelData?.[0], 1);
              }
            }}
          >
            {btnsState[1]?.class === "success"
              ? t("Check contact data in purchases.")
              : btnsState[1]?.class === "fail"
              ? t("Unfortunantly,we can't get contact data.")
              : `${t("Get")} ${t("data")}`}
          </button>
          <ToastContainer />
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
                i18n.changeLanguage("ru");
              });
            }}
            className="footer__button"
          >
            Русский
          </button>
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
        </div>
      </section>
    </>
  );
};

export default YoutuberBlock;
