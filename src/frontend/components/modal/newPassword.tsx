import { useState, useEffect, useRef } from "react";
import VerifLayout from "./verifLayout";
import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";

import DataToDB from "../../Client-ServerMethods/dataToDB";

import closeModal from "../../utilities/closeModal";
import openModal from "../../utilities/openModal";

import { NewPasswordProps } from "../../types/types";

const NewPassword = ({
  email,
  isVerificationCodeCorrect,
  setIsVerificationCodeCorrect,
} : NewPasswordProps) => {
  useEffect(() => {
    console.log(email);
  }, [email]);

  const modalRef = useRef<HTMLDivElement>(null);

  const {t} = useTranslation()

  useEffect(() => {
    if (isVerificationCodeCorrect) {
      setTimeout(() => {
        openModal({ref : modalRef})
      }, 100);
    } else {
      closeModal({ref : modalRef})
      setTimeout(() => {
        modalRef.current!.style.visibility = "hidden";
      }, 600);
    }
  }, [isVerificationCodeCorrect]);

  const dataToDB = new DataToDB();

  const [newPassword, setNewPassword] = useState<string>("");

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
        console.log("Новый пароль, отправленный с фронта:", newPassword)
        if(newPassword.length < 0) {
          return;
        };
        dataToDB.changePassword(newPassword, email).then((response) => {
          console.log(response);
          if (response.message !== true) {
            toast.error(t("Account does not exist"));
            return;
          }

          toast.success(t("Password changed"), {
            autoClose: 1000,
          });

          closeModal({ref : modalRef});

          setTimeout(() => {
            document.body.style.overflow = "";
            setIsVerificationCodeCorrect(false);
          }, 1500); 
        });
      }}
    />
  );
};
export default NewPassword;
