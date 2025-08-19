import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import ExpandedPackageInfo from "./components/ExpandedPackageInfo";

import "./Purchase.css";

import { CommonTypes } from "../../types/types";

import lightPackageIcon from "../../icons/lightPackageIcon.png";
import mediumPackageIcon from "../../icons/mediumPackageIcon.png";
import bigPackageIcon from "../../icons/bigPackageIcon.png";
import businessPackageIcon from "../../icons/businessIcon.png";
import smoothScrollContainer from "../../utilities/smoothHorizontalScroll";

const Purchase = ({ userData }: CommonTypes) => {
  const isLittleMobile = useMediaQuery({ maxWidth: 430 });

  useEffect(() => {
    smoothScrollContainer({
      containerRef,
      contentRefs,
    });
  }, []);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRefs = useRef<HTMLDivElement[]>([]);
  const textRefs = useRef<HTMLHeadingElement[]>([]);

  const [isPackageExpanded, setIsPackageExpanded] = useState<boolean>(false);

  const { t } = useTranslation();

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

  const [selectedPackage, setSelectedPackage] = useState<number>();

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
          {t("uses packa")}
          <span>{t("ges")}</span>
        </h2>

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
              {isPackageExpanded && data.packageId === selectedPackage ? (
                <ExpandedPackageInfo
                  name={name}
                  data={data}
                  textRefs={textRefs}
                  isPackageExpanded={isPackageExpanded}
                  userData={userData}
                />
              ) : (
                <div className="package__info">
                  <div>
                    <h2 className="package__title">{t(name)}</h2>
                    <h3 className="package__subtitle">
                      {data.packageId !== 4 ? data.uses : t("5 uses per day")}{" "}
                      {data.packageId !== 4 ? t("uses") : null}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPackage(data.packageId);
                      setIsPackageExpanded(true);
                    }}
                    className="package__button"
                  >
                    {t("Purchase")}
                  </button>
                </div>
              )}
              <img
                src={data.icon}
                alt={`${name} package icon`}
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
