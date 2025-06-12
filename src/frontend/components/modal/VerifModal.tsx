import { useRef, useEffect } from "react";

import { useTranslation } from "react-i18next";

import DataToDB from "../../dataToDB/dataToDB";

import { VerifModalProps } from "../../types/types";

import "./css/VerifModal.css";

import { toast } from "react-toastify";

import VerifLayout from "./verifLayout";

import closeModal from "../../utilities/closeModal"
import openModal from "../../utilities/openModal";

const VerifModal = ({
  isDataFilledIn,
  signInData,
  setIsLoggedIn,
  setUserData,
  setSignInData,
  isLoggedIn,
}: VerifModalProps) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const { t } = useTranslation();
  const dataToDB = new DataToDB({ setIsLoggedIn, setUserData });
  const modalRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      console.log("isDataFilledIn", isDataFilledIn);
  
      const accountExists = await makeFetchForCode();
  
      if (isDataFilledIn && !accountExists) {
        setTimeout(() => {
          openModal({ref : modalRef})
        }, 100);
      } else {
        toast.error("Account exists")
        closeModal({ref : modalRef})
        setTimeout(() => {
          if (modalRef.current) {
            modalRef.current.style.visibility = "hidden";
          }
        }, 600);
      }
    };
  
    fetchData();
  }, [isDataFilledIn]);
  
  const makeFetchForCode = async (): Promise<boolean> => {
    try {
      const email = signInData.email;
      console.log(signInData);
  
      const result = await fetch(`${apiBaseUrl}/verification`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ email, operationCode : 3 }),
      });
  
      if (result.ok) {
        return false; 
      } else {
        return true;  
      }
    } catch (error) {
      toast.error(
        "We occured a server error sending verification code. Please, try again later"
      );
      return true;
    }
  };
  

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
