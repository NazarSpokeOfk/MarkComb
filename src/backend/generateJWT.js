import jwt from "jsonwebtoken"

const generateJWT = (user) =>{

    const payload = {
        user_id : user.user_id,
        email : user.email,
        lang : user.lang,
        isVoteEnabled : user.isvoteenabled
    }

    const token = jwt.sign(payload,process.env.JWT_SECRET , {
        expiresIn : "2h"
    })

    return token;
}

export default generateJWT