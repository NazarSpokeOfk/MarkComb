import {
  ValidateStepProps,
  HandleContinueProps,
  SignInValidatorsProps,
  ValidateCaptchaAndAgreementProps,
  HandleRegisterProps,
  ShowInputOrNotProps,
  CheckIsCaptchaAndTermsPassedProps,
  ThrowToastOrThumbnailProps,
} from "../../../types/types";

import smoothThumbnail from "../../../utilities/smoothThumbnail";

import {toast} from "react-toastify"

import i18n from "i18next"

import { RegistrationStatusKey } from "../../../interfaces/interfaces";

import DataToDB from "../../../Client-ServerMethods/dataToDB";

const dataToDb = new DataToDB();

class SignUpFunctions {
  showInputOrNot({ step, setHide }: ShowInputOrNotProps) {
    if (step >= 3) {
      setHide(true);
    } else {
      setHide(false);
    }
  }

  checkIsCaptchaAndTermsPassed({
    signInData,
    step,
    stepKeys,
    setStep,
    inputValue,
    setError,
    setTriggerErase,
    setSignInData,
    setRegistrationStatus,
  }: CheckIsCaptchaAndTermsPassedProps) {
    const isCaptchaPassed = !!signInData.recaptchaValue;
    const isAgreementChecked = signInData.isAgreed;

    if (isCaptchaPassed && isAgreementChecked && step !== 0) {
      this.handleContinue({
        stepKeys,
        step,
        inputValue,
        setError,
        setTriggerErase,
        setSignInData,
        signInData,
      });
      dataToDb.makeFetchForCode({
        email: signInData.email,
        operationCode: "REGISTRATION",
        isRegistration: true,
        setRegistrationStatus,
        setStep,
      });
    }
  }

  validateUserName({ string, setSignInData }: SignInValidatorsProps) {
    const pureUsername = string.trim();

    console.log("юзер наме : ", pureUsername);

    if (pureUsername.length <= 2) {
      return "Username must be longer than 2 characters";
    }

    if (!/^[a-zA-Zа-яА-ЯёЁ0-9_]+$/.test(pureUsername)) {
      return "Username can only contain letters, numbers, and underscores";
    }

    if (/^\d+$/.test(pureUsername)) {
      return "Username cannot be only numbers";
    }

    setSignInData((prev) => ({
      ...prev,
      username: pureUsername,
    }));
    return null;
  }

  validateEmail({ string, setSignInData }: SignInValidatorsProps) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pureEmail = string.trim();

    console.log("Почта : ", pureEmail);

    if (pureEmail.length === 0) {
      console.log("Залупа");
      return "Empty email";
    }

    if (!emailRegex.test(pureEmail)) {
      console.log("Залупа");
      return "Invalid email";
    }

    setSignInData((prev) => ({
      ...prev,
      email: pureEmail,
    }));
    return null;
  }

  validatePassword({ string, setSignInData }: SignInValidatorsProps) {
    const purePassword = string.trim();

    if (purePassword.length < 5) {
      console.log("Залупа");
      return "Short password";
    }
    setSignInData((prev) => ({
      ...prev,
      password: purePassword,
    }));
    return null;
  }

  validateCaptchaAndAgreement({
    signInData,
  }: ValidateCaptchaAndAgreementProps) {
    if (signInData.recaptchaValue && signInData.isAgreed === true) {
      console.log("Ало");
      return null;
    } else {
      return "Fill all fields";
    }
  }

  handleContinue = ({
    stepKeys,
    step,
    inputValue,
    setError,
    setTriggerErase,
    setSignInData,
    signInData,
  }: HandleContinueProps) => {
    const validation = this.validateStep({
      stepKeys,
      step,
      inputValue,
      setError,
      setSignInData,
      signInData,
    });
    if (validation != null) {
      setError(validation);
      return;
    }
    console.log("прошла проверка успешно");
    setError(null);
    setTriggerErase("forward");
  };

  validateStep = ({
    stepKeys,
    step,
    inputValue,
    setError,
    setSignInData,
    signInData,
  }: ValidateStepProps) => {
    let err = null;

    if (stepKeys[step] === "username") {
      err = this.validateUserName({ string: inputValue, setSignInData });
      return err;
    }

    if (stepKeys[step] === "email") {
      err = this.validateEmail({ string: inputValue, setSignInData });
      return err;
    }

    if (stepKeys[step] === "password") {
      err = this.validatePassword({ string: inputValue, setSignInData });
      return err;
    }

    if (stepKeys[step] === "recaptchaValue") {
      err = this.validateCaptchaAndAgreement({ signInData });
      return err;
    }

    if (err) {
      setError(err);
      return null;
    }
    return null;
  };

  async handleRegister({
    updatedData,
    setRegistrationStatus,
    setHide,
  }: HandleRegisterProps): Promise<RegistrationStatusKey> {
    const registration = await dataToDb.validateSignIn({ data: updatedData });
    const status = registration.status;

    setRegistrationStatus(status);
    setHide(true);

    return status; // ← вернем результат обратно
  }
}
export default SignUpFunctions;
