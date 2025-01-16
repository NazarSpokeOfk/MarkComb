import crypto from "crypto";
import nodemailer from "nodemailer";
import pool from "./db/index.js";
import { google } from "googleapis";

const CLIENT_ID = '867104217256-63f1fg6mlqf501r974ud4nkvaks3ik1b.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04Z9YlasN7aayCgYIARAAGAQSNwF-L9IraXHcJxqdZx0t927hnyNo2UXRBENruBnB4v2CHSdQLQgf46rIPWRxsWT4Copa-UNIiAs';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const accessToken = await oAuth2Client.getAccessToken();

class MailVerification {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: 'OAuth2',
        user: "mknoreplyy@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
  }

  async sendVerificationCode(email) {
    const verificationCode = crypto.randomBytes(3).toString("hex");
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in milliseconds
    console.log("Общие данные:",email,verificationCode,expiryTime)
  
    const mailOptions = {
      from: "mknoreplyy@gmail.com",
      to: email,
      subject: "Подтверждение регистрации",
      text: `Ваш код подтверждения: ${verificationCode}`,
    };

    try {
      await pool.query(
        `INSERT INTO user_verifications (email,verification_code,verification_expiry) VALUES ($1, $2 , $3) ON CONFLICT (email) DO UPDATE SET verification_code = $2,verification_expiry=$3 RETURNING *`,
        [email, verificationCode, expiryTime]
      );
      await this.transporter.sendMail(mailOptions);
      console.log("Verification email sent to:", email);
      return Promise.resolve(true)
    } catch (error) {
      console.error("Error sending verification email:", error);
      return Promise.reject("Ошибка при отправке кода")
    }
  }

  async verifyCode(email, code) {
    try{
      const verif = await pool.query(`SELECT * FROM user_verifications WHERE email = $1 AND verification_code = $2 AND verification_expiry  > NOW()`,
        [email,code]
      )
      if(verif.rowCount === 0){
        return res.status(400).json({message : "Вы ввели неверный код подтверждения."})
      }  
    } catch (error) {
      console.log(error)
    }
    return { success: true };
  }

  async clearUpVerifCodes(){
    try{
      await pool.query(`DELETE FROM verification_codes WHERE verification_expiry < NOW()`)
      console.log("Данные очищены.")
    } catch (error) {
      console.log(error)
    }
  }
}

export default MailVerification;
