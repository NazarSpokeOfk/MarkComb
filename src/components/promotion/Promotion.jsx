import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { toast } from "react-toastify";

import "./Promotion.css";
import SmoothEffect from "../smoothText";

import buttonIcon from "../../icons/morefilters.png";
import glass from "../../icons/magnifing_glass.png";
import like from "../../icons/like.png";
import views from "../../icons/views.png";

const Promotion = ({ isLoggedIn, userData }) => {
  const [channelName, setChannelName] = useState("");
  const [videoData, setVideoData] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    console.log("videoData:", videoData);
  }, [videoData]);

  const secondYouTubersContainerRef = useRef(),
    triggerBtnRef = useRef(),
    titleRef = useRef(),
    inputRef = useRef(""),
    membersRef = useRef([]);

  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleToggle = () => {
    secondYouTubersContainerRef.current.classList.toggle("active");
    triggerBtnRef.current.classList.toggle("rotate");
  };

  setInterval(() => {
    if (titleRef.current) {
      titleRef.current.classList.add("active");
    }
  }, 50);

  let channelsFirstPart, channelsSecondPart;
  if (userData && userData?.channels?.length > 5) {
    channelsFirstPart = userData?.channels?.slice(0, 5);
    channelsSecondPart = userData?.channels?.slice(5);
  } else {
    channelsFirstPart = userData?.channels;
  }

  const toggleMemberListStyle = (index, currentGroup) => {
    const normalizedIndex = index + (currentGroup === 2 ? 5 : 0);
    setActiveIndex(normalizedIndex);
  };

  const promotionFetch = async (type, channelName, inputValue, videoId) => {
    const bodyData = {};
    if (channelName && inputValue) {
      bodyData.channelName = channelName;
      bodyData.inputValue = inputValue;
    } else if (videoId) {
      bodyData.videoId = videoId;
    } else {
      toast.error("Empty request")
      return Promise.reject()
    }
    console.log("Body data : " , bodyData)
    const result = await fetch(`http://localhost:5001/api/${type}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ bodyData }),
    });

    const response = await result.json()
    const finalVideoData = response?.finalVideoData;
    console.log("response :",response)
    if(finalVideoData){  
      setVideoData(finalVideoData)
    } else {
      const analitics = response?.analitics
      setVideoData((prevData) => ({ ...prevData, analitics }));
    }
  };

  const resultBlock = (videoData) => {
    return (
      <>
        {videoData ? (
          <div
            onClick={() => {
              promotionFetch("analitics",false,false,videoData.videoId);
              setIsExpanded(true);
            }}
            className={`search-suggested__block ${isExpanded ? "active" : ""}`}
          >
            <h2 className="suggested-block__name">{videoData?.title}</h2>
            <img
              loading="lazy"
              src={videoData?.thumbnail}
              alt="a video thumbnail"
              className={`suggested-block__img ${
                isExpanded ? "imgActive" : ""
              }`}
            />
            <h2 className="suggested-block__views">
              {" "}
              {videoData?.analitics && (
                <>
                  <img loading="lazy" src={views} alt="eye" className="views" />{" "}
                  <div className="views__text">{videoData?.analitics?.views}</div>
                </>
              )}
            </h2>
            <h2 className="suggested-block__likes">
              {videoData?.analitics && (
                <>
                  <img loading="lazy" src={like} alt="eye" className="like" />{" "}
                  <div className="likes__text">{videoData?.analitics?.likes}</div>
                </>
              )}
            </h2>
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
          <title>Promotion</title>
          <meta name="description" content="Here you can see how the content maker's video has progressed"/>
        </Helmet>
        <header>
          <div className="container">
            <div className="logo">
              <Link to="/">
                Mark<span>Comb</span>
              </Link>
            </div>
            <div className="header__links">
              <Link to="/purchases" className="header__link">
                {t("purc")}
                <span className="highlight">{t("hases")}</span>
              </Link>

              <Link to="/promotion" className="header__link">
                {t("prom")}
                <span>{t("otion")}</span>
              </Link>
              <Link to="/purchase" className="header__link">
                {t("purch")}
                <span>{t("ase")}</span>
              </Link>
            </div>
          </div>
        </header>

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
                    ref={(el) => (membersRef.current[index] = el)}
                    onClick={() => {
                      toggleMemberListStyle(index, 1);
                      setChannelName(channel?.channel_name);
                      setIsExpanded(false);
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
                  <p className="no_available">You have no purchases.</p>
                </>
              )}
              <br />
            </div>
            {userData ? (
              <button
                ref={triggerBtnRef}
                onClick={handleToggle}
                className="list-container__button"
              >
                <img className="more_youtubers" loading="lazy" src={buttonIcon} alt="moreyoutubers" />
              </button>
            ) : (
              ""
            )}

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
                : "Why are you clicked?"}
              <br />
            </div>
          </div>
        </section>

        <section className="search">
          <input type="text" className="search__input" ref={inputRef} />
          <button
            onClick={() => {
              const inputValue = inputRef.current.value;
              if (channelName) {
                toast
                  .promise(
                    promotionFetch("video",channelName, inputValue , false),
                    {
                      pending: "Searching video...",
                      success: "We found the video!",
                      error: "There is no such video in this channel",
                    }
                  )
              } else {
                toast.error("Log in firstly!");
              }
            }}
            className="search-input__button"
          >
            <img loading="lazy" src={glass} alt="find" />
          </button>

          {videoData?.title ? resultBlock(videoData) : ""}
        </section>

        <section id="promotion" className="footer">
          <div className="footer__container">
            <h3 className="footer__logo">MarkComb,2024</h3>
            <Link to="/terms" className="footer__terms">
              {t("Terms of service")}
            </Link>
            <Link to="/purpose" className="footer__purpose">
              {t("Our purpose")}
            </Link>
            <button
              onClick={() => {
                SmoothEffect().then(() => {
                  changeLanguage("ru");
                });
              }}
              className="footer__button"
            >
              Русский
            </button>
            <button
              onClick={() => {
                SmoothEffect().then(() => {
                  changeLanguage("en");
                });
              }}
              className="footer__button"
            >
              English
            </button>
          </div>
        </section>
      </HelmetProvider>
    </>
  );
};

export default Promotion;
