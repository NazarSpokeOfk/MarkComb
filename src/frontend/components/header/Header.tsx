import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import MiniLogo from "../../../../public/favicon/favicon.svg";

import { HeaderProps } from "../../types/types";

import "../../fonts/font.css";
import "./Header.css";

import HeaderLogo from "../../icons/MarkComb.png";

import HeaderToRightArrow from "../../icons/HeaderToRightArrow.svg";

const Header = ({ hideLinks = false, isVoteEnabled }: HeaderProps) => {
  const { t } = useTranslation();
  const isLittleMobile = useMediaQuery({ maxWidth: 430 });

  const [showMore, setShowMore] = useState<boolean>(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  return (
    <header className={`${isHeaderExpanded ? "active" : ""}`}>
      <div className="header__flex">
        <div className="header__left">
          <Link to="/search" className="logo">
            {isLittleMobile ? (
              <>
                <img src={MiniLogo} alt="" className="mini__logo" />
              </>
            ) : (
              <>
                <img src={HeaderLogo} />
              </>
            )}
          </Link>
        </div>

        <div className="header__center">
          <nav className="nav__links">
            <Link to="/purchases" className="header__link">
              {t("PURCHASES")}
            </Link>
            <Link to="/promotion" className="header__link">
              {t("PROMOTION")}
            </Link>
            <Link to="/purchase" className="header__link">
              {t("PURCHASE")}
            </Link>

            <div
              className={`nav__extra-container ${showMore ? "visible" : ""}`}
            >
              <div className="nav__extra-wrapper">
                <Link to="/faq" className="header__link">
                  {t("SPONSORS")}
                </Link>
                <Link to="/contact" className="header__link">
                  {t("VOTING")}
                </Link>
                <Link to="/contact" className="header__link">
                  {t("SUPPORT PROJECT")}
                </Link>
              </div>
            </div>
            <img
              onClick={() => setShowMore(!showMore)}
              src={HeaderToRightArrow}
              alt="Toggle menu"
              className={`arrow-icon ${showMore ? "rotated" : ""}`}
            />
          </nav>
        </div>

        <div className="header__right">
          <Link to={"/authorization"}>
          <button className="authorize__button">{t("Authorize")}</button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
