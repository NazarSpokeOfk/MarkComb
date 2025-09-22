import "./TopPart.css"

import InformationBlock from "../../components/informationBlock/InformationBlock";
import Divider from "../divider/Divider";

import backToPromotionIcon from "../../../../icons/backToPromotionIcon.jpg";
import thumbnailImg from "../../../../images/videoThumbnailImage.png";
import { TopPartProps } from "../../../../types/types";

const TopPart = ({ thumbnail, title, videoId }: TopPartProps) => {
  return (
    <>
      <div className="top__part-first_block">
        <img src={thumbnailImg} alt="" className="first__block-thumbnail" />
        <h3 className="first__block-title">
          Rocket - mansplain | реакция и обзор
        </h3>
        <button className="first__block-back_to-promotion--button">
          <img src={backToPromotionIcon} alt="" className="back_to-promotion--button" />
        </button>
      </div>

      <Divider text="growth for 7 days"/>

      <div className="information__block-flex">
      <InformationBlock/>
      <InformationBlock/>
      <InformationBlock isBlack="black"/>
      </div>  

      <Divider text="growth since yesterday"/>
    </>
  );
};
export default TopPart;
