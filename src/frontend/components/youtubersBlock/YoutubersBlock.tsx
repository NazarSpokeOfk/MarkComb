import { useTranslation } from "react-i18next";
import { useState } from "react";

import FeedbackForm from "../modal/FeedbackForm";
import YouTuberBlock from "../youtuberBlock/YoutuberBlock";

import Footer from "../footer/Footer";

import YoutuberImgOne from "../../images/YouTuber.jpg";
import YoutuberImgTwo from "../../images/Youtubertow.jpg";

import { YouTubersBlockProps } from "../../types/types";

import "./YoutubersBlock.css";
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
} : YouTubersBlockProps) => {

  const [isFeedbackWillBeWrited, setIsFeedbackWillBeWrited] = useState(false);

  return (
    <>
      <section className="youtubers">
        <div className="container">
          <div className="youtubers__block-flex">
          <YouTuberBlock
            isLoggedIn={isLoggedIn}
            userData={userData}
            channelData={channelData}
            csrfToken={csrfToken}
            setUserData={setUserData}
            isFilter={false}
            YoutuberImg={YoutuberImgOne}
            buttonId={0}
            setChannelData={setSimilarChannelData}
          />

          <YouTuberBlock
            isLoggedIn={isLoggedIn}
            userData={userData}
            channelData={SimilarChannelData}
            csrfToken={csrfToken}
            setUserData={setUserData}
            setChannelData={setSimilarChannelData}
            isFilter={true}
            YoutuberImg={YoutuberImgTwo}
            buttonId={1}
          />
          </div>
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
    </>
  );
};

export default YoutuberBlock;
