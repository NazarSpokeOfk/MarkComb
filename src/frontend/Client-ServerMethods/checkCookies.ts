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
      
        const result = await response.json();

        setIsLoggedIn(true);
        setUserData(result.data); 
        setIsCookieClosed(true)
      } catch (error) {
        setIsLoggedIn(false); 
      }
};
export default checkCookies;
