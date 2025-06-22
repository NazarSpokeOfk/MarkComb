import { toast } from "react-toastify";
import i18n from "i18next";
import closeModal from "../../../utilities/closeModal";

import DataToDB from "../../../Client-ServerMethods/dataToDB";

const dataToDB = new DataToDB();

import {
  HandleRecaptchaChangeProps,
  HandleLogInProps,
  HandleValidationErrorProps,
  AnimateModalButtonShakeProps,
  HandleLogInErrorProps,
  ValidateFormData
} from "../../../types/types";

class ModalFunctions {
  animateModalButtonShake = ({ modalButtonRef, failTimeout } : AnimateModalButtonShakeProps) => {
    if (modalButtonRef.current) {
      modalButtonRef.current.classList.add("shake-animation");

      failTimeout = setTimeout(() => {
        modalButtonRef?.current?.classList.remove("shake-animation");
      }, 4000);
    }
  };

  handleValidationError = ({ setIsLoggedIn,modalButtonRef,failTimeout } : HandleValidationErrorProps) => {
    setIsLoggedIn(false);
    this.animateModalButtonShake({modalButtonRef,failTimeout});
  };

  handleLogInError = ({ setIsUserMakeAMistake } : HandleLogInErrorProps) => {
    setTimeout(() => {
      setIsUserMakeAMistake((prev) => prev + 1);
      toast.error("Wrong password, or account doesn't exist");
    }, 100);
  };

  handleRecaptchaChange = ({ value, setSignInData } : HandleRecaptchaChangeProps) => {
    setSignInData((prevData) => ({ ...prevData, recaptchaValue: value }));
  };

  async handleLogIn({ e, logInData, modalRef,setIsLoggedIn,modalButtonRef,failTimeout,setIsUserMakeAMistake,setUserData} : HandleLogInProps) {
    e.preventDefault();

    if (!logInData.email || !logInData.password) {
      this.handleValidationError({setIsLoggedIn,modalButtonRef,failTimeout});
      return;
    }

    const loadToast = toast.loading(i18n.t("Looking for your profile..."));
    console.log("LogInData в Modal:", logInData);

    try {
      const response = await dataToDB.validateLogIn({data : logInData, setUserData,setIsLoggedIn});

      toast.dismiss(loadToast);

      if (response.message === true) {
        closeModal({ ref: modalRef });
      } else {
        this.handleLogInError({setIsUserMakeAMistake});
      }
    } catch (error) {
      toast.dismiss(loadToast);
      console.error("Ошибка при логине:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  async validateFormData({
    e,
    signInData,
    isChecked,
    emailRegex,
    setIsLoggedIn,
    modalRef,
    setIsModalOpened,
    setIsDataFilledIn,
    modalButtonRef,
    failTimeout
  } : ValidateFormData) {
    if (
      signInData.email === "" ||
      !isChecked ||
      !emailRegex.test(signInData.email) ||
      !signInData.password ||
      !signInData.username ||
      !signInData.recaptchaValue
    ) {
      setIsLoggedIn(false);
      e.preventDefault();
      this.animateModalButtonShake({modalButtonRef, failTimeout});
    } else {
      closeModal({ ref: modalRef });
      setTimeout(() => {
        setIsModalOpened(false);
        setIsDataFilledIn(true);
        document.body.style.overflow = "";
      }, 600);
    }
  }
}
export default ModalFunctions;
