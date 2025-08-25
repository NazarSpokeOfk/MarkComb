import jwt from "jsonwebtoken"
import path from "path"
import dotenv from 'dotenv';
import "../loadEnv.js"

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
        }

        console.log(process.env.API_URL)
        console.log("userData.user_id : ", userData.user_id)
        const response = await fetch(`${process.env.API_URL}/loginbyid/${userData.user_id}` , {
            method : "GET",
            credentials : "include",
            headers : {
                "x-api-key": process.env.VITE_KEY 
            }
        })
        const result = await response.json()

        result.userInformation.csrfToken = csrfToken
        
        console.log("Данные которые пойдут из куки: ",result)
        if(response.ok){
            return res.json({result})
        } else {
            console.log("Ошибка проверки jwt")
        }
        
    } catch (error) {
        return res.status(400).json({message : `Недействительный токен , ${error}`})
    }
}

export default verifyJWT