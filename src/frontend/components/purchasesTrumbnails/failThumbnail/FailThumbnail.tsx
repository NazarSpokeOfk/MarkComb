import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useRef, useEffect } from "react";

import smoothThumbnail from "../../../utilities/smoothThumbnail";

import { statusMessages } from "../../../interfaces/interfaces";

import AuthorizationThumbnail from "../../authorizationThumbnail/authorizationThumbnail";

import "../thumbnail.css";
const FailThumbnail = () => {
  const thumbnailRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    smoothThumbnail(thumbnailRef)
  },[])
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Error")}</title>
          <meta name="description" content="Purchase was ended with error" />
        </Helmet>

        <AuthorizationThumbnail
          thumbnailRef={thumbnailRef}
          statusMessages={statusMessages}
          status="wrong"
        />
      </HelmetProvider>
    </>
  );
};
export default FailThumbnail;
