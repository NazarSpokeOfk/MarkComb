import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import DownArrow from "../../icons/downarrow.png";

import "./Header.css";

const Header = ({ hideLinks = false, isVoteEnabled }) => {
  useEffect(() => {
    console.log("Есть голосование? :", isVoteEnabled);
  });

  const { t } = useTranslation();
  const isLittleMobile = useMediaQuery({ maxWidth: 430 });

  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  return (
    <header className={`${isHeaderExpanded ? "active" : ""}`}>
      <div className="logo">
        <Link to="/search">
          {isLittleMobile ? (
            <>
              M<span>K</span>
            </>
          ) : (
            <>
              Mark<span>Comb</span>
            </>
          )}
        </Link>
      </div>

      <div className="nav__links-grid"></div>
      {!hideLinks && (
        <div className="header__links">
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

          <img
            onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
            src={DownArrow}
            alt=""
            className={`down__arrow ${isHeaderExpanded ? "active" : ""}`}
          />
        </div>
      )}

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

        <Link to="/purchase" className="header__link">
          {t("support")} {isLittleMobile ? <br /> : null}{" "}
          <span>{t("project")}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
