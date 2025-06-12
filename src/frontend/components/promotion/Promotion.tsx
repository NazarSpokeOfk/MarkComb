import { useTranslation } from "react-i18next";
import { useRef, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useMediaQuery } from "react-responsive";

import "./Promotion.css";

import DataToDB from "../../dataToDB/dataToDB";

import { CommonTypes } from "../../types/types";

import { VideoData } from "../../interfaces/interfaces";

import buttonIcon from "../../icons/morefilters.png";
import glass from "../../icons/magnifing_glass.png";
import like from "../../icons/like.svg";
import views from "../../icons/eye.svg";

const Promotion = ({ isLoggedIn, userData }: CommonTypes) => {
  const [channelName, setChannelName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const dataToDb = new DataToDB({
    setVideoData,
  });

  const isMobile = useMediaQuery({ maxWidth: 480 });

  const secondYouTubersContainerRef = useRef<HTMLDivElement | null>(null),
    triggerBtnRef = useRef<HTMLButtonElement | null>(null),
    titleRef = useRef<HTMLHeadingElement | null>(null),
    membersRef = useRef<(HTMLHeadingElement | null)[]>([]),
    inputRef = useRef<HTMLInputElement | null>(null);

  const { t } = useTranslation();

  const handleToggle = () => {
    secondYouTubersContainerRef?.current?.classList.toggle("active");
    triggerBtnRef?.current?.classList.toggle("rotate");
  };

  setInterval(() => {
    if (titleRef.current) {
      titleRef.current.classList.add("titleActive");
    }
  }, 50);

  let channelsFirstPart, channelsSecondPart;

  if (userData && userData?.channels?.length > 5) {
    channelsFirstPart = userData?.channels?.slice(0, 5);
    channelsSecondPart = userData?.channels?.slice(5);
  } else {
    channelsFirstPart = userData?.channels;
  }

  const toggleMemberListStyle = (index: number, currentGroup: number) => {
    const normalizedIndex = index + (currentGroup === 2 ? 5 : 0);
    setActiveIndex(normalizedIndex);
  };

  useEffect(() => {
    console.log("videoData :", videoData);
  }, [videoData]);

  useEffect(() => {
    if (!videoData?.analitics && videoData?.videoId) {
      dataToDb.checkStatisticsOfVideo(
        "analitics",
        channelName,
        inputValue,
        videoData?.videoId
      );
    }
  }, [videoData?.videoId]);

  const validateVideoFinding = () => {
    if (channelName && inputValue) {
      dataToDb.checkStatisticsOfVideo("video", channelName, inputValue, null);
    } else {
      return;
    }
  };

  const resultBlock = (videoData: VideoData) => {
    return (
      <>
        {videoData ? (
          <div
            className="search-suggested__block"
          >
            <div className="suggested__block-flex">
              <div className="suggested__block-subflex">
                <h2 className="suggested-block__name">{videoData?.title}</h2>

                <h3 className="suggested-block__title">{t("Statistic")}</h3>

                <div className="suggested__block-stats_grid">
                  <img loading="lazy" src={like} alt="like" className="like" />
                  <img
                    loading="lazy"
                    src={views}
                    alt="views"
                    className="views"
                  />

                  <div className="analitics__text">
                    {videoData?.analitics?.likes}
                  </div>
                  <div className="analitics__text">
                    {videoData?.analitics?.views}
                  </div>
                </div>
              </div>
              <img
                loading="lazy"
                src={videoData?.thumbnail}
                alt="a video thumbnail"
                className={`suggested-block__img`}
              />
            </div>
          </div>
        ) : (
          <h2>Look for something!</h2>
        )}
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
          <div className="container">
            <h1 ref={titleRef} className="title_promotion none">
              {t("li")}
              <span>{t("st")}</span>
            </h1>
            <div className="list__container">
              {isLoggedIn && channelsFirstPart ? (
                channelsFirstPart.map((channel, index) => (
                  <h2
                    key={index}
                    ref={(el) => {
                      membersRef.current[index] = el;
                    }}
                    onClick={() => {
                      toggleMemberListStyle(index, 1);
                      setChannelName(channel?.channel_name);
                    }}
                    className={`list-container__member ${
                      activeIndex === index ? "active" : ""
                    }`}
                  >
                    {channel?.channel_name}
                  </h2>
                ))
              ) : (
                <>
                  <p className="no_available">{t("You have no purchases.")}</p>
                </>
              )}
              <br />
            </div>
            <div
              ref={secondYouTubersContainerRef}
              className="list__container__more"
            >
              {isLoggedIn && channelsSecondPart
                ? channelsSecondPart.map((channel, index) => (
                    <h2
                      onClick={() => {
                        toggleMemberListStyle(index, 2);
                        setChannelName(channel?.channel_name);
                      }}
                      key={index}
                      className={`list-container__member ${
                        activeIndex === index + 5 ? "active" : ""
                      }`}
                    >
                      {channel?.channel_name}
                    </h2>
                  ))
                : ":)"}
              <br />
            </div>
          </div>
        </section>

        <section className="search">
          <div className="promotion__search-flex">
            <input
              type="text"
              className="search__input"
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                setInputValue(value);
              }}
              placeholder={
                isMobile
                  ? t("Search video of selected YouTuber")
                  : t("Search for any video of selected YouTuber")
              }
            />
            <div className="promotion__buttons-flex">
              {userData ? (
                <button
                  ref={triggerBtnRef}
                  onClick={handleToggle}
                  className="list-container__button"
                >
                  <img
                    className="more_youtubers"
                    loading="lazy"
                    src={buttonIcon}
                    alt="moreyoutubers"
                  />
                </button>
              ) : (
                ""
              )}
              <button
                onClick={() => {
                  validateVideoFinding();
                }}
                className="search-input__button"
              >
                <img loading="lazy" src={glass} alt="find" />
              </button>
            </div>
          </div>
          {videoData?.title ? resultBlock(videoData) : ""}
        </section>

      </HelmetProvider>
    </>
  );
};

export default Promotion;
