import DataToDB from "../../../Client-ServerMethods/dataToDB";
import { LogInFunctionProps , ForgotPasswordProps } from "../../../types/types";

const dataToDb = new DataToDB();

class LogInPageFunctions {
    async logIn ({logInData,setUserData,setIsLoggedIn,setLogInStatus,setIsLoading,setError,setHide} : LogInFunctionProps) {
        if(!logInData.email || !logInData.password){
            return setError("full in all fields")
        }
        setIsLoading(true)
        const logInRequest = await dataToDb.validateLogIn({data : logInData,setUserData,setIsLoggedIn})
        console.log(logInRequest)
        if (logInRequest.message === true){
            setIsLoading(false)
            setHide(true)
            return setLogInStatus("success")
        } else {
            setIsLoading(false)
            setError("Check that the data entered is correct")
            return setLogInStatus("fail")
        }
    }

    async forgotPassword ({email,setHide} : ForgotPasswordProps) {
        if(!email){
            return "Enter your mail in the input field";
        }
        
        setHide(true)

        
        // const changePasswordRequest = await dataToDb.makeFetchForCode({email});
        
    }
}

export default LogInPageFunctions