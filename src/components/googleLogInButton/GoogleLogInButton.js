import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = ({setIsLoggedIn,setUserData,setIsModalOpened}) => {
  const handleSuccess = async (response) => {
    const credential = response.credential
    console.log("Вход с помощью google.", response);
    await fetch("http://localhost:5001/api/auth/google", {
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
      })
      .catch((error) => {
        console.log("Ошибка в google log in:", error);
      });
  };

  const handleError = (error) => {
    console.log("Ошибка в аутентификации гугл:",error)
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