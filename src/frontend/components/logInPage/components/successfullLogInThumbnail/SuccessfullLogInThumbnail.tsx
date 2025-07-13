import { useTranslation } from "react-i18next";
import { SuccessfullLogInThumbnailProps } from "../../../../types/types";


const SuccessfullLogInThumbnail = ({thumbnailRef,userName} : SuccessfullLogInThumbnailProps) => {
    const {t} = useTranslation();

    return (
        <div ref={thumbnailRef} className="default">
          <div className="log__in-result_block">
            <h2 className="log__in-result_block--title">
              {t("Welcome")}, {userName}
            </h2>
            <h2 className="emoji">👋</h2>
            <p className="log__in-result_block-subtitle shimmer-text">
              {t("Redirecting")}...
            </p>
          </div>
        </div>
    )
}

export default SuccessfullLogInThumbnail