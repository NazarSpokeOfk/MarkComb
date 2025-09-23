import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import PromotionFunctions from "../../functions/PromotionFunctions";

import smoothScrollContainer from "../../../../utilities/smoothHorizontalScroll";
import SmoothVerticalScroll from "../../../../utilities/smoothVerticalScroll";

import {
  VideoData,
  CurrentAnalytics,
} from "../../../../interfaces/interfaces";
import { CommonTypes, HandleProps } from "../../../../types/types";

import "./PromotionInner.css";

import promotionThumbnail from "../../../../icons/promotionThumbnail.png";
import loading from "../../../../images/loading-gif.gif";
import searchIcon from "../../../../icons/searchIcon.png";

const PromotionInner = ({
  userData,
  isAnimating,
  setIsAnimating,
  setPage,
}: CommonTypes & HandleProps) => {
  const promotionFunctions = new PromotionFunctions();
  const [channelName, setChannelName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasOldAnalytics, setHasOldAnalytics] = useState<boolean>(false);
  const [showResults, setShowResults] = useState(false);
  const [currentAnalytics, setCurrentAnalytics] =
    useState<CurrentAnalytics | null>(null);

  const searchSectionRef = useRef<HTMLInputElement | null>(null);
  const resultBlockRef = useRef<HTMLDivElement | null>(null);

  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<HTMLDivElement[]>([]);

  const { t } = useTranslation();

  setInterval(() => {
    if (titleRef.current) {
      titleRef.current.classList.add("titleActive");
    }
  }, 50);

  useEffect(() => {
    if (userData.channels.length <= 0) {
      const observer = SmoothVerticalScroll({});
      return () => {
        observer.disconnect();
      };
    }
    // delay for correct display of blocks
    let timeout: ReturnType<typeof setTimeout>;
    timeout = setTimeout(() => {
      smoothScrollContainer({
        containerRef: scrollContainerRef,
        contentRefs,
      });
    }, 10);
    return () => {
      clearTimeout(timeout);
    };
  }, [userData.channels]);


  const resultBlock = (videoData: VideoData) => {
    return (
      <>
        <div ref={resultBlockRef} className="result__block-promotion">
          <div className="result__title-block">
            <h2 className="result__block-title_promotion">{t("Title")}</h2>
            <h3 className="result__block-subtitle_promotion">
              {videoData.title}
            </h3>
          </div>

          <div className="result__block-subblock">
            <div className="card-top"></div>
            <h2 className="result__block-title_promotion">{t("Views")}</h2>
            <h3 className="result__block-subtitle_promotion">
              {currentAnalytics?.views}
            </h3>
          </div>

          <img
            referrerPolicy="no-referrer"
            src={videoData.thumbnail}
            alt=""
            className="result__block-videoimage"
          />

          <div className="result__block-subblock">
            <div className="card-top"></div>
            <h2 className="result__block-title_promotion">{t("Likes")}</h2>
            <h3 className="result__block-subtitle_promotion">
              {currentAnalytics?.likes}
            </h3>
          </div>

          <div className="result__block-subblock">
            <div className="card-top"></div>
            <h2 className="result__block-title_promotion">{t("Comments")}</h2>
            <h3 className="result__block-subtitle_promotion">
              {currentAnalytics?.comments}
            </h3>
          </div>

          {hasOldAnalytics ? (
            <button
              onClick={() =>
                promotionFunctions.handleNext({
                  isAnimating,
                  setIsAnimating,
                  setPage,
                })
              }
              id="detailed__analytics-button"
              className="fancy-button"
            >
              {t("view detailed analytics")}
            </button>
          ) : null}
        </div>
      </>
    );
  };

  return (
    <>
      <section className="list">
        {userData.channels.length > 0 ? (
          <>
            <h1 ref={titleRef} className="title_promotion none">
              {t("promo")}
              <span>{t("tion")}</span>
            </h1>
            <div className="cards__overflow-wrapper">
              <div ref={scrollContainerRef} className="cards__flex-container">
                {userData.channels.map((channel, index) => {
                  return (
                    <div
                      onClick={() => {
                        promotionFunctions.onCardClickActions({
                          resultBlockRef,
                          setVideoData,
                          setInputValue,
                          setChannelName,
                          channel,
                          setShowSearch,
                          contentRefs,
                          index,
                          setShowResults,
                        });
                      }}
                      ref={(el) => {
                        if (el) contentRefs.current[index] = el;
                      }}
                      key={index}
                      className={`card item`}
                    >
                      <img
                        referrerPolicy="no-referrer"
                        src={channel.thumbnail}
                        alt=""
                        className="card__image"
                      />
                      <h3 className="card__name">{channel.channel_name}</h3>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="promotion__thumbnail-flex moving__in-class_initial-state">
            <img
              src={promotionThumbnail}
              className="promotion__thumbnail"
              alt=""
            />
            <h1 className="promotion__thumbnail-title">
              {t("You can check out")} <br />{" "}
              <span>{t("youtubers' video stats here")}.</span>
            </h1>
          </div>
        )}
      </section>

      <section
        ref={searchSectionRef}
        className={`promotion-search ${showSearch ? "appearing" : ""}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          action="submit"
        >
          <div className="promotion__input-block">
            <input
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                setInputValue(value);
              }}
              type="text"
              className="promotion__input"
            />
            <button
              onClick={() => {
                promotionFunctions.validateVideoFinding({
                  channelName,
                  inputValue,
                  setVideoData,
                  setIsLoading,
                  setCurrentAnalytics,
                  setHasOldAnalytics,
                });
              }}
              className="promotion__search-btn"
            >
              <img
                className="promotion__search-btn_img"
                src={isLoading ? loading : searchIcon}
                alt=""
              />
            </button>
          </div>
        </form>
      </section>
      <div
        className={`result__wrapper ${showResults ? "expanded" : ""}`}
        ref={resultBlockRef}
      >
        {videoData && resultBlock(videoData)}
      </div>
    </>
  );
};
export default PromotionInner;
