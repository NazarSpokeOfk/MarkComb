import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";


import VerifLayout from "./verifLayout";
import DataToDB from "../../dataToDB/dataToDB";

import closeModal from "../../utilities/closeModal";
import openModal from "../../utilities/openModal";

import { VerifCodeProps } from "../../types/types";

const VerifCode = ({
  email,
  isTriggered,
  setIsTriggered,
  setIsVerificationCodeCorrect,
  setIsLoggedIn,
  setUserData
} : VerifCodeProps) => {

  const { t } = useTranslation();

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const [verification_code, setVerificationCode] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    makeFetchForCode();
    if (isTriggered) {
      setTimeout(() => {
        openModal({ref : modalRef})
      }, 100);
    } else {
      closeModal({ref : modalRef})
      setTimeout(() => {
        modalRef.current!.style.visibility = "hidden";
      }, 600);
    }
  }, [isTriggered]);

  const dataToDB = new DataToDB({setIsLoggedIn,setUserData});

  const makeFetchForCode = async () => {
    try {
      const result = await fetch(`${apiBaseUrl}/verification`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ email }),
      });
      if (result.ok) {
        return Promise.resolve();
      } else {
        console.log(result);
      }
    } catch (error) {
      toast.error(t("There was an error during sending verification code"))
    }
  };

  return (
    <VerifLayout
      modalRef={modalRef}
      classExpression={`modal__overlay-verif`}
      titleText={"Enter the verification code that was sent to your email"}
      onChangeAction={(e) => {
        const { value } = e.target;
        setVerificationCode(value);
      }}
      onClickAction={() => {
        console.log("Код, отправленный с фронта:", verification_code);
        dataToDB
          .isVerificationCodeCorrect(email, verification_code)
          .then((response) => {
            console.log(response);
            if (response.message != true) {
              toast.error(t("Wrong authentication code, or code expired."));
            } else {
              closeModal({ref : modalRef})
              setTimeout(() => {
                setIsTriggered(true);
                setIsVerificationCodeCorrect(true);
              }, 600);
            }
          });
      }}
    />
  );
};
export default VerifCode;
