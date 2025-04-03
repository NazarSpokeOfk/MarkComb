import jwt from "jsonwebtoken"
const verifyJWT = async (req,res) => {

    const token = req.cookies.sessionToken;
    const csrfToken = req.cookies.csrfToken;

    

    if(!token || !csrfToken){
        return
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const userData = {
            email : decoded.email,
            user_id : decoded.user_id,
            lang : decoded.lang
        }

        const response = await fetch(`https://owa.markcomb.com/api/loginbyid/${userData.user_id}` , {
            method : "GET",
            credentials : "include",
        })
        const result = await response.json()

        result.lang = userData.lang

        if(response.ok){
            return res.json({result,csrfToken})
        } else {
            
            
        }
        
    } catch (error) {
        return res.status(400).json({message : `Недействительный токен , ${error}`})
    }
}

export default verifyJWT