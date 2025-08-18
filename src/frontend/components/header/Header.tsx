import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import MobileMenu from "../mobileMenu/MobileMenu";

import { HeaderProps } from "../../types/types";

import "../../fonts/font.css";
import "./Header.css";

import HeaderLogo from "../../icons/MarkComb.png";

import HeaderToRightArrow from "../../icons/HeaderToRightArrow.svg";

const Header = ({ userData, isLoggedIn }: HeaderProps) => {
  const { t } = useTranslation();
  const isLittleMobile = useMediaQuery({ maxWidth: 430 });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // const [additionalActive]
  const links = {
    1: {
      title: "PURCHASES",
      link: "/purchases",
      index: 1,
    },
    2: {
      title: "PROMOTION",
      link: "/promotion",
      index: 2,
    },
    3: {
      title: "PURCHASE",
      link: "/purchase",
      index: 3,
    },
  };

  const [showMore, setShowMore] = useState<boolean>(false);

  const [dinamicLink, setDinamicLink] = useState<"Authorization" | "Profile">(
    "Authorization"
  );

  useEffect(() => {
    if (isLoggedIn) {
      setDinamicLink("Profile");
    }
    if (!isLoggedIn) {
      setDinamicLink("Authorization");
    }
  }, [userData]);

  return (
    <header>
      <div className="header__flex">
        <div className="header__left">
          <Link
            onClick={() => setActiveIndex(null)}
            to="/search"
            className="logo"
          >
            <>
              <img src={HeaderLogo} />
            </>
          </Link>
        </div>

        <div className="header__center">
          {isLittleMobile ? null : (
            <nav className="nav__links">
              {Object.values(links).map(({ title, link, index }) => (
                <Link
                  onClick={() => {
                    setActiveIndex(index);
                  }}
                  className={`header__link ${
                    activeIndex === index ? "pressed" : ""
                  }`}
                  to={link}
                  key={index}
                >
                  {t(title)}
                </Link>
              ))}
              {/* <div
                className={`nav__extra-container ${showMore ? "visible" : ""}`}
              ></div>
              <img
                onClick={() => setShowMore(!showMore)}
                src={HeaderToRightArrow}
                alt="Toggle menu"
                className={`arrow-icon ${showMore ? "rotated" : ""}`}
              /> */}
            </nav>
          )}
        </div>

        <div className="header__right">
          {isLittleMobile ? (
            <MobileMenu dinamicLink={dinamicLink} />
          ) : (
            <Link to={"/" + dinamicLink}>
              <button onClick={() => setActiveIndex(null)} className="authorize__button">{t(dinamicLink)}</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
