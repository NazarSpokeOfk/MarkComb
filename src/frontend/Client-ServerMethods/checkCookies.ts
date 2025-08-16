const apiBaseUrl = import.meta.env.VITE_API_URL;

import { CheckCookiesProps } from "../types/types";

const checkCookies = async ({setIsLoggedIn, setUserData, setIsCookieClosed} : CheckCookiesProps) => {
    try {
        const response = await fetch(`${apiBaseUrl}/cookie`, {
          method: "GET",
          credentials: "include",  
          headers : {
            "x-api-key": import.meta.env.VITE_API_KEY
          }
        });
      
        if (!response.ok) {
          setIsLoggedIn(false);
          return; 
        }
      
        const rawResult = await response.json(); 

        console.log("Результат проверки кук : " , rawResult)

        const proccessedResult = {
          ...rawResult.result, userInformation : {
            ...rawResult.result.userInformation,
            uses : Number(rawResult.result.userInformation.uses)
          }
        }

        console.log("proccessedResult : ", proccessedResult )

        setIsLoggedIn(true);
        setUserData(proccessedResult); 
        setIsCookieClosed(true)
      } catch (error) {
        setIsLoggedIn(false); 
      }
};
export default checkCookies;
