import { toast } from "react-toastify";
import i18n from "i18next";

import DataToDB from "../../../Client-ServerMethods/dataToDB";

import {
  ClickAnimationProps,
  HandleButtonClickProps,
} from "../../../types/types";

class YoutuberBlockFunctions {
  async handleButtonClick({
    updatedData,
    setUserData,
    userData,
    csrfToken,
    channelData,
    setChannelData,
    setError,
    setContactDataStatus,
  }: HandleButtonClickProps) {
    const dataToDB = new DataToDB({ setUserData });

    if (userData.userInformation.uses === 0) {
      setError("No uses");
      return;
    }

    if (!updatedData) return;

    try {
      const response = await dataToDB.getEmail({
        csrfToken,
        channelId: updatedData.updatedData.channelId,
        setContactDataStatus,
      });

      dataToDB.validatePurchaseData({
        data: {
          thumbnail: channelData?.updatedData?.thumbnail || "",
          email: response?.email || "",
          channelName: response?.name || "",
        },
        userId: userData.userInformation.user_id,
        csrfToken,
        setError,
        setContactDataStatus
      });

      if (!channelData) return;

      setChannelData((prevState) => {
        if (prevState == null) return null;
        return {
          ...prevState,
          updatedData: {
            ...prevState.updatedData,
            channel_name: response?.name,
          },
        };
      });
    } catch (error) {
      setError("Error in data transfer");
      setContactDataStatus("fail");
    }
  }

  clickAnimation({
    contactDataStatus,
    setButtonText,
    buttonRef,
    setContactDataStatus
  }: ClickAnimationProps) {
    console.log(contactDataStatus);
    if (!contactDataStatus) return;

    //какой-то класс disolving
    if (buttonRef) buttonRef.current?.classList.add("disolving");

    if (contactDataStatus === "fail") setButtonText("❌");

    if (contactDataStatus === "success") setButtonText("✅");

    let removeDisolvingClassTimeout = setTimeout(() => {
      buttonRef.current?.classList.remove("disolving");
    }, 700);

    buttonRef.current?.classList.add("wave__effect");

    let setToDefaultTextTimeout = setTimeout(() => {
      buttonRef.current?.classList.remove("wave__effect");
    
      // Добавим уменьшение
      buttonRef.current?.classList.add("disolving");
    
      // Дождись анимации disolving, прежде чем вернуть текст
      setTimeout(() => {
        setButtonText("get data");
    
        // и сразу увеличим
        buttonRef.current?.classList.remove("disolving");
      }, 700); // длительность твоей анимации уменьшения
      setContactDataStatus("default")
    }, 3000);
    return () => {
      clearTimeout(setToDefaultTextTimeout);
      clearTimeout(removeDisolvingClassTimeout);
    };
  }
}
export default YoutuberBlockFunctions;
