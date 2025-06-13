import { Link } from "react-router-dom";

import { useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import "./CookiesWindow.css";

import { CookiesWindowProps } from "../../types/types";

import cross from "../../icons/cross.png";
import cookie from "../../icons/cookieicon.svg";

const CookiesWindow = ({
  setIsCookieClosed,
  isCookieClosed,
}: CookiesWindowProps) => {

  const { t } = useTranslation();

  const cookieRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCookieClosed) {
      setTimeout(() => {
        cookieRef?.current?.classList.add("open");
      }, 500);
    } else {
      setTimeout(() => {
        cookieRef?.current?.classList.remove("open");
      }, 500);
    }
  }, []);

  return (
    <>
      <div ref={cookieRef} className="cookie__agreement-block">
        <p className="cookie__agreement-text none">
          {t("We use cookies to improve website performance and convenience. By continuing to use the site, you agree to our use of cookies. For more details, please refer to the")}{" "}
          <Link to="/dataprocessing">{t("personal data processing agreement")}</Link>.
        </p>
        <div className="cookie__subflex">
          <img
            src={cookie}
            alt="cookie img"
            className="cookie__agreement-cookie"
          />
          <button
            onClick={() => {
              cookieRef?.current?.classList.remove("open");
              setTimeout(() => {
                setIsCookieClosed(true);
              }, 600);
            }}
            className="cookie__agreement-block_closebtn"
          >
            <img className="closebtn__img" src={cross} alt="close window" />
          </button>
        </div>
      </div>
    </>
  );
};
export default CookiesWindow;
