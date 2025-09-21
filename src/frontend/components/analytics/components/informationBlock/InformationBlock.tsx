import "./InformationBlock.css";

import percentIcon from "../../../../icons/percentIcon.jpg";
import blackPlusIcon from "../../../../icons/blackPlusIcon.png";
import { InformationBlockProps } from "../../../../types/types";

const InformationBlock = ({
  information,
  isBlack,
  isDotted,
}: InformationBlockProps) => {
  return (
    <>
      <div className={`information__block ${isBlack} ${isDotted}`}>
        <img
          src={blackPlusIcon}
          alt="plus"
          className="information__block-black_plus"
        />
        <div className="information__block-text_flex">
          <h3 className="information__block-number">1000</h3>
          <h4 className="information__block-typeof--data">Views</h4>
        </div>
      </div>
    </>
  );
};
export default InformationBlock;
