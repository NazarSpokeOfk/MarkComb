import DataToDB from "../../../Client-ServerMethods/dataToDB";

import {
  OnCardClickActionsProps,
  ValidateVideoFindingProps,
} from "../../../types/types";

class PromotionsFunctions {

  async validateVideoFinding({
    channelName,
    inputValue,
    setVideoData,
    setIsLoading,
    setCurrentAnalytics,
    setHasOldAnalytics
  }: ValidateVideoFindingProps) {
    const dataToDb = new DataToDB({ setVideoData });

    if (channelName && inputValue) {
      setIsLoading(true);
      dataToDb.collectAnalytics({
        channelName,
        inputValue,
        setIsLoading,
        setCurrentAnalytics,
        setHasOldAnalytics
      });
    } else {
      return;
    }
  }

  onCardClickActions = ({
    resultBlockRef,
    setVideoData,
    setInputValue,
    setChannelName,
    channel,
    setShowSearch,
    contentRefs,
    index,
    setShowResults,
  }: OnCardClickActionsProps) => {
    let timeout: ReturnType<typeof setTimeout>;
    resultBlockRef.current?.classList.remove("appearing");
    timeout = setTimeout(() => {
      setVideoData(null);
    }, 400);
    setInputValue("");
    setChannelName(channel.channel_name);
    setShowSearch(true);
    contentRefs.current.forEach((el) => {
      if (el) el.classList.remove("pressed");
      setShowResults(false);
    });
    const currentEl = contentRefs.current[index];
    if (currentEl) currentEl.classList.add("pressed");
  };
}
export default PromotionsFunctions;
