import { toast } from "react-toastify";
import i18n from "i18next";

import DataToDB from "../../../Client-ServerMethods/dataToDB";

import {
  HandleDeleteProps,
  RemovePurchaseProps,
} from "../../../types/types";

const dataToDb = new DataToDB();

class PurchasesFunctions {
  async removePurchase({
    user_id,
    channelName,
    csrfToken,
    setUserData,
    contentRefs,
    transaction_id,
  }: RemovePurchaseProps) {
    const el = contentRefs.current[transaction_id];
    if (el) {
      el.classList.add("fall-off");
      setTimeout(() => {
        try {
          dataToDb.deletePurchaseData({
            channelName,
            userId: user_id,
            csrfToken,
          });

          setUserData((prevData) => ({
            ...prevData,
            channels: prevData.channels.filter(
              (p) => p.transaction_id !== transaction_id
            ),
          }));

          delete contentRefs.current[transaction_id]; // Чистим ref
        } catch (error) {
          console.error("Error removing channel:", error);
        }
      }, 500);
    }
  }
}

export default PurchasesFunctions;
