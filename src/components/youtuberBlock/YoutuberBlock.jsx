import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";

import FeedbackForm from "../modal/FeedbackForm";

import Footer from "../footer/Footer";

import DataToDB from "../../dataToDB/dataToDB";

import "./YoutuberBlock.css";
import "react-toastify/dist/ReactToastify.css";

import YoutuberImgOne from "../../images/YouTuber.jpg";
import YoutuberImgTwo from "../../images/Youtubertow.jpg";
import Envelope from "../../icons/email.svg";

const YoutuberBlock = ({
  channelData,
  SimilarChannelData,
  setSimilarChannelData,
  userData,
  isLoggedIn,
  setUserData,
  csrfToken,
}) => {
  const { t, i18n } = useTranslation();

  const [btnsState, setBtnsState] = useState({});
  const [isFeedbackWillBeWrited, setIsFeedbackWillBeWrited] = useState(false);

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
        const result = await fetch("https://owa.markcomb.com/api/getemail", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            "x-csrf-token": csrfToken,
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ channelId: data.channelId }),
        });
        const response = await result.json();

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
          dataToDB.validatePurchaseData(
            {
              thumbnail: SimilarChannelData?.channelStats?.thumbnail || "",
              email: response?.email || "",
              channelName: response?.name || "",
              uses:1
            },
            userData?.user?.user_id,
            csrfToken
          );
          setSimilarChannelData((prevState) => ({
            ...prevState,
            title: response?.name,
          }));
          setBtnsState((prev) => ({
            ...prev,
            [buttonId]: {
              isProcessing: false,
              class: response?.email?.length === 0 ? "fail" : "success",
            },
          }));
        } else {
          dataToDB.validatePurchaseData(
            {
              thumbnail: channelData?.updatedData[0]?.thumbnail || "",
              email: response?.email || "",
              channelName: channelData?.updatedData[0]?.title || "",
              uses: 1,
            },
            userData?.user?.user_id,
            csrfToken
          );
          setBtnsState((prev) => ({
            ...prev,
            [buttonId]: {
              isProcessing: false,
              class: response?.email?.length === 0 ? "fail" : "success",
            },
          }));
        }
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
            <div
              className="youtuber__name none"
            >
              {!SimilarChannelData ? (
                "?"
              ) : !SimilarChannelData.title ? (
                <div className="blur-shimmer" />
              ) : (
                SimilarChannelData.title
              )}
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
              console.log("Юзердата так называемая  :", userData);
              console.log(SimilarChannelData);
              if (
                userData.channels &&
                userData.channels.some(
                  (channel) =>
                    channel.channel_name === SimilarChannelData?.title
                )
              ) {
                alreadyHave();
                return;
              } else {
                if (isLoggedIn && !SimilarChannelData) {
                  toast.warn(
                    t("Select channel, which contact data you wanna get")
                  );
                } else if (isLoggedIn) {
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

      <section className="feedback">
        <div className="container">
          <button
            onClick={() => {
              setIsFeedbackWillBeWrited((prev) => !prev);
            }}
            className="feedback__button"
          >
            <img
              src={Envelope}
              alt="Please,send us a feedback!"
              className="feedback__button-envelope"
            />
          </button>
        </div>
      </section>

      <FeedbackForm
        isFeedbackWillBeWrited={isFeedbackWillBeWrited}
        setIsFeedbackWillBeWrited={setIsFeedbackWillBeWrited}
      />

    <Footer/>        
    </>
  );
};

export default YoutuberBlock;
