import { useRef, useEffect } from "react";

import { useTranslation } from "react-i18next";

import DataToDB from "../../dataToDB/dataToDB";

import "./VerifModal.css";

import { toast } from "react-toastify";

import VerifLayout from "./verifLayout";

const VerifModal = ({
  isDataFilledIn,
  signInData,
  setIsLoggedIn,
  setUserData,
  setSignInData,
  isLoggedIn,
  isPasswordWillBeReset,
  setCsrfToken
}) => {

  const { t } = useTranslation();
  const dataToDB = new DataToDB(setIsLoggedIn, setUserData);
  const modalRef = useRef();

  useEffect(() => {
    console.log('isDataFilledIn', isDataFilledIn);

    if (isDataFilledIn) {
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

    makeFetchForCode();
  }, [isDataFilledIn]);

  const makeFetchForCode = async () => {
    try {
      let email = signInData.email
      console.log(signInData);
      const result = await fetch(`http://localhost:5001/api/verification`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({email}),
      });
      if (result.ok) {
        return Promise.resolve();
      } else {
        console.log("Че за нахуй");
      }
    } catch (error) {
      toast.error("We occured a server error sending verification code. Please, try again later")
    }
  };

  return (
    <>
      <VerifLayout
        modalRef={modalRef}
        classExpression={`modal__overlay-verif`}
        titleText={t("Enter the verification code that was sent to your email")}
        onChangeAction={(e) => {
          const { value } = e.target;
          setSignInData((prevData) => ({
            ...prevData,
            verification_code: value,
          }));
        }}
        onClickAction={() => {
          console.log(
            "Код, отправленный с фронта:",
            signInData.verification_code
          );
          dataToDB.validateSignIn(signInData,setCsrfToken).then((response) => {
            console.log(response);
            if (response.status != true) {
              toast.error("Wrong authentication code, or code expired.");
            } else {
              modalRef.current.classList.remove("open")
              document.body.style.overflow = "";
            }
          });
        }}
        isDataFilledIn={isDataFilledIn}
        isLoggedIn={isLoggedIn}
        setSignInData={setSignInData}
        signInData={signInData}
      />
    </>
  );
};

export default VerifModal;
