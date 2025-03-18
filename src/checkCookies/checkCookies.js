const checkCookies = async (setIsLoggedIn, setUserData , setUserLang , setCsrfToken) => {
    try {
        const response = await fetch("https://markcomb.com/api/cookie", {
          method: "GET",
          credentials: "include",  
        });
      
        if (!response.ok) {
          setIsLoggedIn(false);
          return; 
        }
      
        const result = await response.json(); 

        console.log(result)
        
        setIsLoggedIn(true);
        setUserData(result.result); 
        setUserLang(result.lang)
        setCsrfToken(result.csrfToken)
      } catch (error) {
        setIsLoggedIn(false); 
      }
};
export default checkCookies;
