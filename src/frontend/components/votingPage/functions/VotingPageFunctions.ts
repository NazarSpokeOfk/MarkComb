import {toast} from "react-toastify";
import i18n from "i18next"
import { useNavigate } from "react-router-dom";

import DataToDB from "../../../Client-ServerMethods/dataToDB";

const dataToDb = new DataToDB();

import { SelectFeatureProps } from "../../../types/types";

class VotingPageFunctions {
    async selectFeature ({selectedFeature,isVoted,setIsVoted,navigate} : SelectFeatureProps) {
        if (isVoted) {
          return;
        }
        setIsVoted(true);
        const request = await dataToDb.makeVote(selectedFeature, 157);
        console.log(request);
        if (request.message === true) {
          toast.success(i18n.t("Thank you for your vote"));
        } else {
          toast.error(i18n.t("Unfortunately, we can't get your vote"));
        }
        setTimeout(() => {
          navigate("/search");
        }, 5000);
      };
}
export default VotingPageFunctions;