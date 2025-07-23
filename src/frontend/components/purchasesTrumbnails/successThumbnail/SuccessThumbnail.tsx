import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { useEffect, useRef } from "react";
import { statusMessages } from "../../../interfaces/interfaces";

import AuthorizationThumbnail from "../../authorizationThumbnail/authorizationThumbnail";

import smoothThumbnail from "../../../utilities/smoothThumbnail";

import "../thumbnail.css";
const SuccessThumbnail = () => {

  useEffect(() => {
    smoothThumbnail(thumbnailRef)
  },[])

  const thumbnailRef = useRef<HTMLDivElement | null>(null);

  const { t } = useTranslation();
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Success")}</title>
          <meta name="description" content="Successfull purchase" />
        </Helmet>

        <AuthorizationThumbnail
          thumbnailRef={thumbnailRef}
          statusMessages={statusMessages}
          status="successfullPurchase"
        />
      </HelmetProvider>
    </>
  );
};
export default SuccessThumbnail;
