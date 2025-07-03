import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

import YoutuberBlockFunctions from "./functions/YoutuberBlockFunctions";

import { dataGettingState } from "../../interfaces/interfaces";

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

  const [dataGettingState, setDataGettingState] = useState<dataGettingState>({
    state: "default",
  });

  const { t } = useTranslation();

  const alreadyHave = () => {
    toast.warning(t("You already bought this data"));
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
                ) : !channelData.updatedData?.channel_name ? (
                  <div className="blur-shimmer" />
                ) : (
                  channelData?.updatedData?.channel_name
                )}
              </div>
            ) : (
              <div className="youtuber__name">
                {isLoggedIn && channelData
                  ? channelData?.updatedData?.channel_name
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
          className={`youtuber__button none ${
            {
              default: "",
              success: "success",
              fail: "fail",
            }[dataGettingState.state]
          }`}
          onClick={() => {
            console.log(channelData?.updatedData);
            if (
              userData.channels &&
              userData.channels.some(
                (channel) =>
                  channel?.channel_name ===
                  channelData?.updatedData?.channel_name
              )
            ) {
              alreadyHave();
              return;
            } else {
              if (isLoggedIn && channelData?.updatedData) {
                youtuberBlockFunctions.handleButtonClick({
                  updatedData: channelData,
                  buttonId,
                  setUserData,
                  isProcessingRef,
                  setDataGettingState,
                  dataGettingState,
                  userData,
                  csrfToken,
                  channelData,
                  setChannelData,
                });
              } else if (!isLoggedIn) {
                toast.error(t("Log in firstly"));
              }
            }
          }}
        >
          {
            {
              default: "Get data",
              success: "Check contact data in purchases",
              fail: "The YouTuber did not provide his email",
            }[dataGettingState.state]
          }
        </button>
      </div>
    </>
  );
};
export default YouTuberBlock;
