import { ExpandedPackageInfoProps } from "../../../types/types";

import { ToastIcon } from "react-toastify";

import Loading from "../../../images/loading-gif.gif";

import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";

import { useEffect, useState } from "react";

import PurchaseFunctions from "../functions/purchaseFunctions";

const ExpandedPackageInfo = ({
  name,
  data,
  textRefs,
  isPackageExpanded,
  userData,
}: ExpandedPackageInfoProps) => {
  const purchaseFunctions = new PurchaseFunctions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();

  const showErrorToast = (message: string | null, icon: ToastIcon) => {
    if (message)
      toast(t(message), {
        icon,
        hideProgressBar: true,
        theme: "dark",
        autoClose: 5000,
      });
  };

  useEffect(() => {
    showErrorToast(error, <>❌</>);
  }, [error]);

  useEffect(() => {
    let movingInTimeout: ReturnType<typeof setTimeout>;
    if (isPackageExpanded) {
      movingInTimeout = setTimeout(() => {
        textRefs.current.forEach((el) => {
          el.classList.add("moving__in");
        });
      }, 100);
    }
    return () => {
      clearTimeout(movingInTimeout);
    };
  }, [isPackageExpanded]);

  return (
    <>
      <div className="package__info">
        <div>
          <h2 id="title-expanded" className="package__title">
            {t(name)}
          </h2>
          <h3
            ref={(el) => {
              if (el) textRefs.current[1] = el;
            }}
            className="package__littletitle"
          >
            {t("Details")}
          </h3>
          <p
            ref={(el) => {
              if (el) textRefs.current[2] = el;
            }}
            className="package__text"
          >
            {t(data.information)}
          </p>
          <h5
            ref={(el) => {
              if (el) textRefs.current[3] = el;
            }}
            className="package__study-offer"
          >
            {t("Study")}{" "}
            <a href="/offer.pdf" className="agreement__link">
              {t("offer")}
            </a>
          </h5>
        </div>
        {isLoading ? (
          <>
            <img src={Loading} alt="loading" className="loading__img"/>
          </>
        ) : (
          <button
            onClick={() => {
              purchaseFunctions.validatePayment({
                user_id: userData.userInformation.user_id,
                packageId: data.packageId,
                userEmail: userData.userInformation.email,
                setError,
                setIsLoading,
              });
            }}
            className="package__button fancy-button"
          >
            {data.price}₽
          </button>
        )}
      </div>
    </>
  );
};

export default ExpandedPackageInfo;
