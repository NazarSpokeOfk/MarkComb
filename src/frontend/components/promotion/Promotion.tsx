import { useTranslation } from "react-i18next";
import { useRef, useEffect, useState, TimeHTMLAttributes } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import "./Promotion.css";

import PromotionFunctions from "./functions/PromotionFunctions";

import smoothScrollContainer from "../../utilities/smoothHorizontalScroll";
import SmoothVerticalScroll from "../../utilities/smoothVerticalScroll";

import { CommonTypes } from "../../types/types";

import { CurrentAnalytics, VideoData } from "../../interfaces/interfaces";

import searchIcon from "../../icons/searchIcon.png";
import promotionThumbnail from "../../icons/promotionThumbnail.png";

import Loading from "../../images/loading-gif.gif";

const Promotion = ({ isLoggedIn, userData }: CommonTypes) => {
  const promotionFunctions = new PromotionFunctions();
  const [channelName, setChannelName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState(false);
  const [currentAnalytics,setCurrentAnalytics] = useState<CurrentAnalytics | null>(null)

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
  }, [userData.channels]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    timeout = setTimeout(() => {
      smoothScrollContainer({
        containerRef: scrollContainerRef,
        contentRefs,
      });
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (videoData) {
      setShowResults(true);
      timeout = setTimeout(() => {
        resultBlockRef.current?.classList.add("appearing");
      }, 100);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [videoData?.videoId]);

  useEffect(() => {
    if (showSearch === true) {
      searchSectionRef.current?.classList.add("appearing");
    }
  }, [showSearch]);

  const resultBlock = (videoData: VideoData) => {
    return (
      <>
        <div ref={resultBlockRef} className="result__block-promotion">
          <div id="first__subblock" className="result__block-subblock">
            <h2 className="result__block-title_promotion">{t("Title")}</h2>
            <h3 className="result__block-subtitle_promotion">
              {videoData.title}
            </h3>
          </div>

          <div id="second__subblock" className="result__block-subblock">
            <h2 className="result__block-title_promotion">{t("Statistic")}</h2>
            <h3 className="result__block-subtitle_promotion">
              {t("On today")}
            </h3>
          </div>

          <img
            referrerPolicy="no-referrer"
            src={videoData.thumbnail}
            alt=""
            className="result__block-videoimage"
          />

          <div id="third__subblock" className="result__block-subblock">
            <div className="card-top"></div>
            <h2 className="result__block-title_promotion">{t("Likes")}</h2>
            <h3 className="result__block-subtitle_promotion">
              {currentAnalytics?.likes}
            </h3>
          </div>

          <div id="fourth__subblock" className="result__block-subblock">
            <div className="card-top"></div>
            <h2 className="result__block-title_promotion">{t("Views")}</h2>
            <h3 className="result__block-subtitle_promotion">
              {currentAnalytics?.views}
            </h3>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Promotion")}</title>
          <meta
            name="description"
            content="Here you can see how the content maker's video has progressed"
          />
        </Helmet>

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

        <section ref={searchSectionRef} className="promotion-search">
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
                    setCurrentAnalytics
                  });
                }}
                className="promotion__search-btn"
              >
                <img
                  className="promotion__search-btn_img"
                  src={isLoading ? Loading : searchIcon}
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
      </HelmetProvider>
    </>
  );
};

export default Promotion;
