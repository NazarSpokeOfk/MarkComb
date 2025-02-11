import { useRef, useEffect } from "react";

import DataToDB from "../../dataToDB/dataToDB";

import "./VerifModal.css";

import next from "../../icons/next.png";
import { toast, ToastContainer } from "react-toastify";

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
    <div className="container">
      <div
        ref={modalRef}
        className={`modal__overlay-verif ${
          isDataFilledIn && !isLoggedIn ? "open" : ""
        }`}
      >
        <div className="modal__block-verif">
          <h2 className="modal__title-verif">
            Enter the verification code that was sent to your email
          </h2>
          <input
            required
            type="text"
            placeholder="verification code"
            className="modal__input-verif"
            onChange={(e) => {
              const { value } = e.target;
              setSignInData((prevData) => ({
                ...prevData,
                verification_code: value,
              }));
            }}
          />
          <button
            onClick={() => {
              console.log("Код, отправленный с фронта:",signInData.verification_code)
              dataToDB.validateSignIn(signInData).then((response) => {
                console.log(response)
                if(response.status != true){
                  toast.error("Wrong authentication code, or code expired.")
                } else {
                  toast.success("Successfull registration!",{autoClose: 3000})
                }
              })
            }}
            type="submit"
            className="modal__verif-button"
            id="email"
          >
            <img className="next_btn-img" src={next} alt="click here" />
          </button>
          </div>
      </div>
      <ToastContainer autoClose={3000} />  
    </div>
  );
};

export default VerifModal;
