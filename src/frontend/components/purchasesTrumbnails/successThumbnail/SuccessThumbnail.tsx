import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import SuccessImg from "../../../images/successpurchase.png";

import "../thumbnail.css";
const SuccessThumbnail = () => {
  const { t } = useTranslation();
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Success")}</title>
          <meta name="description" content="Successfull purchase" />
        </Helmet>

        <div className="container">
          <h1 className="payment__title">{t("Thank you for your purchase!")}</h1>
          <img
            src={SuccessImg}
            alt="Successfull purchase"
            className="payment__img"
          />
          <Link className="payment__to-main" to="/">
            {t("To")} <span>{t("main page")}</span>
          </Link>
        </div>
      </HelmetProvider>
    </>
  );
};
export default SuccessThumbnail;
