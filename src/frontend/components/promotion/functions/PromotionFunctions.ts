import DataToDB from "../../../Client-ServerMethods/dataToDB";

import {
  HandleProps,
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

  handleNext = ({isAnimating,setIsAnimating,setPage} : HandleProps) => {
    if(isAnimating) return;
    setIsAnimating(true);
    setPage((p) => p + 1);
  }

  handlePrevious = ({isAnimating,setIsAnimating,setPage} : HandleProps) => {
    if(isAnimating) return;
    setIsAnimating(true);
    setPage((p) => p === 0 ? 0 : p - 1);
  }
}
export default PromotionsFunctions;
