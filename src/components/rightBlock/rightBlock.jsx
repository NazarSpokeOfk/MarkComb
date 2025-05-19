import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";

import DataToDB from "../../dataToDB/dataToDB";

import "./rightBlock.css";

const RightBlock = ({
  isLoggedIn,
  userData,
  channelData,
  csrfToken,
  setUserData,
  setChannelData,
  isFilter,
  YoutuberImg
}) => {
  useEffect(() => {
    console.log("чаннел дата :", channelData);
  }, [channelData]);

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const isProcessingRef = useRef({});

  const [btnsState, setBtnsState] = useState({});

  const dataToDB = new DataToDB(true, setUserData);

  const { t, i18n } = useTranslation();

  const logInErrorToast = () => {
    toast.error(
      t("Firstly, find the youtuber whose contact details you want to get")
    );
  };

  const alreadyHave = () => {
    toast.warning(t("You already bought this data"));
  };

  const handleButtonClick = async (data, buttonId) => {
    //полный рефактор
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
        const result = await fetch(`${apiBaseUrl}/getemail`, {
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
              thumbnail: channelData?.updatedData?.thumbnail || "",
              email: response?.email || "",
              channelName: response?.name || "",
              uses: 1,
            },
            userData?.user?.user_id,
            csrfToken
          );
          setChannelData((prevState) => ({
            ...prevState,
            updatedData : {
              ...prevState.updatedData,
              title: response?.name,
            }
          }));
          console.log("channelData после прибавления имени : ", channelData);
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
              thumbnail: channelData?.updatedData?.thumbnail || "",
              email: response?.email || "",
              channelName: channelData?.updatedData?.title || "",
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
      <div
        className={`youtuber__block ${
          isLoggedIn && channelData ? "youtuber__block" : "pulse"
        }`}
      >
        <div className="youtuber__flex-subblock">
          <div className="youtuber__information">
            <div className="youtuber__name">
              {isLoggedIn && channelData
                ? channelData?.updatedData?.title
                : "?"}
            </div>

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
              (isLoggedIn && channelData?.updatedData?.thumbnail) ||
              YoutuberImg
            }
            alt="youtuber"
            className="youtuber__image"
            loading="lazy"
          />
        </div>
      </div>

      <button
        className={`youtuber__button ${btnsState[0]?.class || ""}`}
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
              let buttonId;
              if (isFilter) {
                buttonId = 1;
              } else {
                buttonId = 0;
              }
              handleButtonClick(channelData?.updatedData, buttonId);
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
    </>
  );
};
export default RightBlock;
