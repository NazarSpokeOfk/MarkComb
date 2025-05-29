import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DataToDB from "../../dataToDB/dataToDB";

import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import Header from "../header/Header";
import Footer from "../footer/Footer";

import "./votingPage.css";

const VotingPage = ({ userData }) => {
  const { t } = useTranslation();

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const navigate = useNavigate();

  const dataToDB = new DataToDB();

  const [isVoted, setIsVoted] = useState(false);

  const updatesVariants = {
    one: {
      name: "Dead channels Filtration",
      description: "We will improve the filter system so that you don't accidentally get “dead” channels.",
    },
    two: {
      name: "Recommendation System",
      description: "We will put in place a system to analyze your interests, and suggest the right channels for you.",
    },
    three: {
      name: "Purchased data export",
      description: "After purchasing contact data, you will be able to export the purchased data in any format you like: json/text file/word etc.",
    },
  };

  const selectFeature = async (selectedFeature) => {
    if (isVoted) {
      return;
    }
    setIsVoted(true);
    const request = await dataToDB.makeVote(selectedFeature, 157);
    console.log(request);
    if (request.message === true) {
      toast.success(t("Thank you for your vote."));
    } else {
      toast.error(t("Unfortunately, we can't get your vote"));
    }
    setTimeout(() => {
      navigate("/search");
    }, 5000);
  };

  return (
    <>
      <Header />

      <div className="container">
        {userData?.userInformation?.isVoteEnabled ? (
          <>
            <h1 className="vote__title">
              {t("Voting for new features in")} <br />
              Mark<span>Comb</span>
            </h1>
            <div className="voting__blocks">
              {Object.keys(updatesVariants).map((key) => {
                const variant = updatesVariants[key];
                return (
                  <div key={key} className="voting__block">
                    <h3 className="voting__block-title">{t(variant.name)}</h3>
                    <p className="voting__block-description">
                      {t(variant.description)}
                    </p>
                    <button
                      onClick={() => {
                        selectFeature(variant.name);
                      }}
                      className="vote__button"
                    >
                      {t("Vo")}<span>{t("te")}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <h2 className="become__sponsor-title">
              {t("To vote, you need to become a sponsor. Support the project and influence its development!")}
            </h2>
            <button className="become__sponsor-button">
              {t("Become sponsor")}
              <a href="" className="become__sponsor-link"></a>
            </button>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};
export default VotingPage;
