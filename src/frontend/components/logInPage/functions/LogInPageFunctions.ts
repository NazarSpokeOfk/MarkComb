import DataToDB from "../../../Client-ServerMethods/dataToDB";
import {
  LogInFunctionProps,
  ForgotPasswordProps,
  IsVerificationCodeCorrectLogInPageProps,
  SetNewPasswordProps,
  RedirectToMainPageProps,
} from "../../../types/types";

const dataToDb = new DataToDB();

class LogInPageFunctions {

  redirectToMainPage({logInStatus,navigate} : RedirectToMainPageProps){
    if (logInStatus === "success") {
      console.log("Ало");
      const timeout = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }

  async logIn({
    logInData,
    setUserData,
    setIsLoggedIn,
    setLogInStatus,
    setIsLoading,
    setError,
  }: LogInFunctionProps) {
    if (!logInData.email || !logInData.password) {
      return setError("full in all fields");
    }
    setIsLoading(true);
    const logInRequest = await dataToDb.validateLogIn({
      data: logInData,
      setUserData,
      setIsLoggedIn,
    });
    console.log(logInRequest);
    if (logInRequest.message === true) {
      setIsLoading(false);
      console.log("Пенис")
      return setLogInStatus("success");
    } else {
      setIsLoading(false);
      setError("Check that the data entered is correct");
      return setLogInStatus("fail");
    }
  }

  async forgotPassword({ email, setError, setIsPasswordWillBeReset }: ForgotPasswordProps) {
    if (!email) {
      setError("Enter your mail in the input field");
      return;
    }
    setIsPasswordWillBeReset(true)
    await dataToDb.makeFetchForCode({ email, isRegistration: false });
  }

  async isVerificationCodeCorrect({
    email,
    verificationCode,
    setIsVerificationCodeCorrect,
    setIsPasswordWillBeReset,
    setError
  }: IsVerificationCodeCorrectLogInPageProps) {
    const verificationCodeCheck = await dataToDb.isVerificationCodeCorrect({
      email,
      verificationCode,
    });

    setIsVerificationCodeCorrect(await verificationCodeCheck.message);
    
    if(verificationCodeCheck.message === true){
      return setIsPasswordWillBeReset(false)
    } else {
      setError(null);
      setTimeout(() => setError("Wrong verification code"), 0);
    }
  }

  async setNewPassword ({email,newPassword,setError,setIsPasswordChangedSuccessfully,setIsVerificationCodeCorrect} : SetNewPasswordProps){
    if(!email && !newPassword){
        setError("Oops, we lost your credentials. Please, try again a little later")
    }

    if(!newPassword){
      return
    }

    const settingNewPassword = await dataToDb.changePassword({newPassword,email})

    console.log("MTMMT",settingNewPassword)
    setIsPasswordChangedSuccessfully(await settingNewPassword.message)
    setIsVerificationCodeCorrect(false)
  }
}

export default LogInPageFunctions;
