import DataToDB from "../../../Client-ServerMethods/dataToDB";
import { LogInFunctionProps } from "../../../types/types";

const dataToDb = new DataToDB();

class LogInPageFunctions {
    async logIn ({logInData,setUserData,setIsLoggedIn,setLogInStatus} : LogInFunctionProps) {
        if(!logInData.email || !logInData.password){
            return "full in all fields"
        }

        const logInRequest = await dataToDb.validateLogIn({data : logInData,setUserData,setIsLoggedIn})
        console.log(logInRequest)
        if (logInRequest.message === true){
            return setLogInStatus("success")
        } else {
            return setLogInStatus("fail")
        }
    }
}

export default LogInPageFunctions