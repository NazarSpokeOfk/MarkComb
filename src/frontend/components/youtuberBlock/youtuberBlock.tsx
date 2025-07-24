import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { toast, ToastIcon } from "react-toastify";

import YoutuberBlockFunctions from "./functions/YoutuberBlockFunctions";

import { YouTuberBlockProps } from "../../types/types";

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
  buttonId,
}: YouTuberBlockProps) => {
  const youtuberBlockFunctions = new YoutuberBlockFunctions();

  const isProcessingRef = useRef<Record<number, boolean>>({});

  const resultBlockRef = useRef<HTMLDivElement | null>(null);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState<"get data" | "✅" | "❌">(
    "get data"
  );

  const [contactDataStatus, setContactDataStatus] = useState<
    "default" | "fail" | "success"
  >("default");

  const { t } = useTranslation();

  const showErrorToast = (message: string | null, icon: ToastIcon) => {
    if (!message) return;
    toast(t(message), {
      icon,
      hideProgressBar: true,
      theme: "dark",
      autoClose: 5000,
    });
  };

  useEffect(() => {
    if (channelData) {
      resultBlockRef.current?.classList.add("appearing");
    }
    if (!channelData) {
      resultBlockRef.current?.classList.remove("appearing");
    }
  }, [channelData]);

  useEffect(() => {
    showErrorToast(error, <>❌</>);
  }, [error]);

  useEffect(() => {
    if (contactDataStatus !== "default") {
      youtuberBlockFunctions.clickAnimation({
        contactDataStatus,
        setButtonText,
        buttonRef,
      });
    }
  }, [contactDataStatus]);

  return (
    <>
      <div ref={resultBlockRef} className="youtuber__block">
        <div className="youtuber__logo">
          <img
            src={channelData?.updatedData.thumbnail}
            alt={`${channelData?.updatedData.channel_name} logo`}
            className="youtuber__logo-img"
          />
        </div>

        <div className="youtuber__info-block">
          <h1
            className={`youtuber__info-channel_name ${
              !channelData?.updatedData.channel_name ? "blur-shimmer" : ""
            }`}
          >
            {channelData?.updatedData.channel_name}
          </h1>

          <div className="youtuber__info-cards">
            <div className="youtuber__info-card">
              <div className="youtuber__info-card_head"></div>
              <h3 className="youtuber__info-card_title">
                {t("Target audience")}
              </h3>
              <h4 className="youtuber__info-card_subtitle">
                {channelData
                  ? t(channelData?.updatedData.targetAudience)
                  : null}
              </h4>
            </div>
            <div className="youtuber__info-card">
              <div className="youtuber__info-card_head"></div>
              <h3 className="youtuber__info-card_title">
                {t("Number of subs")}
              </h3>
              <h4 className="youtuber__info-card_subtitle">
                {channelData?.updatedData.subsCount}
              </h4>
            </div>
            <div className="youtuber__info-card">
              <div className="youtuber__info-card_head"></div>
              <h3 className="youtuber__info-card_title">{t("Content type")}</h3>
              <h4 className="youtuber__info-card_subtitle">
                {channelData ? t(channelData?.updatedData.content_type) : null}
              </h4>
            </div>
          </div>

          <button
            ref={buttonRef}
            data-status={contactDataStatus}
            onClick={() => {
              youtuberBlockFunctions.handleButtonClick({
                updatedData: channelData,
                setUserData,
                isProcessingRef,
                userData,
                csrfToken,
                channelData,
                setChannelData,
                setError,
                setContactDataStatus,
              });
            }}
            className="youtuber__block-button"
          >
            <span>{t(buttonText)}</span>
          </button>
        </div>
      </div>
    </>
  );
};
export default YouTuberBlock;
