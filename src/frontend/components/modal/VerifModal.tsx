import { useRef, useEffect } from "react";

import { useTranslation } from "react-i18next";

import DataToDB from "../../Client-ServerMethods/dataToDB";

import { VerifModalProps } from "../../types/types";

import "./css/VerifModal.css";

import { toast } from "react-toastify";

import VerifLayout from "./verifLayout";

import closeModal from "../../utilities/closeModal"

import VerifModalFunctions from "./functions/VerifModalFunctions"

const VerifModal = ({
  isDataFilledIn,
  signInData,
  setIsLoggedIn,
  setUserData,
  setSignInData,
  isLoggedIn,
}: VerifModalProps) => {

  const verifModalProps = new VerifModalFunctions();

  const { t } = useTranslation();
  const dataToDB = new DataToDB({ setIsLoggedIn, setUserData });
  const modalRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    verifModalProps.fetchData({isDataFilledIn,modalRef,signInData});
  }, [isDataFilledIn]);
  
  return (
    <>
        <VerifLayout
          modalRef={modalRef}
          classExpression={`modal__overlay-verif`}
          titleText={t(
            "Enter the verification code that was sent to your email"
          )}
          onChangeAction={(e: React.ChangeEvent<HTMLInputElement>) => {
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
            dataToDB.validateSignIn(signInData).then((result) => {
              console.log(result);
              if (result.status === "ok") {
                closeModal({ ref: modalRef });
              } else if (result.status === "exists") {
                toast.warn("This account already exists.");
                closeModal({ ref: modalRef });
              } else if ((result.status = "wrong")) {
                toast.error("Wrong verification code");
              } else if ((result.status = "invalid")) {
                toast.error("There was an error during registration");
                closeModal({ ref: modalRef });
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
