import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Footer from "../footer/Footer";
import Header from "../header/Header";

import "./MainPage.css";

import SearchBtn from "../../icons/magnifing_glass.png";
import FilterBtnImg from "../../icons/filters.png";
import YoutuberImgOne from "../../images/YouTuber.jpg";
import like from "../../icons/like.png";
import views from "../../icons/views.png";
import elipse from "../../icons/redelipse.png";
import binBtn from "../../icons/bin.svg";
import toRightArrow from "../../icons/torightarrow.png";
import MrBeast from "../../images/MrBeast.webp";

const MainPage = ({ setIsFilterCTAActive }) => {
  const [isFiltersExpanded, setIsFilterExpanded] = useState({
    isFirstOpened: false,
    isSecondOpened: false,
    isThirdOpened: false,
  });
  const { t } = useTranslation();

  useEffect(() => {
    console.log("Состояние списков:", isFiltersExpanded);
  }, [isFiltersExpanded]);
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Main page")}</title>
          <meta name="description" content="Main page of the markcomb" />
        </Helmet>
        <Header />

        <div className="first__block">
          <h2 className="block-title">
            {t("Find YouTube channels to suit")} <span>{t("your needs")}.</span>
          </h2>
          <h3 className="first__block-text">
            {t("Search an extensive database with a large")} <br />{" "}
            {t("number of youtubers")}
          </h3>
          <h3 className="ul__title">{t("Filter by")} :</h3>
          <div className="first__block-ul">
            <div className="ul__flex">
              <img src={elipse} alt="" className="ul__elipse" />
              <h4 className="ul__subtitle">{t("Content-type")}</h4>
            </div>
            <div className="ul__flex">
              <img src={elipse} alt="" className="ul__elipse" />
              <h4 className="ul__subtitle">{t("Number of subscribers")}</h4>
            </div>
            <div className="ul__flex">
              <img src={elipse} alt="" className="ul__elipse" />
              <h4 className="ul__subtitle">{t("Target audience")}</h4>
            </div>
          </div>
          <Link to="/search">
            <button className="block-button">{t("Begin search")}</button>
          </Link>
        </div>

        <div className="second__block">
          <h2 className="block-title">
            {t("Already know who you want to reach?")}
          </h2>
          <h3 className="block-text">
            {t("Use")} <span>{t("smart search")}</span>{" "}
            {t("to find the right youtubers")} <br />{" "}
            {t("and get contact data")}.
          </h3>

          <div className="input__flex">
            <input
              disabled
              id="main__page-search"
              className="search__main"
              type="text"
              placeholder={t("Search for any YouTuber")}
            />
            <div id="main__page-buttons" className="buttons">
              <button type="button" className="search__filters">
                <img src={FilterBtnImg} loading="lazy" alt="search_filters" />
              </button>
              <button type="submit" className="search__glass">
                <img src={SearchBtn} alt="search_button" loading="lazy" />
              </button>
            </div>
          </div>

          <div className="youtuber__block">
            <div className="youtuber__name none">Stopgame</div>
            <div className="youtuber__information">
              <h4 className="youtuber__info">{t("Target Audience")}</h4>
              <span className="youtuber__dash">-</span>
              <h4 className="youtuber__info">{t("Kids,Teenagers")}</h4>

              <h4 className="youtuber__info">{t("Number of subs")}</h4>
              <span className="youtuber__dash">-</span>
              <h4 className="youtuber__info">2430000</h4>

              <h4 className="youtuber__info">{t("Content type")}</h4>
              <span className="youtuber__dash">-</span>
              <h4 className="youtuber__info">{t("Gaming")}</h4>
            </div>

            <img
              src={YoutuberImgOne}
              alt="youtuber"
              className="youtuber__image"
              loading="lazy"
            />
          </div>
          <h3 id="second__block-text" className="block-text">
            {t("MarkComb is your tool to find YouTube partners")} <br />
            {t("quickly and accurately")}.
          </h3>
          <Link to="/search">
            <button id="second__block-button" className="block-button">
              <span>{t("Use search")}</span>
            </button>
          </Link>
        </div>

        <div className="third__block">
          <h2 id="third__block-title" className="block-title">
            {t("If you know what you need but don't know")} <br />
            {t("the youtubers")},{" "}
            <span>
              {t("our filters will help you find")} <br />{" "}
              {t("them based on your criteria")}.
            </span>
          </h2>

          <div className="third__block-flex">
            <div className="third__block-flex-block">
              <h3 className="third__block-flex-text">
                {t("target")} <span>{t("audience")}</span>
              </h3>

              <div
                className={`expanded__filters-wrapper ${
                  isFiltersExpanded.isFirstOpened ? "active" : ""
                }`}
              >
                <div className="expanded__filters-flex">
                  <div className="expanded-filters-text">{t("Kids")}</div>
                  <div className="expanded-filters-text">{t("Teenagers")}</div>
                  <div className="expanded-filters-text">{t("Youth")}</div>
                  <div className="expanded-filters-text">{t("Adults")}</div>
                  <div className="expanded-filters-text">
                    {t("Older generation")}
                  </div>
                </div>
              </div>

              <img
                onClick={() =>
                  setIsFilterExpanded((prevState) => ({
                    ...prevState,
                    isFirstOpened: !isFiltersExpanded.isFirstOpened,
                  }))
                }
                src={toRightArrow}
                alt=""
                className={`third__block-flex-img ${
                  isFiltersExpanded.isFirstOpened ? "active" : ""
                }`}
              />
            </div>

            <div className="third__block-flex-block">
              <h3 className="third__block-flex-text">
                {t("number of")} <span>{t("subscribers")}</span>
              </h3>

              <div
                className={`expanded__filters-wrapper ${
                  isFiltersExpanded.isSecondOpened ? "active" : ""
                }`}
              >
                <div className="expanded__filters-flex">
                  <div className="expanded-filters-text">0-1K</div>
                  <div className="expanded-filters-text">1-10K</div>
                  <div className="expanded-filters-text">10K-100K</div>
                  <div className="expanded-filters-text">100K-500K</div>
                  <div className="expanded-filters-text">
                    <span>{t("And more")}</span>
                  </div>
                </div>
              </div>

              <img
                onClick={() =>
                  setIsFilterExpanded((prevState) => ({
                    ...prevState,
                    isSecondOpened: !isFiltersExpanded.isSecondOpened,
                  }))
                }
                src={toRightArrow}
                alt=""
                className={`third__block-flex-img ${
                  isFiltersExpanded.isSecondOpened ? "active" : ""
                }`}
              />
            </div>

            <div className="third__block-flex-block">
              <h3 className="third__block-flex-text">
                {t("content")} <span>{t("type")}</span>
              </h3>

              <div
                className={`expanded__filters-wrapper ${
                  isFiltersExpanded.isThirdOpened ? "active" : ""
                }`}
              >
                <div className="expanded__filters-flex">
                  <div className="expanded-filters-text">{t("Comedy")}</div>
                  <div className="expanded-filters-text">{t("Education")}</div>
                  <div className="expanded-filters-text">{t("Gaming")}</div>
                  <div className="expanded-filters-text">{t("Fitness")}</div>
                  <div className="expanded-filters-text">
                    <span>{t("And more")}</span>
                  </div>
                </div>
              </div>

              <img
                onClick={() =>
                  setIsFilterExpanded((prevState) => ({
                    ...prevState,
                    isThirdOpened: !isFiltersExpanded.isThirdOpened,
                  }))
                }
                src={toRightArrow}
                alt=""
                className={`third__block-flex-img ${
                  isFiltersExpanded.isThirdOpened ? "active" : ""
                }`}
              />
            </div>
          </div>
          <Link to="/search">
            <button
              onClick={() => {
                setIsFilterCTAActive(true);
              }}
              id="third__block-button"
              className="block-button"
            >
              {t("Use filters")}
            </button>
          </Link>
        </div>

        <div className="fourth__block">
          <h2 className="block-title">
            <span>{t("We will retain")}</span> {t("all the data you have")}{" "}
            <br /> {t("purchased")}
          </h2>

          <div className="recent__block">
            <h3 className="recent-block__name">Stopgame</h3>
            <h3 className="recent-block__email">
              {t("em")}
              <span>{t("ail")}</span> : {t("email")}
            </h3>
            <button className="recent-block__bin">
              <img loading="lazy" src={binBtn} alt="bin" className="bin" />
            </button>
            <img
              loading="lazy"
              src={YoutuberImgOne}
              alt="youtuber picture"
              className="recent-block__thumbnail"
            />
          </div>

          <h2 className="block-text">
            {t("You can")} <span>{t("delete")}</span> {t("data you don't need")}
            , {t("or")} <span>{t("save")}</span> {t("it for future use")}
          </h2>
        </div>

        <div className="fifth__block">
          <h2 className="block-title">
            {t("Track")} <span>{t("video promotion")}</span>
          </h2>

          <div className={`search-suggested__block`}>
            <h2 className="suggested-block__name">
              {t("Обзор Marvel Rivals")}
            </h2>
            <img
              loading="lazy"
              src={YoutuberImgOne}
              alt="a video thumbnail"
              className={`suggested-block__img`}
            />
            {/* <h2 className="suggested-block__views">
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
    </h2> */}
          </div>

          <h3 id="fifth__block-text" className="block-text">
            <span>{t("Track likes and views")}</span>{" "}
            {t("progression of videos")}{" "}
            {t("from channels which contact data you")} {t("purchased")}.
          </h3>
        </div>

        <div className="sixth__block">
          <h2 className="block-title">
            <span>{t("Purchase uses packages")}</span> {t("to receive")} <br />{" "}
            {t("data")}
          </h2>

          <div className="packages__block">
            <div className="packages-light__package">
              <h3 className="package__title none">{t("Light")}</h3>
              <h4 className="package__usages none">
                {10} {t("uses(s)")}
              </h4>
              <h4 className="package__newprice">
                <span>500</span>₽
              </h4>
            </div>

            <div className="packages-light__package">
              <h3 className="package__title none">{t("Medium")}</h3>
              <h4 className="package__usages none">
                {50} {t("uses(s)")}
              </h4>
              <h4 className="package__newprice">
                <span>1500</span>₽
              </h4>
            </div>

            <div className="packages-light__package">
              <h3 className="package__title none">{t("Big")}</h3>
              <h4 className="package__usages none">
                {70} {t("uses(s)")}
              </h4>
              <h4 className="package__newprice">
                <span>2500</span>₽
              </h4>
            </div>
          </div>
          <Link to="/purchase">
            <button className="block-button">{t("Purchase")}</button>
          </Link>
        </div>

        <div className="seventh__block">
          <h2 className="block-title">
            <span>{t("What am I paying")}</span> {t("money for")}?
          </h2>
          <h3 className="block-text">
            {t("To use our service, you purchasing the")} <br />{" "}
            {t("use which you can spend on any")} <br />{" "}
            {t("contentmaker to find out their contact")} <br />{" "}
            {t("information")}.
          </h3>

          <div className="youtuber__block">
            <div className="youtuber__name none">MrBeast</div>
            <div className="youtuber__information">
              <h4 className="youtuber__info">{t("Target Audience")}</h4>
              <span className="youtuber__dash">-</span>
              <h4 className="youtuber__info">{t("Kids,Teenagers")}</h4>

              <h4 className="youtuber__info">{t("Number of subs")}</h4>
              <span className="youtuber__dash">-</span>
              <h4 className="youtuber__info">315000000</h4>

              <h4 className="youtuber__info">{t("Content type")}</h4>
              <span className="youtuber__dash">-</span>
              <h4 className="youtuber__info">{t("Entertainment")}</h4>
            </div>

            <img
              src={MrBeast}
              alt="youtuber"
              className="youtuber__image"
              loading="lazy"
            />
          </div>

          <button className="youtuber__button success">
            {t("Check contact data in your purchases")}.
          </button>

          <h3 id="seventh__block-second-text" className="block-text">
            {t("After a successful purchase, we")} <br />{" "}
            {t("will deduct the 1 usage from your")} <br /> {t("account")}.
          </h3>

          <Link to="/search">
            <button className="block-button">
              <span>{t("Begin search")}</span>
            </button>
          </Link>
        </div>

        <Footer />
      </HelmetProvider>
    </>
  );
};
export default MainPage;
