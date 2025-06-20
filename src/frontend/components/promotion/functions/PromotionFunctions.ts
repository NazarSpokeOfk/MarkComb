import { toast } from "react-toastify";
import DataToDB from "../../../Client-ServerMethods/dataToDB";
import i18n from "i18next";

import {
  HandleToggleProps,
  ToggleMemberListStyleProps,
  ValidateVideoFindingProps,
} from "../../../types/types";

const dataToDb = new DataToDB();

class PromotionsFunctions {
  handleToggle({ secondYouTubersContainerRef, triggerBtnRef } : HandleToggleProps) {
    secondYouTubersContainerRef?.current?.classList.toggle("active");
    triggerBtnRef?.current?.classList.toggle("rotate");
  }

  toggleMemberListStyle({ index, currentGroup, setActiveIndex } : ToggleMemberListStyleProps) {
    const normalizedIndex = index + (currentGroup === 2 ? 5 : 0);
    setActiveIndex(normalizedIndex);
  }

  async validateVideoFinding({ channelName, inputValue } : ValidateVideoFindingProps) {
    if (channelName && inputValue) {
      await toast.promise(
        dataToDb.checkStatisticsOfVideo("video", channelName, inputValue, null),
        {
          pending: i18n.t("Looking for video..."),
          error: i18n.t("We couldn't find video"),
        }
      );
    } else {
      return;
    }
  }
}
export default PromotionsFunctions;
