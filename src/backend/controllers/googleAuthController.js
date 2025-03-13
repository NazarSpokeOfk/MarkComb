import pool from "../db/index.js";

import logger from "../winston/winston.js"

import { OAuth2Client } from "google-auth-library";

const googleAuthController = async (req, res) => {
  const {credential} = req.body;
  const client = new OAuth2Client(
    "867104217256-63f1fg6mlqf501r974ud4nkvaks3ik1b.apps.googleusercontent.com"
  );

  try{
    const ticket = await client.verifyIdToken({
        idToken : credential,
        audience : "867104217256-63f1fg6mlqf501r974ud4nkvaks3ik1b.apps.googleusercontent.com",
    })
    const payload = ticket.getPayload()
    

    const findUser = await pool.query( `SELECT email,user_id,username,uses FROM users WHERE email = $1`,
        [payload.email]
    )
    

    const user = findUser.rows[0]

    
    if(!findUser){
        return res.status(400).json({message : "Аккаунта, в который вы пытаетесь зайти, не существует"}) 
    }

    const userId = await findUser.rows[0].user_id
    
    const userChannels = await pool.query(
        `SELECT channel_name,email,created_at,thumbnail FROM purchases_channels WHERE user_id = $1`,
        [userId]
    );

    res.json({message : "Успешный вход",
        user : {
            user_id : userId,
            email : user.email,
            uses : user.uses,
            username : user.username
        },
        channels : userChannels.rows
    })
  } catch (error) {
    return res.status(400).json({message : "Аутентификация гугл не прошла."})
  }
};
export default googleAuthController;
