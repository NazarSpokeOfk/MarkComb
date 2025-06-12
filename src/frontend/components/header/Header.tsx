import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import DownArrow from "../../icons/downarrow.png";
import MiniLogo from "../../../../public/MK.svg"

import { HeaderProps } from "../../types/types";

import "./Header.css";

const Header = ({ hideLinks = false, isVoteEnabled} : HeaderProps) => {
  const { t } = useTranslation();
  const isLittleMobile = useMediaQuery({ maxWidth: 430 });

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
                Mark<span>Comb</span>
              </>
            )}
          </Link>
        </div>

        <div className="header__center">
          {!hideLinks && (
            <nav className="nav__links">
              <Link to="/purchases" className="header__link">
                {t("purc")}
                <span className="highlight">{t("hases")}</span>
              </Link>
              <Link to="/promotion" className="header__link">
                {t("prom")}
                <span>{t("otion")}</span>
              </Link>
              <Link to="/purchase" className="header__link">
                {t("purch")}
                <span>{t("ase")}</span>
              </Link>
            </nav>
          )}
        </div>

        <div className="header__right">
          {!hideLinks && (
            <img
              onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
              src={DownArrow}
              alt=""
              className={`down__arrow ${isHeaderExpanded ? "active" : ""}`}
            />
          )}
        </div>
      </div>

      {isHeaderExpanded && <div className="header__divider" />}

      <div className="header__sublinks">
        <Link to="/sponsors" className="header__link">
          {t("spons")}
          <span className="highlight">{t("ors")}</span>
        </Link>

        <Link to="/vote" className="header__link">
          {t("vo")}
          <span>{t("ting")}</span>
        </Link>

        <a href="https://planeta.ru/campaigns/mk1337" className="header__link">
          {t("support")} {isLittleMobile ? <br /> : null}{" "}
          <span>{t("project")}</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
