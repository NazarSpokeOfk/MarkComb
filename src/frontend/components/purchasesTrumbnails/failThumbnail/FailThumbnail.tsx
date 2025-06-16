import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import FailImg from "../../../images/failpurchase.png";

import "../thumbnail.css"
const FailThumbnail = () => {
  const { t } = useTranslation();
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Error")}</title>
          <meta name="description" content="Purchase was ended with error" />
        </Helmet>


        <div className="container">
          <h1 className="payment__title">{t("There was a purchase error")}</h1>
          <img
            src={FailImg}
            alt="Purchase error"
            className="payment__img"
          />
          <Link className="payment__to-main" to="/">{t("To")} <span>{t("main page")}</span></Link>
        </div>
      </HelmetProvider>
    </>
  );
};
export default FailThumbnail;
