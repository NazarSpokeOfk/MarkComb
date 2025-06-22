import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Helmet, HelmetProvider } from "react-helmet-async";

import "./Purchases.css";

import binBtn from "../../icons/bin.svg";

import PurchasesFunctions from "./functions/PurchasesFunctions"

import { PurchasesProps } from "../../types/types";

import noPurchasesThumbnail from "../../videos/noPurchasesThumbnail.mp4";

const Purchases = ({ userData, setUserData, csrfToken }: PurchasesProps) => {

  const purchasesFunctions = new PurchasesFunctions();

  useEffect(() => {
    console.log("Каналы пользователя :" , userData.channels)
  },[userData])

  const blocksRef = useRef<HTMLDivElement[]>([])
  const titlesRef = useRef<HTMLElement[]>([]);

  const { t } = useTranslation();

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
                      purchasesFunctions.removePurchase(
                        {index,
                        user_id : userData.userInformation.user_id,
                        channelName : channel?.channel_name,
                        csrfToken,
                        setUserData
                        }
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
