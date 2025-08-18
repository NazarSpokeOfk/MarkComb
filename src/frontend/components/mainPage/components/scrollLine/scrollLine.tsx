import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { ScrollLineProps } from "../../../../types/types";

import "./css/scrollLine.css";
const ScrollLine = ({ stringArray, setIsFilterCTAActive }: ScrollLineProps) => {
  const { t } = useTranslation();

  const items = [...stringArray, ...stringArray, ...stringArray];

  return (
    <>
      <div className="filter__line-flex">
        <div className="scroll-content">
          {items.map((value, index) => (
            <Link
              onClick={() => {
                setIsFilterCTAActive(true);
              }}
              className="Link-react-router-dom"
              to={"/search"}
            >
              <h4 key={index} className="filter__line-subtext">
                {t(value)}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
export default ScrollLine;
