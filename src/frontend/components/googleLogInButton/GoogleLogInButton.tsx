import { GoogleOAuthProvider, GoogleLogin,CredentialResponse } from "@react-oauth/google";
import { toast } from "react-toastify";


import { GoogleLogInButtonPropsWithoutResponse } from "../../types/types";

import handleSuccess from "./functions/GoogleLogInButtonFunctions"

const GoogleLoginButton = ({setIsLoggedIn,setUserData,setIsModalOpened}: GoogleLogInButtonPropsWithoutResponse) => {
  
  const handleError = (error : Error) => {
    console.log("Ошибка в аутентификации гугл:",error)
    toast.error("There is no such account,registrated previosly.")
  }

  return(
    <GoogleOAuthProvider clientId="867104217256-63f1fg6mlqf501r974ud4nkvaks3ik1b.apps.googleusercontent.com">
        <GoogleLogin
        onSuccess={(response) => handleSuccess({setIsLoggedIn,setUserData,setIsModalOpened,response})}
        onError={() => handleError}
        />
    </GoogleOAuthProvider>
  )
};
export default GoogleLoginButton