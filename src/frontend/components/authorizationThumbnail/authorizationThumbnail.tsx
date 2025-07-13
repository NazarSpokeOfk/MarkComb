import "./authorizationThumbnail.css";

import { useTranslation } from "react-i18next";
import { AuthorizationThumbnailProps } from "../../types/types";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthorizationThumbnail = ({
  thumbnailRef,
  statusMessages,
  status,
}: AuthorizationThumbnailProps) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [countdown, setCountDown] = useState<number>(5);

  useEffect(() => {
    if (status) {
      const countDownTimer = setTimeout(() => {
        setCountDown(countdown - 1);
        if (countdown === 0) {
          navigate("/search");
          clearInterval(countDownTimer);
        }
      }, 1000);
    }
  });

  return (
    <div ref={thumbnailRef} className="default">
      <div className="sign__up-block">
        <div className="result__block">
          <div className="result__block-emoji">
            {statusMessages[status].emoji}
          </div>
          <h2 className="result__block-title">
            {t(statusMessages[status].title)}
          </h2>
          <p className="result__block-subtitle">
            {t("We'll redirect you to main page in")}
          </p>
          <h2 className="result__block-number">{countdown}</h2>
        </div>
      </div>
    </div>
  );
};
export default AuthorizationThumbnail;
