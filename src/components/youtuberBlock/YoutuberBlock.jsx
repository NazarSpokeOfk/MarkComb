import { useTranslation } from "react-i18next";
import { useState } from "react";

import FeedbackForm from "../modal/FeedbackForm";
import RightBlock from "../rightBlock/rightBlock";

import Footer from "../footer/Footer";

import YoutuberImgOne from "../../images/YouTuber.jpg";
import YoutuberImgTwo from "../../images/Youtubertow.jpg";

import "./YoutuberBlock.css";
import "react-toastify/dist/ReactToastify.css";

import Envelope from "../../icons/email.svg";

const YoutuberBlock = ({
  channelData,
  SimilarChannelData,
  setSimilarChannelData,
  userData,
  isLoggedIn,
  setUserData,
  csrfToken,
}) => {

  const { t, i18n } = useTranslation();

  const [isFeedbackWillBeWrited, setIsFeedbackWillBeWrited] = useState(false);

  return (
    <>
      <section className="youtubers">
        <div className="container">
          <RightBlock
            isLoggedIn={isLoggedIn}
            userData={userData}
            channelData={channelData}
            csrfToken={csrfToken}
            setUserData={setUserData}
            isFilter={false}
            YoutuberImg={YoutuberImgOne}
          />

          <RightBlock
            isLoggedIn={isLoggedIn}
            userData={userData}
            channelData={SimilarChannelData}
            csrfToken={csrfToken}
            setUserData={setUserData}
            setChannelData={setSimilarChannelData}
            isFilter={true}
            YoutuberImg={YoutuberImgTwo}
          />
        </div>
      </section>

      <section className="feedback">
        <div className="container">
          <button
            onClick={() => {
              setIsFeedbackWillBeWrited((prev) => !prev);
            }}
            className="feedback__button"
          >
            <img
              src={Envelope}
              alt="Please,send us a feedback!"
              className="feedback__button-envelope"
            />
          </button>
        </div>
      </section>

      <FeedbackForm
        isFeedbackWillBeWrited={isFeedbackWillBeWrited}
        setIsFeedbackWillBeWrited={setIsFeedbackWillBeWrited}
      />
      <Footer />
    </>
  );
};

export default YoutuberBlock;
