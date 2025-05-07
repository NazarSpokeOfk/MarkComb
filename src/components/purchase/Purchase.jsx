import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";

import "./Purchase.css";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import PurchaseModal from "../modal/purchaseModal";

import DataToDB from "../../dataToDB/dataToDB";

const Purchase = ({ isLoggedIn, userData }) => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  const dataToDB = new DataToDB();

  const titleRef = useRef();

  const { t } = useTranslation();

  const packages = {
    Light: {
      uses: 10,
      oldPrice: 1000,
      newPrice: 500,
    },
    Medium: {
      uses: 50,
      oldPrice: 5000,
      newPrice: 1500,
    },
    Big: {
      uses: 75,
      oldPrice: 7500,
      newPrice: 2500,
    },
  };

  const [selectedPackage, setSelectedPackage] = useState({
    packageName: "",
    usesQuantity: 0,
    price: 0,
    isBusiness : false
  });

  const warnToast = () => {
    toast.warn(
      t("Sorry, payment is unavailable at the moment. Come back later")
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      titleRef.current.classList.add("active");
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Purchase uses</title>
          <meta name="description" content="You can purchase uses here." />
        </Helmet>

        <Header />

        <section className="balance">
          <div className="container">
            <h2 ref={titleRef} className="title__purchase">
              {t("PUR")}
              <span>{t("CHASE")}</span>
            </h2>
            <div className="balance__block">
              <h3 className="balance-block__money">
                {isLoggedIn
                  ? userData?.user?.username
                  : t("Firstly,log in to your account")}
              </h3>
              <h3 className="balance-block__uses">
                {isLoggedIn ? userData?.user?.uses + " uses" : ""}
              </h3>
            </div>
          </div>
        </section>

        <PurchaseModal
          isModalOpened={isModalOpened}
          setIsModalOpened={setIsModalOpened}
          packageName={selectedPackage.packageName}
          usesQuantity={selectedPackage.usesQuantity}
          price={selectedPackage.price}
          isBusiness={selectedPackage.isBusiness}
        />

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
                    setSelectedPackage({
                      packageName: key,
                      usesQuantity: item.uses,
                      price: item.newPrice,
                    });
                    setIsModalOpened(true);
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
                5 {t("5 uses per day for 30 days")}
              </h4>
              <h4 className="package__price-business">
                <span>22500</span>₽
              </h4>
              <h4 className="package__newprice-business none">
                <span>4500</span>₽ / <span id="month none">{t("Month")}</span>
              </h4>
              <button
                onClick={() => {
                  setSelectedPackage({
                    packageName: "business",
                    usesQuantity: "5",
                    price: "4500₽/month",
                    isBusiness : true
                  });
                  setIsModalOpened(true);
                }}
                className="package__button-bussines none"
              >
                {t("purch")}
                <span>{t("ase")}</span>
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </HelmetProvider>
      <ToastContainer />
    </>
  );
};
export default Purchase;
