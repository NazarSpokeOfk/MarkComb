import { useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import "./css/purchaseModal.css";

import Cross from "../../icons/cross.png";

const PurchaseModal = ({
  isModalOpened,
  setIsModalOpened,
  packageName,
  usesQuantity,
  price,
  isBusiness,
}) => {
  const { t } = useTranslation();

  const modalRef = useRef();

  useEffect(() => {
    if (isModalOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isModalOpened]);

  return (
    <>
      <section className={`modal__purchase ${isModalOpened ? "active" : ""}`}>
        <div
          ref={modalRef}
          onClick={() => {
            modalRef.current.classList.remove("open");
            setTimeout(() => {
              document.body.style.overflow = "";
              setIsModalOpened(false);
            }, 300);
          }}
          className={`modal__overlay ${isModalOpened ? "open" : ""}`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="purchase__modal-block"
          >
            <div className="purchase__modal-top">
              <h1 className="purchase__modal-title">
                {t("You're going to buy")} - {packageName}
              </h1>
              <button
                onClick={() => {
                  modalRef.current.classList.remove("open");
                  setTimeout(() => {
                    document.body.style.overflow = "";
                    setIsModalOpened(false);
                  }, 300);
                }}
                className="close__modal"
              >
                <img src={Cross} alt="" />
              </button>
            </div>

            <div className="purchase__modal-definitions">
              <h3 className="definitions__title">
                {packageName} <span>{t("contains")}</span> :
              </h3>

              <ul className="definitions__ul">
                {isBusiness ? (
                  <>
                    <li>5 {t("5 uses per day for 30 days")}</li>
                  </>
                ) : (
                  <li>
                    {usesQuantity}
                    {t("USES")}
                  </li>
                )}
              </ul>

              <h3 className="definitions__title">{t("Delivery time")} :</h3>

              <ul className="definitions__ul">
                <li>{t("Instant, on your account")}</li>
              </ul>

              <h3 className="definitions__title">{t("Price")} :</h3>

              <ul className="definitions__ul">
                {isBusiness ? <li>{price}</li> : <li>{price}₽</li>}
              </ul>
            </div>

            <button className="purchase__modal-button">{t("Buy")}</button>
          </div>
        </div>
      </section>
    </>
  );
};
export default PurchaseModal;
