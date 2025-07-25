import { useState } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import "./MobileMenu.css";
import { MobileMenuProps } from "../../types/types";

const MobileMenu = ({ dinamicLink }: MobileMenuProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button className="burger" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`menu-overlay ${isOpen ? "open" : ""}`}>
        <Link to={"/" + dinamicLink}>
          <button className="authorize__button">{t(dinamicLink)}</button>
        </Link>
        <nav className="nav__links mobile">
          <Link className="header__link" to="/purchases" onClick={closeMenu}>
            {t("PURCHASES")}
          </Link>
          <Link className="header__link" to="/promotion" onClick={closeMenu}>
            {t("PROMOTION")}
          </Link>
          <Link className="header__link" to="/purchase" onClick={closeMenu}>
            {t("PURCHASE")}
          </Link>
          {/* <a href="#contact" onClick={closeMenu}>Контакты</a> */}
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
