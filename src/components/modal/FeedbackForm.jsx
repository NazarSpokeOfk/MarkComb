import { toast } from "react-toastify";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import arrow from "../../icons/arrow.svg";

import "./FeedbackForm.css";

const FeedbackForm = ({
  setIsFeedbackWillBeWrited,
  isFeedbackWillBeWrited,
}) => {
  const { t } = useTranslation();

  const [reviewText, setReviewText] = useState("");

  const [websiteMark, setWebsiteMark] = useState();

  const validateAndSendReview = async () => {
    if (!reviewText && !websiteMark) {
      return;
    }

    const request = await fetch(`https://owa.markcomb.com/api/review`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify({ reviewText, websiteMark }),
    });

    const result = await request.json();
    if (result.status === false) {
      toast.warn(t("Unfortunately,we can't get your review. Please,try later"));
      setTimeout(() => {
        toast.dismiss();
        setIsFeedbackWillBeWrited(false);
      }, 2000);
    } else if (result.status === true) {
      toast.success(t("Thanks for your review, you help us improve MarkComb!"));
      setTimeout(() => {
        toast.dismiss();
        setIsFeedbackWillBeWrited(false);
      }, 2000);
    } else {
      toast.error(t("Too many requests!"));
      setTimeout(() => {
        toast.dismiss();
        setIsFeedbackWillBeWrited(false);
      }, 2000);
    }
  };

  return (
    <>
      <div className="container">
        <div
          className={`feedback__modal-block ${
            isFeedbackWillBeWrited ? "open" : ""
          }`}
        >
          <h1 className="feedback__block-title">
            {t("Please,leave your mark and review about")}{" "}
            <span>
              Mark<span>Comb</span>
            </span>
          </h1>

          <div className="feedback__marks-block">
            <button
              onClick={() => {
                setWebsiteMark(1);
              }}
              id="one"
              className={`feedback-mark ${
                websiteMark === 1 ? "oneactive" : ""
              }`}
            >
              1
            </button>
            <button
              onClick={() => {
                setWebsiteMark(2);
              }}
              id="two"
              className={`feedback-mark ${
                websiteMark === 2 ? "twoactive" : ""
              }`}
            >
              2
            </button>
            <button
              onClick={() => {
                setWebsiteMark(3);
              }}
              id="three"
              className={`feedback-mark ${
                websiteMark === 3 ? "threeactive" : ""
              }`}
            >
              3
            </button>
            <button
              onClick={() => {
                setWebsiteMark(4);
              }}
              id="four"
              className={`feedback-mark ${
                websiteMark === 4 ? "fouractive" : ""
              }`}
            >
              4
            </button>
            <button
              onClick={() => {
                setWebsiteMark(5);
              }}
              id="five"
              className={`feedback-mark ${
                websiteMark === 5 ? "fiveactive" : ""
              }`}
            >
              5
            </button>
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => {
              const value = e.target.value;
              setReviewText(value);
            }}
            placeholder={t("Optional, but we look forward to your feedback")}
            className="feedback__modal-input"
          ></textarea>
          <button
            onClick={() => {
              validateAndSendReview();
            }}
            id="submit"
            className="feedback-mark"
          >
            <img src={arrow} alt="Submit a review" />
          </button>
        </div>
      </div>
    </>
  );
};
export default FeedbackForm;
