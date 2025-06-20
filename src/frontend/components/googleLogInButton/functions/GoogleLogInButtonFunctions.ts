const apiBaseUrl = import.meta.env.VITE_API_URL;
import {toast} from "react-toastify"
import { GoogleLogInButtonProps } from "../../../types/types";

const handleSuccess = async ({setIsLoggedIn,setUserData,setIsModalOpened,response} : GoogleLogInButtonProps) => {
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
        setIsModalOpened(false)
        document.body.style.overflow = "";
      })
      .catch((error) => {
        console.log("Ошибка в google log in:", error);
        toast.error("There is no such account created previously.")
      });
  };

export default handleSuccess