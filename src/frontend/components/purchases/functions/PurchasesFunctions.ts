import {toast} from "react-toastify";
import i18n from "i18next";

import DataToDB from "../../../Client-ServerMethods/dataToDB";

import { RemovePurchaseProps } from "../../../types/types";

const dataToDb = new DataToDB();

class PurchasesFunctions {

    async removePurchase({index, user_id, channelName,csrfToken, setUserData} : RemovePurchaseProps){
        console.log(`Index : ${index}, user_id : ${user_id}, channelName : ${channelName}`)
        try {
          await toast.promise(
            dataToDb.deletePurchaseData(channelName, user_id, csrfToken),
            {
              pending: (i18n.t("Removing purchase...")),
              success: (i18n.t("Purchase has successfully removed!")),
              error: (i18n.t("There was an error during removing purchase!")),
            }
          );
    
          setUserData((prevData) => ({
            ...prevData,
            channels: prevData.channels.filter((_, i) => i !== index),
          }));
        } catch (error) {
          console.error("Error removing channel:", error);
        }
    };
}

export default PurchasesFunctions