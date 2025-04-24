import logger from "./winston/winston.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import pool from "./db/index.js";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

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
class MailVerification {
  constructor() {
    this.transporter = nodemailer.createTransport({
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
  }

  async sendVerificationCode(email) {
    const verificationCode = crypto.randomBytes(3).toString("hex");
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in milliseconds

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Promise.reject("Неверный формат email");
    }

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
      return Promise.resolve(true);
    } catch (error) {
      logger.error(
        " (sendVerificationCode) Error sending verification email:",
        error
      );
      return Promise.reject("Ошибка при отправке кода");
    }
  }

  async verifyCode(email, code) {
    try {
      const verif = await pool.query(
        `SELECT * FROM user_verifications WHERE email = $1 AND verification_code = $2 AND verification_expiry > NOW()`,
        [email, code]
      );

      if (verif.rowCount === 0) {
        return { success: false, message: "Неправильный код" };
      }

      return { success: true };
    } catch (error) {
      logger.error(" (verifyCode) Ошибка при проверке кода:", error);
      return { success: false, message: "Ошибка сервера" };
    }
  }

  async clearUpVerifCodes(email) {
    try {
      await pool.query(`DELETE FROM user_verifications WHERE email = $1`, [
        email,
      ]);
    } catch (error) {
      logger.error("(clearUpVerifCodes)", error);
    }
  }
}

export default MailVerification;
