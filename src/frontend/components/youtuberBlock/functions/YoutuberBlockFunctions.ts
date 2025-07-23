import { toast } from "react-toastify";
import i18n from "i18next";

import DataToDB from "../../../Client-ServerMethods/dataToDB";

import { HandleButtonClickProps } from "../../../types/types";

class YoutuberBlockFunctions {
  async handleButtonClick({
    updatedData,
    setUserData,
    userData,
    csrfToken,
    channelData,
    setChannelData,
    setError,
    setContactDataStatus
  }: HandleButtonClickProps) {
    const dataToDB = new DataToDB({ setUserData });

    let timeout1, timeout2, timeout3;

    if (userData.userInformation.uses < 0) {
      setError("No uses");
    }

    try {
      if (!updatedData) {
        return;
      }

      const response = await dataToDB.getEmail({
        csrfToken,
        channelId: updatedData?.updatedData.channelId,
      });

      dataToDB.validatePurchaseData({
        data: {
          thumbnail: channelData?.updatedData?.thumbnail || "",
          email: response?.email || "",
          channelName: response?.name || "",
        },
        userId: userData?.userInformation?.user_id,
        csrfToken,
        setError
      });
      if (channelData != null) {
        setChannelData((prevState) => {
          if (prevState == null) return null;
          setContactDataStatus("success")
          return {
            ...prevState,
            updatedData: {
              ...prevState.updatedData,
              channelName: response?.name,
            },
          };
        });
      }
    } catch (error) {
      setError("Error in data transfer");
    // } finally {
    //   timeout2 = setTimeout(() => {
    //     setDataGettingState({ state: "default" });
    //   }, 2000);
    }
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }
}
export default YoutuberBlockFunctions;
