import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

import DataToDB from "../../dataToDB/dataToDB";

import "./youtuberBlock.css";

const YouTuberBlock = ({
  isLoggedIn,
  userData,
  channelData,
  csrfToken,
  setUserData,
  setChannelData,
  isFilter,
  YoutuberImg,
  buttonId
}) => {

  const isProcessingRef = useRef({});

  const [btnsState, setBtnsState] = useState({});

  const dataToDB = new DataToDB(true, setUserData);

  const { t } = useTranslation();

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

    setBtnsState((prev) => ({
      ...prev,
      [buttonId]: { isProcessing: true },
    }));

    
    if (btnsState[buttonId]?.isProcessing) return;

    if (userData.userInformation.uses > 0) {
      try {

        const response = await dataToDB.getEmail(csrfToken,data.channelId)

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
              thumbnail: channelData?.updatedData?.thumbnail || "",
              email: response?.email || "",
              channelName: response?.name || "",
              uses: 1,
            },
            userData?.userInformation?.user_id,
            csrfToken
          );
          setChannelData((prevState) => ({
            ...prevState,
            updatedData: {
              ...prevState.updatedData,
              title: response?.name,
            },
          }));
          console.log(`Текущий buttonId : ${buttonId}, response.email = ${response?.email}`)
          setBtnsState((prev) => ({
            ...prev,
            [buttonId]: {
              isProcessing: false,
              class: !response?.email ? "fail" : "success",
            },
          }));
        } else {
          dataToDB.validatePurchaseData(
            {
              thumbnail: channelData?.updatedData?.thumbnail || "",
              email: response?.email || "",
              channelName: channelData?.updatedData?.title || "",
              uses: 1,
            },
            userData?.userInformation?.user_id,
            csrfToken
          );
          setBtnsState((prev) => ({
            ...prev,
            [buttonId]: {
              isProcessing: false,
              class: !response?.email ? "fail" : "success",
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
      <div
        className={`youtuber__block ${
          isLoggedIn && channelData ? "youtuber__block" : "pulse"
        }`}
      >
        <div className="youtuber__flex-subblock">
          <div className="youtuber__information">
            {isFilter ? (
              <div className="youtuber__name none">
                {!channelData ? (
                  "?"
                ) : !channelData.updatedData?.title ? (
                  <div className="blur-shimmer" />
                ) : (
                  channelData?.updatedData?.title
                )}
              </div>
            ) : (
              <div className="youtuber__name">
                {isLoggedIn && channelData
                  ? channelData?.updatedData?.title
                  : "?"}
              </div>
            )}

            <h4 className="youtuber__info">{t("Target Audience")}</h4>
            <span className="youtuber__dash">-</span>
            <h4 className="youtuber__info">
              {isLoggedIn && channelData
                ? channelData?.updatedData?.targetAudience
                : "?"}
            </h4>

            <h4 className="youtuber__info">{t("Number of subs")}</h4>
            <span className="youtuber__dash">-</span>
            <h4 className="youtuber__info">
              {isLoggedIn && channelData
                ? channelData?.updatedData?.subsCount
                : "?"}
            </h4>

            <h4 className="youtuber__info">{t("Content type")}</h4>
            <span className="youtuber__dash">-</span>
            <h4 className="youtuber__info">
              {isLoggedIn && channelData
                ? channelData?.updatedData?.contenttype
                : "?"}
            </h4>
          </div>

          <img
            src={
              (isLoggedIn && channelData?.updatedData?.thumbnail) || YoutuberImg
            }
            alt="youtuber"
            className="youtuber__image"
            loading="lazy"
          />
        </div>
        <button
        className={`youtuber__button ${btnsState[buttonId]?.class || ""}`}
        onClick={() => {
          if (
            userData.channels &&
            userData.channels.some(
              (channel) =>
                channel.channel_name === channelData?.updatedData?.title
            )
          ) {
            alreadyHave();
            return;
          } else {
            if (isLoggedIn) {
              handleButtonClick(channelData?.updatedData, buttonId);
            } else {
              toast.error(t("Log in firstly"));
            }
          }
        }}
      >
        {btnsState[buttonId]?.class === "success"
          ? t("Check contact data in purchases.")
          : btnsState[buttonId]?.class === "fail"
          ? t("Unfortunantly,we can't get contact data.")
          : `${t("Get")} ${t("data")}`}
      </button>
      </div>
    </>
  );
};
export default YouTuberBlock;
