import logger from "./winston/winston.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import pool from "./db/index.js";
import dotenv from "dotenv";
dotenv.config();

class MailVerification {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "mail.hosting.reg.ru",
      port: 465,
      secure: true,
      auth: {
        user: "noreplymk@markcomb.com",
        pass: "HSRaFhhkhUbE7j2",
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
      from: "noreplymk@markcomb.com",
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
