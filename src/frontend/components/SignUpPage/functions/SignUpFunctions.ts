import { SignInData } from "../../../interfaces/interfaces";
import {
  ValidateStepProps,
  HandleContinueProps,
  SignInValidatorsProps,
  ValidateCaptchaAndAgreementProps,
  CheckIfReadyToContinueProps,
} from "../../../types/types";

class SignUpFunctions {
  validateUserName({ string, setSignInData }: SignInValidatorsProps) {
    const pureUsername = string.trim();

    console.log("юзер наме : ", pureUsername);

    if (pureUsername.length <= 2) {
      return "username must be longer than 2 characters";
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
      return "empty email";
    }

    if (!emailRegex.test(pureEmail)) {
      console.log("Залупа");
      return "invalid email";
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
      return "short password";
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
      return "fill all fields";
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

  checkIfReadyToContinue(
    signInData: SignInData,
    updatedData: Partial<typeof signInData>,
    {
      stepKeys,
      step,
      inputValue,
      setError,
      setTriggerErase,
      setSignInData,
    }: CheckIfReadyToContinueProps
  ) {
    const newData = { ...signInData, ...updatedData };
    const isCaptchaPassed = !!newData.recaptchaValue;
    const isAgreementChecked = newData.isAgreed;

    if (isCaptchaPassed && isAgreementChecked) {
      this.handleContinue({
        stepKeys,
        step,
        inputValue,
        setError,
        setTriggerErase,
        setSignInData,
        signInData: newData,
      });
    }
  }
}
export default SignUpFunctions;
