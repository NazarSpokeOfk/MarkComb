import DataToDB from "../../../Client-ServerMethods/dataToDB";

import {
  HandleToggleProps,
  ToggleMemberListStyleProps,
  ValidateVideoFindingProps,
} from "../../../types/types";

class PromotionsFunctions {
  handleToggle({ secondYouTubersContainerRef, triggerBtnRef } : HandleToggleProps) {
    secondYouTubersContainerRef?.current?.classList.toggle("active");
    triggerBtnRef?.current?.classList.toggle("rotate");
  }

  toggleMemberListStyle({ index, currentGroup, setActiveIndex } : ToggleMemberListStyleProps) {
    const normalizedIndex = index + (currentGroup === 2 ? 5 : 0);
    setActiveIndex(normalizedIndex);
  }

  async validateVideoFinding({ channelName, inputValue, setVideoData } : ValidateVideoFindingProps) {

    const dataToDb = new DataToDB({setVideoData});

    if (channelName && inputValue) {
        dataToDb.checkStatisticsOfVideo({type : "video", channelName, inputValue,videoId : null})
    } else {
      return;
    }
  }
}
export default PromotionsFunctions;
