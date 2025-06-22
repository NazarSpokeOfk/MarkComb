import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";


import VerifLayout from "./verifLayout";
import DataToDB from "../../Client-ServerMethods/dataToDB";

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

  const [verification_code, setVerificationCode] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  const dataToDB = new DataToDB({setIsLoggedIn,setUserData});

  useEffect(() => {
    dataToDB.makeFetchForCode({email});
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
          .isVerificationCodeCorrect({email, verificationCode : verification_code})
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
