import { toast } from "react-toastify";
import i18n from "i18next";

import DataToDB from "../../../Client-ServerMethods/dataToDB";

import { HandleButtonClickProps } from "../../../types/types";

class YoutuberBlockFunctions {
  logInErrorToast = () => {
    toast.error(
      i18n.t("Firstly, find the youtuber whose contact details you want to get")
    );
  };

  async handleButtonClick({
    updatedData,
    buttonId,
    setUserData,
    isProcessingRef,
    setDataGettingState,
    userData,
    csrfToken,
    channelData,
    setChannelData,
  }: HandleButtonClickProps) {
    const dataToDB = new DataToDB({ setUserData });

    let timeout1, timeout2, timeout3;

    if (!updatedData.updatedData.channelId) {
      this.logInErrorToast();
      return;
    }

    if (userData.userInformation.uses < 0) {
      return alert("No uses");
    }

    try {
      const response = await dataToDB.getEmail({
        csrfToken,
        channelId: updatedData?.updatedData.channelId,
        setDataGettingState
      });

      dataToDB.validatePurchaseData({
        data: {
          thumbnail: channelData?.updatedData?.thumbnail || "",
          email: response?.email || "",
          channelName: response?.name || "",
        },
        userId: userData?.userInformation?.user_id,
        csrfToken,
      });
      if (channelData != null) {
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
      }
    } catch (error) {
      console.log("Ошибка в передаче данных:", error);
    } finally {
      timeout2 = setTimeout(() => {
        setDataGettingState({state : "default"})
      }, 2000);
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }
}
export default YoutuberBlockFunctions;
