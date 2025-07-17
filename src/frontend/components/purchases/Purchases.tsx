import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import "./Purchases.css";
import "../../fonts/font.css";

import removeIcon from "../../icons/removeIcon.png";

import PurchasesFunctions from "./functions/PurchasesFunctions";

import { PurchasesProps } from "../../types/types";

const Purchases = ({ userData, setUserData, csrfToken }: PurchasesProps) => {
  const purchasesFunctions = new PurchasesFunctions();

  const titlesRef = useRef<HTMLElement[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContentRef = useRef<HTMLDivElement>(null)

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
              {t("purch")}
              <span>{t("ases")}</span>
            </h2>

            <div ref={scrollContainerRef} className="scroll-container">
              <div className="purchases__flex-container">
                {userData.channels.map((purchase) => {
                  return (
                    <div ref={scrollContentRef} className="purchase__block">
                      <div className="purchase__block-subflex">
                        <div className="name_and_email__flex">
                          <h2 className="purchase__channelname">
                            {purchase.channel_name}
                          </h2>
                          <h2 className="purchase__email">{purchase.email}</h2>
                        </div>
                        <img src={removeIcon} alt="" className="remove__btn" />
                      </div>
                      <img
                        src={purchase.thumbnail}
                        alt=""
                        className="purchase__channelthumbnail"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </HelmetProvider>
    </>
  );
};

export default Purchases;
