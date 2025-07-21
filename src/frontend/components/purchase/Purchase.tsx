import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";

import "./Purchase.css";

import { CommonTypes } from "../../types/types";

import { SelectedPackage } from "../../interfaces/interfaces";
import PurchaseModal from "../modal/purchaseModal";

import lightPackageIcon from "../../icons/lightPackageIcon.png";
import mediumPackageIcon from "../../icons/mediumPackageIcon.png";
import bigPackageIcon from "../../icons/bigPackageIcon.png";
import businessPackageIcon from "../../icons/businessIcon.png";
import smoothScrollContainer from "../../utilities/smoothScroll";

const Purchase = ({ isLoggedIn, userData }: CommonTypes) => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  useEffect(() => {
    smoothScrollContainer({
      containerRef,
      contentRefs,
    });
  }, []);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRefs = useRef<HTMLDivElement[]>([]);
  const { t } = useTranslation();

  const packages = {
    Light: {
      packageId: 1,
      uses: 10,
      icon: lightPackageIcon,
      // oldPrice: 1000,
      // newPrice: 500,
    },
    Medium: {
      packageId: 2,
      uses: 50,
      icon: mediumPackageIcon,
      // oldPrice: 5000,
      // newPrice: 1500,
    },
    Big: {
      packageId: 3,
      uses: 75,
      icon: bigPackageIcon,
      // oldPrice: 7500,
      // newPrice: 2500,
    },
    Business: {
      packageId: 4,
      uses: "5 uses per day",
      icon: businessPackageIcon,
    },
  };

  const [selectedPackage, setSelectedPackage] =
    useState<SelectedPackage | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      titleRef?.current?.classList.add("active");
    }, 50);

    return () => {
      clearInterval(timer);
    };
  });
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Purchase uses")}</title>
          <meta name="description" content="You can purchase uses here." />
        </Helmet>

        <h2 ref={titleRef} className="title__purchase">
          {t("uses packa")}<span>{t("ges")}</span>
        </h2>

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

        <section ref={containerRef} className="package">
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
                    {data.packageId != 4 ? data.uses : t("5 uses per day")}{" "}
                    {data.packageId != 4 ? t("uses") : null}
                  </h3>
                </div>
                <button className="package__button">{t("Purchase")}</button>
              </div>
              <img
                src={data.icon}
                alt="Package icon"
                className="package__img"
              />
            </div>
          ))}
        </section>
      </HelmetProvider>
      <ToastContainer />
    </>
  );
};
export default Purchase;
