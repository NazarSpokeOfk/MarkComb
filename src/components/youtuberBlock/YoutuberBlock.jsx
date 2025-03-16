import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import DataToDB from "../../dataToDB/dataToDB";

import SmoothEffect from "../smoothText";

import "./YoutuberBlock.css";
import "react-toastify/dist/ReactToastify.css";

import YoutuberImgOne from "../../images/YouTuber.jpg";
import YoutuberImgTwo from "../../images/Youtubertow.jpg";

const YoutuberBlock = ({
  channelData,
  SimilarChannelData,
  userData,
  isLoggedIn,
  setUserData,
  csrfToken,
}) => {
  const { t, i18n } = useTranslation();
  const [btnsState, setBtnsState] = useState({});
  const isProcessingRef = useRef({});

  const dataToDB = new DataToDB(true, setUserData);

  const logInErrorToast = () => {
    toast.error(
      t("Firstly, find the youtuber whose contact details you want to get")
    );
  };

  const alreadyHave = () => {
    toast.warning(t("You already bought this data"));
  };

  const handleButtonClick = async (data, buttonId) => {
    console.log("Данные полученные в handleButtonClick : ", data);
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

    if (userData.user.uses > 0) {
      try {
        const result = await fetch("http://localhost:5001/api/getdata", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify({ channelId: data.channelId }),
        });
        const response = await result.json();
        console.log("Ответ от getData в youtuberblock:", response);

        if (!response || response.length === 0) {
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
          console.log(
            "Проверочка:",
            SimilarChannelData.channelStats?.[0]?.thumbnail
          );
          dataToDB.validatePurchaseData(
            {
              thumbnail: SimilarChannelData?.thumbnail || "",
              email: response?.[0] || "",
              channelName: SimilarChannelData?.channelStats?.title || "",
              uses: 1,
            },
            userData?.user?.user_id,
            csrfToken
          );
        } else {
          console.log("Ало бял : ", channelData);
          dataToDB.validatePurchaseData(
            {
              thumbnail: channelData?.updatedData[0]?.thumbnail || "",
              email: response?.[0] || "",
              channelName: channelData?.updatedData[0]?.title || "",
              uses: 1,
            },
            userData?.user?.user_id,
            csrfToken
          );
        }
        console.log(response);
        setBtnsState((prev) => ({
          ...prev,
          [buttonId]: {
            isProcessing: false,
            class: response.length === 0 ? "fail" : "success", //тут был result
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
    } else {
      toast.error(t("You have no uses!"));
      return;
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
              {isLoggedIn && channelData
                ? channelData?.updatedData?.[0]?.title
                : "?"}
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
                  {isLoggedIn && channelData
                    ? channelData?.updatedData?.[0]?.targetAudience
                    : "?"}
                </h4>
                <h4 className="statistic none">
                  {isLoggedIn && channelData
                    ? channelData?.updatedData?.[0]?.subsCount
                    : "?"}
                </h4>
                <h4 className="statistic none">
                  {isLoggedIn && channelData
                    ? channelData?.updatedData?.[0]?.genre
                    : "?"}
                </h4>
              </div>
            </div>
            <img
              src={
                (isLoggedIn && channelData?.updatedData?.[0]?.thumbnail) ||
                YoutuberImgOne
              }
              alt="youtuber"
              className="youtuber__image"
              loading="lazy"
            />
          </div>

          <button
            className={`youtuber__button ${btnsState[0]?.class || ""}`}
            onClick={() => {
              if (
                userData.channels &&
                userData.channels.some(
                  (channel) =>
                    channel.channel_name === channelData?.updatedData?.[0].title
                )
              ) {
                alreadyHave();
                return;
              } else {
                if (isLoggedIn) {
                  handleButtonClick(channelData?.updatedData?.[0], 0);
                } else {
                  toast.error(t("Log in firstly"));
                }
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
              {userData && SimilarChannelData
                ? SimilarChannelData?.channelStats?.title
                : "?"}
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
                  {userData && SimilarChannelData
                    ? SimilarChannelData?.channelStats?.targetAudience
                    : "?"}
                </h4>
                <h4 className="statistic none">
                  {userData && SimilarChannelData
                    ? SimilarChannelData?.channelStats?.subs
                    : "?"}
                </h4>
                <h4 id="contentType" className="statistic none">
                  {userData && SimilarChannelData
                    ? SimilarChannelData?.channelStats?.contenttype
                    : "?"}
                </h4>
              </div>
            </div>
            <img
              loading="lazy"
              src={
                (userData && SimilarChannelData?.channelStats?.thumbnail) ||
                YoutuberImgTwo
              }
              alt="youtuber"
              className="youtuber__image"
            />
          </div>

          <button
            className={`youtuber__button ${btnsState[1]?.class || ""}`}
            onClick={() => {
              if (
                userData.channels &&
                userData.channels.some(
                  (channel) =>
                    channel.channel_name ===
                    SimilarChannelData?.channelStats?.title
                )
              ) {
                alreadyHave();
                return;
              } else {
                console.log("SimilarChannelData:", SimilarChannelData);
                if (isLoggedIn) {
                  handleButtonClick(SimilarChannelData.channelStats, 1);
                } else {
                  toast.error(t("Log in firstly"));
                  return;
                }
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
    </>
  );
};

export default YoutuberBlock;
