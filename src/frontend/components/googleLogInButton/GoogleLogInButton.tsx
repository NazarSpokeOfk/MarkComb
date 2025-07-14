import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import { GoogleLogInButtonPropsWithoutResponse } from "../../types/types";

import handleSuccess from "./functions/GoogleLogInButtonFunctions";

const GoogleLoginButton = ({
  setIsLoggedIn,
  setUserData,
  setLogInStatus
}: GoogleLogInButtonPropsWithoutResponse) => {
  const handleError = (error: Error) => {
    console.log("Ошибка в аутентификации гугл:", error);
  };

  return (
    <GoogleOAuthProvider clientId="867104217256-63f1fg6mlqf501r974ud4nkvaks3ik1b.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={ async (response) => {
          await handleSuccess({ setIsLoggedIn, setUserData, response });
          setLogInStatus("success")
        }}
        onError={() => handleError}
        shape="circle"
        width={"500"}
        text="continue_with"
      />
    </GoogleOAuthProvider>
  );
};
export default GoogleLoginButton;
