import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { useMediaQuery } from "react-responsive";

import "./Purchases.css";

import Header from "../header/Header";
import Footer from "../footer/Footer";

import binBtn from "../../icons/bin.svg";
import noDataFound from "../../images/No results found.png";
import glass from "../../images/magnifying glass.png";

import DataToDB from "../../dataToDB/dataToDB";

const Purchases = ({ userData, setUserData, csrfToken }) => {
  const dataToDb = new DataToDB(true);
  const blocksRef = useRef([]),
    binButtonsRef = useRef([]),
    titlesRef = useRef([null]);

  const { t, i18n } = useTranslation();

  const removePurchase = async (index, user_id, channelName) => {
    try {
      await toast.promise(
        dataToDb.deletePurchaseData(channelName, user_id, csrfToken),
        {
          pending: "Removing channel...",
          success: "Channel has successfully removed!",
          error: "There was an error during removing channel!",
        }
      );

      setUserData((prevData) => ({
        ...prevData,
        channels: prevData.channels.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error("Error removing channel:", error);
    }
  };

  useEffect(() => {
    let timers = [];
    titlesRef.current.forEach((title, index) => {
      let timer = setInterval(() => {
        title.classList.add("active");
      }, 50 * index);
      timers.push(timer);
    });

    return () => timers.forEach(clearInterval);
  }, []);

  useEffect(() => {
    console.log("Данные каналов в purchases:",userData.channels) 
  },[userData])

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Your purchases")}</title>
          <meta
            name="description"
            content="You can watch your purchases here."
          />
        </Helmet>
        
        <Header/>

        <section className="recent">
          <div className="container">
            <h2
              ref={(el) => (titlesRef.current[0] = el)}
              className="title none"
            >
              {t("rec")}
              <span>{t("ent")}{" "}</span>{t("purchases")}
            </h2>
            {userData?.channels?.length > 0 ? (
              userData?.channels.map((channel, index) => (
                <div
                  ref={(el) => (blocksRef.current[index] = el)}
                  className="recent__block"
                  key={index}
                >
                  <h3 className="recent-block__name">
                    {channel?.channel_name}
                  </h3>
                  <h3 className="recent-block__email">
                    em<span>ail</span> : {channel?.email}
                  </h3>
                  <button
                    onClick={() =>
                      removePurchase(
                        index,
                        userData.userInformation.user_id,
                        channel.channel_name
                      )
                    }
                    className="recent-block__bin"
                  >
                    <img
                      loading="lazy"
                      src={binBtn}
                      alt="bin"
                      className="bin"
                    />
                  </button>
                  <img
                    loading="lazy"
                    src={channel?.thumbnail}
                    alt="youtuber picture"
                    className="recent-block__thumbnail"
                  />
                </div>
              ))
            ) : (
              <>
                <p className="no_available">{t("You have no purchases.")}</p>
                <img
                  loading="lazy"
                  className="no_available_img"
                  src={noDataFound}
                  alt="no data found"
                />
                <img
                  loading="lazy"
                  className="magnifying_glass"
                  src={glass}
                  alt="no data found"
                />
              </>
            )}
          </div>
          <Footer/>
        </section>
      </HelmetProvider>
    </>
  );
};

export default Purchases;
