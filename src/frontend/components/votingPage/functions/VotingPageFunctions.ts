import { toast } from "react-toastify";
import i18n from "i18next";
import { useNavigate } from "react-router-dom";

import DataToDB from "../../../Client-ServerMethods/dataToDB";

const dataToDb = new DataToDB();

import { SelectFeatureProps } from "../../../types/types";

class VotingPageFunctions {
  async selectFeature({
    selectedFeature,
    isVoted,
    setIsVoted,
    navigate,
    userData,
  }: SelectFeatureProps) {
    if (isVoted) {
      return;
    }
    setIsVoted(true);
    const request = await dataToDb.makeVote({
      featureName: selectedFeature,
      user_id: userData.userInformation.user_id,
    });
    console.log(request);
    if (request.message === true) {
      toast.success(i18n.t("Thank you for your vote"));
    } else {
      toast.error(i18n.t("Unfortunately, we can't get your vote"));
    }
    setTimeout(() => {
      navigate("/");
    }, 5000);
  }
}
export default VotingPageFunctions;
