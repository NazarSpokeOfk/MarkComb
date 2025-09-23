import "./InformationBlock.css";

import { useTranslation } from "react-i18next";

import { useState } from "react";

import percentIcon from "../../../../../../icons/percentIcon.png"
import backToNumbersIcon from "../../../../../../icons/backToNumbersIcon.png";
import blackPlusIcon from "../../../../../../icons/blackPlusIcon.png";
import whitePlusIcon from "../../../../../../icons/whitePlusIcon.png";
import { InformationBlockProps } from "../../../../../../types/types";

const InformationBlock = ({
  differencesInNumbers,
  differencesInPercents,
  isBlack,
}: InformationBlockProps) => {
  const { t } = useTranslation();

  const [currentValue, setCurrentValue] = useState<number>(differencesInNumbers);

  return (
    <>
      <div className="information__block-wrapper">
        <div className={`information__block ${isBlack}`}>
          <div className="information__block-subflex">
            <img
              src={isBlack === "black" ? whitePlusIcon : blackPlusIcon}
              alt="plus"
              className="information__block-black_plus"
            />
            <h3
              className={`information__block-number ${
                isBlack === "black" ? "white" : ""
              }`}
            >
              1000 
              {/* {currentValue === differencesInPercents ? "%" : ""} */}
            </h3>
          </div>
          <h4
            className={`information__block-typeof--data ${
              isBlack === "black" ? "white" : ""
            }`}
          >
            {t("Views")}
          </h4>
        </div>
        <button
          className="percent__button"
          onClick={() =>
            setCurrentValue((prev) =>
              prev === differencesInNumbers
                ? differencesInPercents
                : differencesInNumbers
            )
          }
        >
          <img
            src={
              currentValue === differencesInNumbers
                ? percentIcon
                : backToNumbersIcon
            }
            alt=""
            className="information__block-percent_img"
          />
        </button>
      </div>
    </>
  );
};
export default InformationBlock;
