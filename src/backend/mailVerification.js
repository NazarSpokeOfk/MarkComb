import crypto from "crypto";
import nodemailer from "nodemailer";
import pool from "./db/index.js";
import { google } from "googleapis";

const CLIENT_ID =
  "867104217256-63f1fg6mlqf501r974ud4nkvaks3ik1b.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04wIxYqKYrrBiCgYIARAAGAQSNwF-L9IrqzQlbtHlXLLICwIK2w1S2l5XCDk6AT36TFvdUHk2DVFdBwXTlpvuAH0kq13DsHTiNL8";

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
        user: "mknoreplyy@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token, // Получаем свежий токен
      },
    });
  }

  async sendVerificationCode(email) {
    const verificationCode = crypto.randomBytes(3).toString("hex");
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in milliseconds
    console.log("Общие данные:", email, verificationCode, expiryTime);

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
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error sending verification email:", error);
      return Promise.reject("Ошибка при отправке кода");
    }
  }

  async verifyCode(email, code) {
    console.log(`📩 Проверяю код для: ${email}, код: ${code}`);
    try {
      const verif = await pool.query(
        `SELECT * FROM user_verifications WHERE email = $1 AND verification_code = $2 AND verification_expiry > NOW()`,
        [email, code]
      );

      console.log("verif:", verif);

      if (verif.rowCount === 0) {
        console.log("❌ Неправильный код");
        return { success: false, message: "Неправильный код" };
      }

      return { success: true };
    } catch (error) {
      console.error("Ошибка при проверке кода:", error);
      return { success: false, message: "Ошибка сервера" };
    }
  }

  async clearUpVerifCodes() {
    try {
      await pool.query(
        `DELETE FROM verification_codes WHERE verification_expiry < NOW()`
      );
      console.log("Данные очищены.");
    } catch (error) {
      console.log(error);
    }
  }
}

export default MailVerification;
