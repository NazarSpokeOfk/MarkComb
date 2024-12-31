import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";

import SmoothEffect from "../smoothText";
import GetData from "../../requests/getData";
import "./YoutuberBlock.css";
import YoutuberImg from "../../images/MrBeast.webp";

const YoutuberBlock = ({ channelData, SimilarChannelData }) => {
  const { t, i18n } = useTranslation();
  const [btnsState, setBtnsState] = useState({});
  const isProcessingRef = useRef({})

  const handleButtonClick = async (data,buttonId) => {
    let timeout1, timeout2, timeout3;

    if (!data?.channelId) {
      alert(
        t("Firstly, find the youtuber whose contact details you want to get")
      );
      return;
    }

    if(isProcessingRef.current[buttonId]) return;


    isProcessingRef.current[buttonId] = true;
    
    setBtnsState((prev) => ({
      ...prev,
      [buttonId]:{isProcessing:true},
    }))
    if(btnsState[buttonId]?.isProcessing) return
    const result = await GetData(data.channelId);

    setBtnsState((prev) => ({
      ...prev,
      [buttonId]: {
        isProcessing : false,
        class : result.length === 0 ? "fail" : "success"
      }
    }))


    timeout2 = setTimeout(() => {
      isProcessingRef.current[buttonId] = false
      setBtnsState((prev) => ({
        ...prev,
        [buttonId]:{
          class : "default",
          isProcessing : false
        }
      }));
      
    }, 2000);
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  };

  return (
    <>
      <section className="youtubers">
        <div className="container">
          <div
            className={`youtuber__block ${
              channelData ? "youtuber__block" : "pulse"
            }`}
          >
            <div className="youtuber__name none">
              {channelData ? channelData?.[0]?.title : "?"}
            </div>
            <div className="youtuber__information">
              <div className="youtuber__definitions">
                <h4 className="youtuber__definition none">
                  {t("Target Audience")}-
                </h4>
                <h4 className="youtuber__definition none">
                  {t("Number of subs")} -
                </h4>
                <h4 className="youtuber__definition none">
                  {t("Content type")} -
                </h4>
              </div>

              <div className="youtuber__stats">
                <h4 className="statistic none">
                  {channelData ? channelData?.[0]?.targetAudience : "?"}
                </h4>
                <h4 className="statistic none">
                  {channelData ? channelData?.[0].subsCount : "?"}
                </h4>
                <h4 className="statistic none">
                  {channelData ? channelData?.[0]?.genre : "?"}
                </h4>
              </div>
            </div>
            <img
              src={channelData?.[0]?.thumbnail || YoutuberImg}
              alt="MrBeast"
              className="youtuber__image"
            />
          </div>

          <button
            className={`youtuber__button ${btnsState[0]?.class || ""}`}
            onClick={() => handleButtonClick(channelData?.[0],0)}
          > 
            {
            btnsState[0]?.class === "success"
            ? t("Check contact data in purchases.") :
            btnsState[0]?.class === "fail"
            ? t("Unfortunantly,we can't get contact data.")
            : `${t("Get")} ${t("data")}`
            }
          </button>

          <div
            className={`youtuber__block ${
              SimilarChannelData ? "youtuber__block" : "pulse"
            }`}
          >
            <div className="youtuber__name none">
              {SimilarChannelData ? SimilarChannelData?.[0]?.title : "?"}
            </div>
            <div className="youtuber__information">
              <div className="youtuber__definitions">
                <h4 className="youtuber__definition none">
                  {t("Target Audience")}-
                </h4>
                <h4 className="youtuber__definition none">
                  {t("Number of subs")} -
                </h4>
                <h4 className="youtuber__definition none">
                  {t("Content type")} -
                </h4>
              </div>

              <div className="youtuber__stats">
                <h4 className="statistic none">
                  {SimilarChannelData ? SimilarChannelData?.[0]?.genre?.[0] : "?"}
                </h4>
                <h4 className="statistic none">
                  {SimilarChannelData ? SimilarChannelData?.[0]?.subsCount : "?"}
                </h4>
                <h4 className="statistic none">
                  {SimilarChannelData ? SimilarChannelData?.[0]?.genre?.[1] : "?"}
                </h4>
              </div>
            </div>
            <img
              src={SimilarChannelData?.[0]?.thumbnail || YoutuberImg}
              alt="MrBeast"
              className="youtuber__image"
            />
          </div>

          <button
            className={`youtuber__button ${btnsState[1]?.class || ""}`}
            onClick={() => handleButtonClick(SimilarChannelData?.[0] , 1)}
          > 
            {
            btnsState[1]?.class === "success"
            ? t("Check contact data in purchases.") :
            btnsState[1]?.class === "fail"
            ? t("Unfortunantly,we can't get contact data.")
            : `${t("Get")} ${t("data")}`
            }
          </button>
        </div>
      </section>

      <section className="footer">
        <div className="footer__container">
          <h3 className="footer__logo">MK,2024</h3>
          <Link to="/terms" className="footer__terms none">
            {t("Terms of service")}
          </Link>
          <Link to="/purpose" className="footer__purpose none">
            {t("Our purpose")}
          </Link>
          <button
            onClick={() => {
              SmoothEffect().then(() => {
                i18n.changeLanguage("ru");
              });
            }}
            className="footer__button"
          >
            Русский
          </button>
          <button
            onClick={() => {
              SmoothEffect().then(() => {
                i18n.changeLanguage("en");
              });
            }}
            className="footer__button"
          >
            English
          </button>
        </div>
      </section>
    </>
  );
};

export default YoutuberBlock;
