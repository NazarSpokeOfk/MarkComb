const apiBaseUrl = import.meta.env.VITE_API_URL;

const checkCookies = async (setIsLoggedIn, setUserData , setUserLang , setCsrfToken) => {
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
        setUserData(result.result); 
        setUserLang(result.lang)
        setCsrfToken(result.csrfToken)
      } catch (error) {
        setIsLoggedIn(false); 
      }
};
export default checkCookies;
