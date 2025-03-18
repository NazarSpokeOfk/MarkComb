import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
const GoogleLoginButton = ({setIsLoggedIn,setUserData,setIsModalOpened}) => {
  const handleSuccess = async (response) => {
    const credential = response.credential
    console.log("Вход с помощью google.", response);
    await fetch("https://markcomb.com/api/auth/google", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({credential}),
    })
      .then((res) => {
        if(!res.ok){
            throw new Error("Ошибка в запросе:",res.status)
        }
        return res.json()
      })
      .then((data) => {
        console.log(data);
        setIsLoggedIn(true)
        setUserData(data)
        setIsModalOpened(false)
        document.body.style.overflow = "";
      })
      .catch((error) => {
        console.log("Ошибка в google log in:", error);
        toast.error("There is no such account created previously.")
      });
  };

  const handleError = (error) => {
    console.log("Ошибка в аутентификации гугл:",error)
    toast.error("There is no such account,registrated previosly.")
  }

  return(
    <GoogleOAuthProvider clientId="867104217256-63f1fg6mlqf501r974ud4nkvaks3ik1b.apps.googleusercontent.com">
        <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        style={{
          backgroundColor : "#FFF",
        }}
        />
    </GoogleOAuthProvider>
  )
};
export default GoogleLoginButton