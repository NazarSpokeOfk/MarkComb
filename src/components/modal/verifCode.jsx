
import { useState, useEffect , useRef } from "react";
import { toast } from "react-toastify";

import VerifLayout from "./verifLayout";
import DataToDB from "../../dataToDB/dataToDB";


const VerifCode = ({logInData, isPasswordWillBeReset , setIsPasswordWillBeReset ,  setIsVerificationCodeCorrect}) => {

  const [verification_code, setVerificationCode] = useState("");

  const modalRef = useRef({})

  useEffect(() => {
    console.log("Код верификации : ", verification_code);
  }, [verification_code]);

  const dataToDB = new DataToDB();

  const makeFetchForCode = async () => {
    const email = logInData.email
    try {
      console.log("Запрос исполнен");
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
      throw new Error(error);
    }
  };

  useEffect(() => {
    makeFetchForCode()
  },[])

  return (
    <VerifLayout
      modalRef={modalRef}
      classExpression={`modal__overlay-verif ${
        logInData && isPasswordWillBeReset ? "open" : ""
      }`}
      titleText={"Enter the verification code that was sent to your email"}
      onChangeAction={(e) => {
        const { value } = e.target;
        setVerificationCode(value);
      }}
      onClickAction={() => {
        console.log(
          "Код, отправленный с фронта:",
          verification_code
        );
        dataToDB.isVerificationCodeCorrect(logInData.email,verification_code).then((response) => {
          console.log(response);
          if (response.message != true) {
            toast.error("Wrong authentication code, or code expired.");
          } else {
            modalRef.current.classList.remove("open")
            setTimeout(() => {
              setIsPasswordWillBeReset(false)
              setIsVerificationCodeCorrect(true)
            }, 600);
          }
        });
      }}
    />
  );
};
export default VerifCode;
