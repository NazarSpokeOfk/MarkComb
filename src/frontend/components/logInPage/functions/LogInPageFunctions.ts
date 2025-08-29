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
        navigate("/search");
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
    const request = await dataToDb.validateLogIn({
      data: logInData,
      setUserData,
      setIsLoggedIn,
    });
    console.log(request);
    if (request) {
      setIsLoading(false);
      return setLogInStatus("success");
    } else {
      setIsLoading(false);
      setError("Check that the data entered is correct");
      return setLogInStatus("fail");
    }
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
}

export default LogInPageFunctions;
