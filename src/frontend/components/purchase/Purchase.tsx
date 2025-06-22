import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";

import { useMediaQuery } from "react-responsive";


import "./Purchase.css";

import { CommonTypes } from "../../types/types";

import { SelectedPackage } from "../../interfaces/interfaces";
import PurchaseModal from "../modal/purchaseModal";

const Purchase = ({ isLoggedIn, userData }: CommonTypes) => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  useEffect(() => {
    console.log("isLoggedIn : ", isLoggedIn);
  }, [isLoggedIn]);

  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const { t } = useTranslation();

  const packages = {
    Light: {
      packageId: 1,
      uses: 10,
      oldPrice: 1000,
      newPrice: 500,
    },
    Medium: {
      packageId: 2,
      uses: 50,
      oldPrice: 5000,
      newPrice: 1500,
    },
    Big: {
      packageId: 3,
      uses: 75,
      oldPrice: 7500,
      newPrice: 2500,
    },
  };

  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      titleRef?.current?.classList.add("active");
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Purchase uses")}</title>
          <meta name="description" content="You can purchase uses here." />
        </Helmet>

        <section className="balance">
          <div className="container">
            <h2 ref={titleRef} className="title__purchase">
              {t("PUR")}
              <span>{t("CHASE")}</span> {t("Uses")}
            </h2>
            <div className="balance__block">
              <h3 className="balance-block__money">
                {isLoggedIn
                  ? userData?.userInformation?.username
                  : t("Firstly,log in to your account")}
              </h3>
              <h3 className="balance-block__uses">
                {isLoggedIn ? userData?.userInformation?.uses + " uses" : ""}
              </h3>
            </div>
          </div>
        </section>

        {selectedPackage && (
          <PurchaseModal
            isModalOpened={isModalOpened}
            setIsModalOpened={setIsModalOpened}
            packageName={selectedPackage.packageName}
            usesQuantity={selectedPackage.usesQuantity}
            price={selectedPackage.price}
            isBusiness={selectedPackage.isBusiness}
            packageId={selectedPackage.packageId}
            user_id={userData?.userInformation?.user_id}
            userEmail={userData?.userInformation?.email}
          />
        )}

        <section className="packages">
          <h2 className="packages__title none">{t("packages")}</h2>
          <div className="packages__wrapper">
            {Object.entries(packages).map(([key, item]) => (
              <div key={key} className="packages-light__package">
                <h3 className="package__title none">{t(key)}</h3>
                <h4 className="package__usages none">
                  {item.uses} {t("uses(s)")}
                </h4>
                <h4 className="package__price">
                  <span>{item.oldPrice}</span>₽
                </h4>
                <h4 className="package__newprice">
                  <span>{item.newPrice}</span>₽
                </h4>
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      setSelectedPackage({
                        packageName: key,
                        usesQuantity: item.uses,
                        price: item.newPrice,
                        isBusiness: false,
                        packageId: item.packageId,
                      });
                      setIsModalOpened(true);
                    } else {
                      return;
                    }
                  }}
                  className="package__button none"
                >
                  {t("purch")}
                  <span>{t("ase")}</span>
                </button>
              </div>
            ))}

            <div id="business" className="packages-light__package">
              <h3 className="package__title-business none">{t("Business")}</h3>
              <h4 className="package__usages-business none">
                {t("5 uses per day for 30 days")}
              </h4>
              <h4 className="package__price-business">
                <span>22500</span>₽
              </h4>
              <h4 className="package__newprice-business none">
                <span>4500</span>₽ / <span id="month none">{t("Month")}</span>
              </h4>
              <button
              id="business__button"
                onClick={() => {
                  if (isLoggedIn) {
                    setSelectedPackage({
                      packageName: "Business",
                      usesQuantity: 5,
                      price: 4500,
                      isBusiness: true,
                      packageId: 4,
                    });
                    setIsModalOpened(true);
                  } else {
                    return;
                  }
                }}
                className="package__button none"
              >
                {t("purch")}
                <span>{t("ase")}</span>
              </button>
            </div>
          </div>
        </section>

      </HelmetProvider>
      <ToastContainer />
    </>
  );
};
export default Purchase;
