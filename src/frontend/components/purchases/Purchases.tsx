import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Helmet, HelmetProvider } from "react-helmet-async";

import "./Purchases.css";

import binBtn from "../../icons/bin.svg";

import DataToDB from "../../Client-ServerMethods/dataToDB";

import { PurchasesProps } from "../../types/types";

import noPurchasesThumbnail from "../../videos/noPurchasesThumbnail.mp4";

const Purchases = ({ userData, setUserData, csrfToken }: PurchasesProps) => {

  useEffect(() => {
    console.log("Каналы пользователя :" , userData.channels)
  },[userData])

  const dataToDb = new DataToDB();
  const blocksRef = useRef<HTMLDivElement[]>([]),
    titlesRef = useRef<HTMLElement[]>([]);

  const { t, i18n } = useTranslation();

  const removePurchase = async (index : number, user_id : number, channelName : string) => {
    console.log(`Index : ${index}, user_id : ${user_id}, channelName : ${channelName}`)
    try {
      await toast.promise(
        dataToDb.deletePurchaseData(channelName, user_id, csrfToken),
        {
          pending: (t("Removing purchase...")),
          success: (t("Purchase has successfully removed!")),
          error: (t("There was an error during removing purchase!")),
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
    let timers: number[] = [];
  
    titlesRef.current.forEach((title, index) => {
      const timer = window.setInterval(() => {
        title.classList.add("active");
      }, 50 * index);
      timers.push(timer);
    });
  
    return () => timers.forEach(clearInterval);
  }, []);

  useEffect(() => {
    console.log("Данные каналов в purchases:", userData.channels);
  }, [userData]);

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

        <section className="recent">
          <div className="container">
            <h2
              ref={(el) => {
                if (el) titlesRef.current[0] = el as HTMLDivElement;
              }}
              className="title none"
            >
              {t("rec")}
              <span>{t("ent")} </span>
              {t("purchases")}
            </h2>
            {userData?.channels?.length > 0 ? (
              userData?.channels.map((channel, index) => (
                <div
                  ref={(el) => {
                    if(el) (blocksRef.current[index] = el)}
                  } 
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
                        channel?.channel_name
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
                <video
                  className="no__purchases-thumbnail"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={noPurchasesThumbnail} type="video/webm" />
                </video>
              </>
            )}
          </div>
        </section>
      </HelmetProvider>
    </>
  );
};

export default Purchases;
