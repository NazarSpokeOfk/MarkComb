import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { motion, AnimatePresence } from "framer-motion";

import "./Purchases.css";
import "../../fonts/font.css";

import removeIcon from "../../icons/removeIcon.png";
import purchasesThumbnail from "../../icons/purchasesThumbnail.png";

import smoothScrollContainer from "../../utilities/smoothHorizontalScroll";

import PurchasesFunctions from "./functions/PurchasesFunctions";

import { PurchasesProps } from "../../types/types";

const Purchases = ({ userData, setUserData, csrfToken }: PurchasesProps) => {
  const purchasesFunctions = new PurchasesFunctions();

  const titlesRef = useRef<HTMLElement[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<HTMLDivElement[]>([]);
  const thumbnailRef = useRef<HTMLDivElement | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (userData.channels.length <= 0) {
      thumbnailRef.current?.classList.add("thumbnail__appearing");
    }
  },[userData.channels]);

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
    let timeout : ReturnType<typeof setTimeout>
    timeout = setTimeout(() => {
      smoothScrollContainer({
        containerRef: scrollContainerRef,
        contentRefs,
      });
    },100)
    return () => {clearTimeout(timeout)}
  }, [userData.channels]);

  useEffect(() => {
    console.log(userData.channels)
  },[userData.channels])

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
          {userData.channels.length > 0 ? (
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
                  <AnimatePresence>
                    {userData.channels.map((purchase) => {
                      return (
                        <motion.div
                          key={purchase.transaction_id}
                          layout
                          exit={{ opacity: 0, y: 40 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div
                            key={purchase.email}
                            ref={(el) => {
                              if (el)
                                contentRefs.current[purchase.transaction_id] =
                                  el;
                            }}
                            className="purchase__block item"
                          >
                            <div className="purchase__block-subflex">
                              <div className="name_and_email__flex">
                                <h2 className="purchase__channelname">
                                  {purchase.channel_name}
                                </h2>
                                <h2 className="purchase__email">
                                  {purchase.email}
                                </h2>
                              </div>
                              <img
                                onClick={() =>
                                  purchasesFunctions.removePurchase({
                                    user_id: userData.userInformation.user_id,
                                    channelName: purchase.channel_name,
                                    csrfToken,
                                    setUserData,
                                    contentRefs,
                                    transaction_id: purchase.transaction_id,
                                  })
                                }
                                src={removeIcon}
                                alt=""
                                className="remove__btn"
                              />
                            </div>
                            <img
                              src={purchase.thumbnail}
                              alt=""
                              className="purchase__channelthumbnail"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            <div ref={thumbnailRef} className="purchases__thumbnail-flex">
              <img
                src={purchasesThumbnail}
                className="purchases__thumbnail"
                alt=""
              />
              <h1 className="purchases__thumbnail-title">
                {t("Your")} <br /> {t("purchases")} <br />{" "}
                <span>{t("will be here")}.</span>
              </h1>
            </div>
          )}
        </section>
      </HelmetProvider>
    </>
  );
};

export default Purchases;
