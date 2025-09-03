import logger from "../winston/winston.js";
import nodemailer from "nodemailer";
import mainPool from "../db/mk/index.js";
import { google } from "googleapis";

import "../loadEnv.js";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const accessToken = await oAuth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    type: "OAuth2",
    user: "mknoreplyy@gmail.com",
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: accessToken.token,
  },
});

export const sendVerification = async (value, action, email) => {

  if (!email) {
    throw new Error("Email is required for verification");
  }

  const checkUser = await mainPool.query("SELECT * FROM users WHERE email = $1",[email]);

  if(action === "change" || action === "delete"){
    if(checkUser.rowCount < 0){
      return {isUserExists : false}
    }
  }

  if(action === "signIn"){
    if(checkUser.rowCount > 0){
      return {isUserExists : true}
    }
  }

  const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

  const text =
    action === "signIn"
      ? `Ваш код подтверждения: ${value}`
      : `Перейдите по ссылке для подтверждения: ${process.env.WEBSITE_URL}/${action}?token=${value}`;

  const mailOptions = {
    from: "mknoreplyy@gmail.com",
    to: email,
    subject: "Подтверждение действия MarkComb",
    text,
  };

  try {
    await mainPool.query(
      `INSERT INTO verification_tokens (email, expires_at, verification_token, action) 
           VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, expiryTime, value, action]
    );
    await transporter.sendMail(mailOptions);
    return { isVerificationSent: true, isUserExists: false };
  } catch (error) {
    console.error("(sendVerification) Error:", error);
    throw new Error("Error sending verification");
  }
};

export const verifyValue = async (value, action) => {
  try {
    const result = await mainPool.query(
      `SELECT * FROM verification_tokens 
           WHERE verification_token = $1
             AND action = $2
             AND expires_at > NOW()`,
      [value,action]
    );

    if (result.rowCount === 0) {
      return { isActionDone: false, message: "Token is invalid or expired" };
    }

    // Удаляем использованный токен
    await mainPool.query(`DELETE FROM verification_tokens WHERE id = $1`, [
      result.rows[0].id,
    ]);

    return { isActionDone: true, row: result.rows[0] };
  } catch (error) {
    logger.error("(verifyValue) Ошибка при проверке кода:", error);
    throw new Error("Server error while verifying token");
  }
};

// export const clearUpVerifCodes = async (email) => {
//   try {
//     await mainPool.query(`DELETE FROM user_verifications WHERE email = $1`, [
//       email,
//     ]);
//   } catch (error) {
//     logger.error("(clearUpVerifCodes)", error);
//   }
// }
