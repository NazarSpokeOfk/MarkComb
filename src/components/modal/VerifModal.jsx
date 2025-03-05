import { useRef, useEffect } from "react";

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
}) => {
  const dataToDB = new DataToDB(setIsLoggedIn, setUserData);
  const modalRef = useRef();

  useEffect(() => {
    makeFetchForCode();
  }, []);

  const makeFetchForCode = async () => {
    try {
      console.log("Запрос исполнен");
      const result = await fetch("http://localhost:5001/api/verification", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ signInData }),
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
    <>
      <VerifLayout
        classExpression={`modal__overlay-verif ${
          isDataFilledIn && !isLoggedIn ? "open" : ""
        }`}
        titleText={"Enter the verification code that was sent to your email"}
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
          dataToDB.validateSignIn(signInData).then((response) => {
            console.log(response);
            if (response.status != true) {
              toast.error("Wrong authentication code, or code expired.");
            } else {
              toast.success("Successfull registration!", {
                autoClose: 3000,
              });
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
