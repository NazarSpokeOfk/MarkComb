import "./TopPart.css";

import InformationBlock from "../informationBlock/InformationBlock";
import Divider from "../divider/Divider";

import PromotionsFunctions from "../../../../functions/PromotionFunctions";

import backToPromotionIcon from "../../../../../../icons/backToPromotionIcon.jpg";
import thumbnailImg from "../../../../../../images/videoThumbnailImage.png";
import { TopPartProps } from "../../../../../../types/types";

import loading from "../../../../../../images/loading-gif.gif";

const TopPart = ({
  thumbnail,
  title,
  videoId,
  isAnimating,
  setIsAnimating,
  containerToHide,
  containerToShow,
}: TopPartProps) => {
  const promotionFunctions = new PromotionsFunctions();
  return (
    <>
      <div className="top__part-first_block">
        <img src={thumbnailImg} alt="" className="first__block-thumbnail" />
        <h3 className="first__block-title">
          Rocket - mansplain | реакция и обзор
        </h3>
        <button
          onClick={() =>
            promotionFunctions.hideAndShowComponents({
              containerToHide,
              containerToShow,
              time: 600,
            })
          }
          className="first__block-back_to-promotion--button"
        >
          <img
            src={backToPromotionIcon}
            alt=""
            className="back_to-promotion--button"
          />
        </button>
      </div>

      <Divider text="growth for 7 days" />

      <div className="information__block-flex">
        <img src={loading} alt="" className="loading" />
        <img src={loading} alt="" className="loading" />
        <img src={loading} alt="" className="loading" />
        {/* <InformationBlock />
        <InformationBlock isBlack="black" /> */}
      </div>

      <Divider text="growth since yesterday" />

      <div className="information__block-flex">
        <img src={loading} alt="" className="loading" />
        <img src={loading} alt="" className="loading" />
        <img src={loading} alt="" className="loading" />
        {/* <InformationBlock isBlack="black" />
        <InformationBlock />
        <InformationBlock /> */}
      </div>
    </>
  );
};
export default TopPart;
