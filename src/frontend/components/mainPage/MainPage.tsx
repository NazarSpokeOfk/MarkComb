import ScrollLine from "./components/scrollLine/scrollLine";
import smoothScrollContainer from "../../utilities/smoothHorizontalScroll";
import smoothVerticalScroll from "../../utilities/smoothVerticalScroll";

import { useEffect, useRef } from "react";

import { Link } from "react-router-dom";

import { MainPageProps } from "../../types/types";

import searchIcon from "../../icons/searchIcon.png";
import lightPackageIcon from "../../icons/lightPackageIcon.png";
import mediumPackageIcon from "../../icons/mediumPackageIcon.png";
import bigPackageIcon from "../../icons/bigPackageIcon.png";
import businessPackageIcon from "../../icons/businessIcon.png";
import usesIcon from "../../icons/usesIcon.png";
import coinIcon from "../../icons/coinIcon.png";
import arrowIcon from "../../icons/arrowIcon.png";
import minusOneIcon from "../../icons/minusOneIcon.png";
import filterSectionGlassEffectImg from "../../images/filterSectionGlassEffectImg.png";
import filterSectionGlassEffectImgEN from "../../images/filterSectionGlassEffectImgEN.png";

import videoThumbnailImage from "../../images/videoThumbnailImage.png";

import { useTranslation } from "react-i18next";

import "./MainPage.css";

const MainPage = ({ setIsFilterCTAActive }: MainPageProps) => {
  const { t, i18n } = useTranslation();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRefs = useRef<HTMLDivElement[]>([]);

  const testRef = useRef<HTMLDivElement | null>(null);

  const packages = {
    Light: {
      packageId: 1,
      uses: 10,
      icon: lightPackageIcon,
      price: 500,
      information: "You will get 10 uses,instant delivery time",
    },
    Medium: {
      packageId: 2,
      uses: 50,
      icon: mediumPackageIcon,
      price: 1500,
      information: "You will get 50 uses,instant delivery time",
    },
    Big: {
      packageId: 3,
      uses: 75,
      icon: bigPackageIcon,
      price: 2500,
      information: "You will get 75 uses,instant delivery time",
    },
    Business: {
      packageId: 4,
      uses: "5 uses per day",
      icon: businessPackageIcon,
      price: 4500,
      information:
        "You will receive 5 uses per day (00:00 Moscow time) for 30 days",
    },
  };

  const startSectionBlocks = {
    1: {
      title: "Niche ",
      id: 1,
    },
    2: {
      title: "Familiar ",
      id: 2,
    },
    3: {
      title: "Reliable",
      id: 3,
    },
  };

  useEffect(() => {
    smoothScrollContainer({
      containerRef,
      contentRefs,
    });
  }, []);

  useEffect(() => {
    const observer = smoothVerticalScroll({ ElementWhichMustMoveOut: testRef });
    
    return () => {
      observer.disconnect();
    }
  },[]);

  return (
    <>
      <section className="start__section">
        <div className="start__section-flex">
          <h1 className="start__section-text moving__in-class_initial-state">
            {t("Find")} <br />
            {t("youtubers")} <br />
            {t("that match")}
            <br />
            <span>{t("your needs")}</span>
          </h1>

          <div className="start__section-blocks_flex">
            {Object.entries(startSectionBlocks).map(([_, data]) => (
              <div
                id={`start-${data.id}__section-block`}
                key={data.id}
                className="start__section-block"
              >
                <p>{t(data.title)}</p>
              </div>
            ))}
          </div>
        </div>

        <svg
          className="waves mirror-x"
          viewBox="0 0 1300 700"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient
              id="waveGradient"
              x1="600"
              y1="0"
              x2="1150"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ff1a1a" />
              <stop offset="100%" stopColor="#6b0000" />
            </linearGradient>
          </defs>

          <path
            d="M 740 -80 C 540 200 940 400 740 680"
            className="wave-path wave-1"
          />
          <path
            d="M 810 -80 C 610 200 1010 400 810 680"
            className="wave-path wave-2"
          />
          <path
            d="M 880 -80 C 680 200 1080 400 880 680"
            className="wave-path wave-3"
          />
          <path
            d="M 950 -80 C 750 200 1150 400 950 680"
            className="wave-path wave-4"
          />
          <path
            d="M 1020 -80 C 820 200 1220 400 1020 680"
            className="wave-path wave-5"
          />
          <path
            d="M 1090 -80 C 890 200 1290 400 1090 680"
            className="wave-path wave-6"
          />
        </svg>
      </section>

      <section className="filter__section">
        <img
          className="filterSectionGlassEffectImg"
          src={
            i18n.language === "ru"
              ? filterSectionGlassEffectImg
              : filterSectionGlassEffectImgEN
          }
          alt=""
        />
        <div className="line__section">
          <h3 id="first__line-text" className="filter__line-text">
            {t("Content type")}
          </h3>
          <div className="filter__line">
            <ScrollLine
              stringArray={[
                "Education",
                "Comedy",
                "Fitness",
                "Vlogs",
                "Animation",
                "Games",
                "News",
                "Music",
                "Fashion",
                "Travel",
                "Health",
              ]}
              toRight={false}
              setIsFilterCTAActive={setIsFilterCTAActive}
            />
          </div>
        </div>

        <h3 className="filter__line-text">{t("Target audience")}</h3>
        <div className="filter__line-white">
          <ScrollLine
            stringArray={["Kids", "Teenagers", "Adults", "OlderGen"]}
            toRight={true}
            setIsFilterCTAActive={setIsFilterCTAActive}
          />
        </div>

        <div className="line__section">
          <h3 className="filter__line-text">{t("Number of subs")}</h3>
          <div className="filter__line">
            <ScrollLine
              stringArray={[
                "0-1K",
                "1-10K",
                "10-100K",
                "100-500K",
                "1-5M",
                "5-10M",
                "10-20M",
              ]}
              toRight={false}
              setIsFilterCTAActive={setIsFilterCTAActive}
            />
          </div>
        </div>
      </section>

      <section className="purchase__section">
        <h2 className="purchase__section-title moving__in-class_initial-state">
          {t("Purchase uses ")} <br />
          {t("to get youtuber email")}
        </h2>
        <div className="purchase__exchange-flex">
          <img src={coinIcon} alt="" className="purchase__exchange-coin" />
          <img src={arrowIcon} alt="" className="purchase__exchange-arrow" />
          <img src={usesIcon} alt="" className="purchase__exchange-usecoin" />
        </div>

        <section ref={containerRef} className="package" id="main__page">
          {Object.entries(packages).map(([name, data]) => (
            <div
              key={data.packageId}
              ref={(el) => {
                if (el) {
                  contentRefs.current[data.packageId] = el;
                }
              }}
              className="package__card item"
            >
              <div className="package__info">
                <div>
                  <h2 className="package__title">{t(name)}</h2>
                  <h3 className="package__subtitle">
                    {data.packageId !== 4 ? data.uses : t("5 uses per day")}{" "}
                    {data.packageId !== 4 ? t("uses") : null}
                  </h3>
                </div>
                <Link to="/purchase">
                  <button className="package__button">{t("Purchase")}</button>
                </Link>
              </div>

              <img
                src={data.icon}
                alt={`${name} package icon`}
                className="package__img"
              />
            </div>
          ))}
        </section>

        <div className="purchase__section-last_flex moving__in-class_initial-state">
          <h3 className="purchase__section-last_text">
            {t("Once you find out the")} <br />
            {t("YouTuber's email")} <br />
            {t("address, we will deduct 1")} <br />
            {t("use from your account.")}
          </h3>
          <img
            src={minusOneIcon}
            alt=""
            className="purchase__section-last_img"
          />
        </div>
      </section>

      <section className="promotion__section">
        <div className="promotion__section-line">
          <h2 className="promotion__line-text">
            {t(
              "TRACK THE PROGRESS OF YOUTUBERS' VIDEOS WHOSE EMAILS YOU HAVE RECEIVED"
            )}
          </h2>
        </div>

        <div id="promotion-input__main_page" className="promotion__input-block">
          <input
            readOnly
            value={"rocket mansplain"}
            type="text"
            className="promotion__input"
          />
          <button className="promotion__search-btn">
            <img
              className="promotion__search-btn_img"
              src={searchIcon}
              alt=""
            />
          </button>
        </div>
        <div className="result__block-promotion moving__in-class_initial-state">
          <div id="first__subblock" className="result__block-subblock">
            <h2 className="result__block-title_promotion">Title</h2>
            <h3 className="result__block-subtitle_promotion">
              ROCKET - Mansplain | Реакция и ...
            </h3>
          </div>

          <div id="second__subblock" className="result__block-subblock">
            <h2 className="result__block-title_promotion">{t("Statistic")}</h2>
            <h3 className="result__block-subtitle_promotion">
              {t("On today")}
            </h3>
          </div>

          <img
            src={videoThumbnailImage}
            alt=""
            className="result__block-videoimage"
          />

          <div id="third__subblock" className="result__block-subblock">
            <div className="card-top"></div>
            <h2 className="result__block-title_promotion">{t("Likes")}</h2>
            <h3 className="result__block-subtitle_promotion">5678</h3>
          </div>

          <div id="fourth__subblock" className="result__block-subblock">
            <div className="card-top"></div>
            <h2 className="result__block-title_promotion">{t("Views")}</h2>
            <h3 className="result__block-subtitle_promotion">99675</h3>
          </div>
        </div>
      </section>
    </>
  );
};
export default MainPage;
