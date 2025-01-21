import jwt from "jsonwebtoken"
const verifyJWT = async (req,res) => {
    const token = req.cookies.sessionToken;
    
    if(!token){
        return res.status(403).json({message : "No cookies"})
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        console.log("decoded:",decoded)
        const userData = {
            email : decoded.email,
            user_id : decoded.user_id
        }

        const response = await fetch(`http://localhost:5001/api/loginbyid/${userData.user_id}` , {
            method : "GET",
            credentials : "include",
        })
        const result = await response.json()

        if(response.ok){
            console.log("Успешный вход!",result)
            return res.json(result)
        } else {
            console.log('Не удалось войти в аккаунт. Возможно неправильный пароль или email')
            return Promise.reject()
        }
        
    } catch (error) {
        return res.status(400).json({message : `Недействительный токен , ${error}`})
    }
}

export default verifyJWT