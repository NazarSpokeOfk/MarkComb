import jwt from "jsonwebtoken"
const verifyJWT = async (req,res) => {

    const token = req.cookies.sessionToken;
    const csrfToken = req.cookies.csrfToken;

    console.log("csrfToken:",csrfToken)

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

        const response = await fetch(`http://localhost:5001/api/loginbyid/${userData.user_id}` , {
            method : "GET",
            credentials : "include",
        })
        const result = await response.json()

        result.lang = userData.lang

        if(response.ok){
            return res.json({result,csrfToken})
        } else {
            console.log('Не удалось войти в аккаунт. Возможно неправильный пароль или email')
            console.log("Выблядок")
        }
        
    } catch (error) {
        return res.status(400).json({message : `Недействительный токен , ${error}`})
    }
}

export default verifyJWT