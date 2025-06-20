import DataToDB from "../../../Client-ServerMethods/dataToDB"
import {toast} from "react-toastify"

import { ValidateAndSendReviewProps } from "../../../types/types";

import i18n from "i18next"
 
const dataToDB = new DataToDB();

class FeedbackFormFunctions {
    async validateAndSendReview({reviewText,websiteMark,setIsFeedbackWillBeWrited} : ValidateAndSendReviewProps) {
        if (!reviewText && !websiteMark) {
          return;
        }
    
        const result = await dataToDB.addReview(reviewText, websiteMark);
    
        if (result.message === false) {
          toast.warn(i18n.t("Unfortunately,we can't get your review. Please,try later"));
          setTimeout(() => {
            toast.dismiss();
            setIsFeedbackWillBeWrited(false);
          }, 2000);
        } else if (result.message === true) {
          toast.success(i18n.t("Thanks for your review, you help us improve MarkComb!"));
          setTimeout(() => {
            toast.dismiss();
            setIsFeedbackWillBeWrited(false);
          }, 2000);
        }
      };
}
export default FeedbackFormFunctions