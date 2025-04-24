import { useState, useEffect, useRef } from "react";
import VerifLayout from "./verifLayout";
import { toast } from "react-toastify";

import DataToDB from "../../dataToDB/dataToDB";

const NewPassword = ({
  email,
  isVerificationCodeCorrect,
  setIsVerificationCodeCorrect,
}) => {
  useEffect(() => {
    console.log(email);
  }, [email]);

  const modalRef = useRef({});

  useEffect(() => {
    if (isVerificationCodeCorrect) {
      setTimeout(() => {
        modalRef.current.classList.add("open");
        document.body.style.overflow = "hidden";
      }, 100);
    } else {
      modalRef.current.classList.remove("open");
      setTimeout(() => {
        modalRef.current.style.visibility = "hidden";
      }, 600); // Ждём окончания анимации перед скрытием
    }
  }, [isVerificationCodeCorrect]);

  const dataToDB = new DataToDB();

  const [newPassword, setNewPassword] = useState(null);

  return (
    <VerifLayout
      modalRef={modalRef}
      classExpression={`modal__overlay-verif `}
      titleText={"Enter your new password"}
      onChangeAction={(e) => {
        const { value } = e.target;
        setNewPassword(value);
      }}
      onClickAction={() => {
        console.log("Новый пароль, отправленный с фронта:", newPassword);
        dataToDB.changePassword(newPassword, email).then((response) => {
          console.log(response);
          if (response.message !== true) {
            toast.error("Account does not exist");
            return;
          }

          toast.success(("Password changed."), {
            autoClose: 1000,
          });

          setTimeout(() => {
            modalRef.current.classList.remove("open");
            document.body.style.overflow = "";
            setIsVerificationCodeCorrect(false);
          }, 1500); 
        });
      }}
    />
  );
};
export default NewPassword;
