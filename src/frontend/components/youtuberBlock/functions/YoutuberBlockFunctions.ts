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
    setBtnsState,
    btnsState,
    userData,
    csrfToken,
    channelData,
    setChannelData
  } : HandleButtonClickProps) {
    const dataToDB = new DataToDB({ setUserData });

    let timeout1, timeout2, timeout3;

    if (!updatedData.updatedData.channelId) {
      this.logInErrorToast();
      return;
    }

    if (isProcessingRef.current[buttonId]) return;

    isProcessingRef.current[buttonId] = true;

    setBtnsState((prev) => ({
      ...prev,
      [buttonId]: { isProcessing: true, class: null },
    }));

    if (btnsState[buttonId]?.isProcessing) return;

    if (userData.userInformation.uses > 0) {
      try {
        const response = await dataToDB.getEmail(
          csrfToken,
          updatedData?.updatedData.channelId
        );

        if (!response || response.length === 0) {
          setBtnsState((prev) => ({
            ...prev,
            [buttonId]: {
              isProcessing: false,
              class: "fail",
            },
          }));
          isProcessingRef.current[buttonId] = false;
          return;
        }

        if (buttonId === 1) {
          dataToDB.validatePurchaseData(
            {
              thumbnail: channelData?.updatedData?.thumbnail || "",
              email: response?.email || "",
              channelName: response?.name || "",
            },
            userData?.userInformation?.user_id,
            csrfToken
          );
          if (channelData != null) {
            setChannelData((prevState) => {
              if (prevState == null) return null;
              return {
                ...prevState,
                updatedData: {
                  ...prevState.updatedData,
                  title: response?.name,
                },
              };
            });
          }
          console.log(
            `Текущий buttonId : ${buttonId}, response.email = ${response?.email}`
          );
          setBtnsState((prev) => ({
            ...prev,
            [buttonId]: {
              isProcessing: false,
              class: !response?.email ? "fail" : "success",
            },
          }));
        } else {
          dataToDB.validatePurchaseData(
            {
              thumbnail: channelData?.updatedData?.thumbnail || "",
              email: response?.email || "",
              channelName: channelData?.updatedData?.channel_name || "",
            },
            userData?.userInformation?.user_id,
            csrfToken
          );
          setBtnsState((prev) => ({
            ...prev,
            [buttonId]: {
              isProcessing: false,
              class: !response?.email ? "fail" : "success",
            },
          }));
        }
      } catch (error) {
        console.log("Ошибка в передаче данных:", error);
      } finally {
        timeout2 = setTimeout(() => {
          isProcessingRef.current[buttonId] = false;
          setBtnsState((prev) => ({
            ...prev,
            [buttonId]: {
              class: "default",
              isProcessing: false,
            },
          }));
        }, 2000);
      }
    } else {
      toast.error(i18n.t("You have no uses!"));
      return;
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }
}
export default YoutuberBlockFunctions;
