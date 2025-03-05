const checkCookies = async (setIsLoggedIn, setUserData , setUserLang) => {
    try {
        const response = await fetch("http://localhost:5001/api/cookie", {
          method: "GET",
          credentials: "include",  
        });
      
        if (!response.ok) {
          setIsLoggedIn(false);
          return; 
        }
      
        const result = await response.json(); 
        
        setIsLoggedIn(true);
        setUserData(result); 
        setUserLang(result.lang)
      } catch (error) {
        setIsLoggedIn(false); 
      }
};
export default checkCookies;
