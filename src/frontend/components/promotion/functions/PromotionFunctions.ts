import DataToDB from "../../../Client-ServerMethods/dataToDB";

import {
  HandleProps,
  HideAndShowComponentsProps,
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

  hideAndShowComponents = ({ containerToHide, containerToShow, time }: HideAndShowComponentsProps) => {
    const toHide = containerToHide.current;
    const toShow = containerToShow.current;
  
    if (!toHide || !toShow) return;
  
    // Сбросим старые классы перед стартом
    toHide.classList.remove("slide-in", "slide-out", "hide");
    toShow.classList.remove("slide-in", "slide-out", "hide");
  
    // Запускаем анимацию скрытия
    toHide.classList.add("slide-out");
  
    const onHideEnd = () => {
      toHide.classList.remove("slide-out"); // убираем класс анимации
      toHide.style.display = "none";        // окончательно скрываем
  
      // Подготавливаем показываемый блок
      toShow.style.display = "block";
      toShow.classList.add("slide-in");
  
      const onShowEnd = () => {
        toShow.classList.remove("slide-in"); // убираем класс после анимации
        toShow.removeEventListener("transitionend", onShowEnd);
      };
  
      toShow.addEventListener("transitionend", onShowEnd);
      toHide.removeEventListener("transitionend", onHideEnd);
    };
  
    toHide.addEventListener("transitionend", onHideEnd);
  };
  
}
export default PromotionsFunctions;
