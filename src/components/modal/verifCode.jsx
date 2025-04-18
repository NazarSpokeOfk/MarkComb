import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import VerifLayout from "./verifLayout";
import DataToDB from "../../dataToDB/dataToDB";

const VerifCode = ({
  logInData,
  isPasswordWillBeReset,
  setIsPasswordWillBeReset,
  setIsVerificationCodeCorrect,
}) => {
  const [verification_code, setVerificationCode] = useState("");

  const modalRef = useRef({});

  useEffect(() => {
    makeFetchForCode();
    if (isPasswordWillBeReset) {
      setTimeout(() => {
        modalRef.current.classList.add("open");
        document.body.style.overflow = "hidden";
      }, 100);
    } else {
      modalRef.current.classList.remove("open");
      setTimeout(() => {
        modalRef.current.style.visibility = "hidden";
      }, 600);
    }
  }, [isPasswordWillBeReset]);

  const dataToDB = new DataToDB();

  const makeFetchForCode = async () => {
    const email = logInData.email;
    try {
      console.log("Запрос исполнен");
      const result = await fetch(`https://owa.markcomb.com/api/verification`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({ email }),
      });
      if (result.ok) {
        return Promise.resolve();
      } else {
        console.log("Че за нахуй");
      }
    } catch (error) {
      throw new Error(error);
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
          .isVerificationCodeCorrect(logInData.email, verification_code)
          .then((response) => {
            console.log(response);
            if (response.message != true) {
              toast.error("Wrong authentication code, or code expired.");
            } else {
              modalRef.current.classList.remove("open");
              setTimeout(() => {
                setIsPasswordWillBeReset(false);
                setIsVerificationCodeCorrect(true);
              }, 600);
            }
          });
      }}
    />
  );
};
export default VerifCode;
