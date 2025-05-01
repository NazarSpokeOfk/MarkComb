import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


import "./Header.css"

const Header = () => {
  const { t } = useTranslation();
  const isLittleMobile = useMediaQuery({ maxWidth: 375 });

  return (
    <>
      <header>
        <div className="container">
          <div className="logo">
            {isLittleMobile ? (
              <>
                <Link to="/">
                  M<span>K</span>
                </Link>
              </>
            ) : (
              <>
                {" "}
                <Link to="/">
                  Mark<span>Comb</span>
                </Link>
              </>
            )}
          </div>
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
          </div>
        </div>
      </header>
    </>
  );
};
export default Header;
