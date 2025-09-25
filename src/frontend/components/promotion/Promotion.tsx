import { useState , useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { useTranslation } from "react-i18next";

import Analytics from "./components/analytics/Analytics";
import PromotionInner from "./components/promotionInner/PromotionInner";

import { CommonTypes } from "../../types/types";

import "./Promotion.css";

const Promotion = ({ userData }: CommonTypes) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const promotionInnerContainerRef = useRef<HTMLDivElement>(null)
  const analyticsContainerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Promotion")}</title>
          <meta
            name="description"
            content="Here you can see how the content maker's video has progressed"
          />
        </Helmet>
        <div ref={promotionInnerContainerRef}>
          <PromotionInner
            userData={userData}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            containerToHide={promotionInnerContainerRef}
            containerToShow={analyticsContainerRef}
          />
        </div>
        <div ref={analyticsContainerRef} style={{ display : "none"}}>
          <Analytics containerToHide={analyticsContainerRef} containerToShow={promotionInnerContainerRef} />
        </div>
      </HelmetProvider>
    </>
  );
};

export default Promotion;
