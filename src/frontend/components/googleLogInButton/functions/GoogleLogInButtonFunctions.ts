const apiBaseUrl = import.meta.env.VITE_API_URL;
import { GoogleLogInButtonProps } from "../../../types/types";

const handleSuccess = async ({setIsLoggedIn,setUserData,response} : GoogleLogInButtonProps) => {
    const credential = response.credential
    console.log("Вход с помощью google.", response);
    await fetch(`${apiBaseUrl}/auth/google`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY
      },
      credentials : "include",
      body: JSON.stringify({credential}),
    })
      .then((res) => {
        if(!res.ok){
            throw new Error(`Ошибка в запросе:,${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        console.log(data);
        setIsLoggedIn(true)
        setUserData(data)
      })
      .catch((error) => {
        console.log("Ошибка в google log in:", error);
      });
  };

export default handleSuccess