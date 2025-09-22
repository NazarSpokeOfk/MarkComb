import { DividerProps } from "../../../../types/types";
import "./Divider.css"

import { useTranslation } from "react-i18next";

const Divider = ({text} : DividerProps) => {
    const {t} = useTranslation();
    return (
      <div className="divider__block">
        <h3 className="divider__text">{t(text)}</h3>
        <hr className="divider"/>
      </div>
    )
}
export default Divider;