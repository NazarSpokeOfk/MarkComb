import {toast} from "react-toastify";
import i18n from "i18next";

import DataToDB from "../../../Client-ServerMethods/dataToDB";

import { RemovePurchaseProps } from "../../../types/types";

const dataToDb = new DataToDB();

class PurchasesFunctions {

    async removePurchase({index, user_id, channelName,csrfToken, setUserData} : RemovePurchaseProps){
        console.log(`Index : ${index}, user_id : ${user_id}, channelName : ${channelName}`)
        try {

            dataToDb.deletePurchaseData({channelName, userId : user_id, csrfToken})
    
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