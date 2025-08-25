import bcrypt from "bcrypt";
import crypto from "crypto";
import logger from "../../winston/winston.js";
import mainPool from "../../db/mk/index.js";
import verifyCaptcha from "../captchaRelatedControllers/verifyCaptcha.js";
import generateJWT from "../../cookies/generateJWT.js";
import domains from "disposable-email-domains/index.json" assert { type: "json" };

import MailVerificationModule from "../../modules/mailVerificationModule.js";
import returnCookieModule from "../../modules/returnCookieModule.js";
import returnCsrftokenModule from "../../modules/returnCsrftokenModule.js";
import returnUserInformationModule from "../../modules/returnUserInformationModule.js";
import clearCookie from "../../cookies/clearCookies.js";

import validateInput from "../../validation/validation.js";

import hashPasswordModule from "../../modules/hashPasswordModule.js";

const mailVerificationModule = new MailVerificationModule();

class UserController {
  ipInfoKey = process.env.IP_INFO_API_KEY;

  async getUserIp() {
    try {
      const response = await fetch(
        `https://ipinfo.io/json?token=${this.ipInfoKey}`
      );
      const data = await response.json();

      switch (data.country) {
        case "RU":
          return "ru";
        case "ES":
          return "es";
        default:
          return "en";
      }
    } catch (error) {
      logger.error(" (getUserIP) Ошибка при получении IP:", error);
      return "en"; // Значение по умолчанию в случае ошибки
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await mainPool.query(`SELECT * FROM users`);
      res.json(users.rows);
    } catch (error) {
      logger.error("Возникла ошибка в getAllUsers :", error);
    }
  }

  async logIn(req, res) {
    const { email, password } = req.body;

    try {
      const userResult = await mainPool.query(
        `SELECT user_id,email,password,username,uses,isvoteenabled,subscription_expiration FROM users WHERE email = $1`,
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(400).json({
          message: "Ошибка! Неверный пароль или пользователь не найден.",
        });
      }

      let user = userResult.rows[0];

      if (user.subscription_expiration !== null) {
        user.isSubscriber = true;
      } else {
        user.isSubscriber = false;
      }

      const lang = await this.getUserIp();

      user.lang = lang;

      const isPasswordValid = await this.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Неверный пароль!" });
      }

      const token = generateJWT(user);

      const userId = await user.user_id;

      const userChannels = await mainPool.query(
        `SELECT channel_name,email,thumbnail,transaction_id FROM purchases_channels WHERE user_id = $1`,
        [userId]
      );

      returnCookieModule(token, res);

      const csrfToken = crypto.randomBytes(16).toString("hex");
      req.session.csrfToken = csrfToken;

      returnCsrftokenModule(csrfToken, res);

      const userInformation = returnUserInformationModule(
        user,
        token,
        csrfToken
      );

      res.status(200).json({
        userInformation,
        channels: userChannels.rows,
      });
    } catch (error) {
      logger.error("Возникла ошибка в logIn:", error);
      res
        .status(500)
        .json({ message: "Возникла ошибка при входе", error: error.message });
    }
  }

  async getUserByUserId(req, res) {
    const user_id = req.params.id;

    try {
      const userResult = await mainPool.query(
        `SELECT user_id,email,username,uses,subscription_expiration,isvoteenabled FROM users WHERE user_id = $1`,
        [user_id]
      );

      const user = userResult.rows[0];

      if (userResult.rows.length === 0) {
        return res.status(400).json({
          message: "Ошибка! Пользователь не найден.",
        });
      }

      if (user.subscription_expiration !== null) {
        user.isSubscriber = true;
      } else {
        user.isSubscriber = false;
      }

      const userChannels = await mainPool.query(
        `SELECT channel_name,email,thumbnail,transaction_id FROM purchases_channels WHERE user_id = $1`,
        [user_id]
      );
      const userInformation = returnUserInformationModule(user);
      res.status(200).json({
        userInformation,
        channels: userChannels.rows,
      });
    } catch (error) {
      logger.error(" (getUserById) ошибка в входе по id", error);
      res
        .status(500)
        .json({ message: "Возникла ошибка при входе", error: error.message });
    }
  }

  async SignIn(req, res) {
    try {
      const { email, password, username, verification_code, recaptchaValue } =
        req.body.data;

      // const domain = email.split("@")[1].toLowerCase(); //закомментировать при тестировании

      // if (domains.includes(domain)) { //закомментировать при тестировании
      //   return res.status(400).json({
      //     message:
      //       "У вас не получится зарегистрироваться с временной почтой :(",
      //     status: false,
      //   });
      // }

      // if (!req.session.captchaVerified && recaptchaValue) { //закомментировать при тестировании
      //   // Если капча еще не была проверена
      //   const isCaptchaValid = await verifyCaptcha(recaptchaValue);
      //   if (!isCaptchaValid) {
      //     return res.status(400).json({ status: "invalid" });
      //   }

      //   // Если капча прошла, сохраняем в сессии //закомментировать при тестировании
      //   req.session.captchaVerified = true;
      //   req.session.save((err) => {
      //     if (err) {
      //       logger.error("Ошибка сохранения сессии:", err);
      //       return;
      //     }
      //   });
      // }

      // const result = await mailVerificationModule.verifyCode( //закомментировать при тестировании
      //   email,
      //   verification_code
      // );

      // if (result.message === "Wrong code" && result.success === false) { //закомментировать при тестировании
      //   return res.status(400).json({ status: "Wrong code" });
      // }

      // await mailVerificationModule.clearUpVerifCodes(email); //закомментировать при тестировании

      // Валидация данных
      validateInput({ email, password, username });

      // Хэширование пароля
      const hashedPassword = await hashPasswordModule(password);

      // Добавление пользователя в базу данных
      const SignIn = await mainPool.query(
        `INSERT INTO users(email, password, username) VALUES ($1, $2, $3) RETURNING *`,
        [email, hashedPassword, username]
      );

      const csrfToken = crypto.randomBytes(16).toString("hex");
      req.session.csrfToken = csrfToken;

      const user = SignIn.rows[0];

      const token = generateJWT(user);

      const userInformation = returnUserInformationModule(
        user,
        token,
        csrfToken
      );

      returnCookieModule(token, res);
      returnCsrftokenModule(csrfToken, res);

      res.status(200).json({
        userInformation,
        status: "ok",
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateUser(req, res) {
    const id = parseInt(req.params.id, 10);
    const { newValue, changeMethod } = req.body;
    console.log("Извините?", newValue, changeMethod);
    try {
      const userResult = await mainPool.query(
        `SELECT password FROM users WHERE user_id = $1`,
        [id]
      );

      if (userResult.rows.length === 0) {
        return res.status(400).json({
          message: "Ошибка! Неверный пароль или пользователь не найден.",
        });
      }

      this.validateInput({ newValue }, "update");

      let updateUser;

      if (changeMethod === "username") {
        updateUser = await mainPool.query(
          `UPDATE users SET username = $1 WHERE user_id = $2 RETURNING *`,
          [newValue, id]
        );
      } else {
        return res
          .status(400)
          .json({ message: "Некорректный метод изменения данных" });
      }

      if (updateUser.rows.length === 0) {
        return res.status(400).json({ message: "Ошибка обновления данных" });
      }

      const userInformation = returnUserInformationModule(updateUser.rows[0]);
      res.status(200).json({
        message: "Данные пользователя успешно обновлены",
        userInformation,
      });
    } catch (error) {
      logger.error(" (updateUser) Возникла ошибка в updateUser:", error);
      res.status(500).json({
        message: "Ошибка изменения пользователя",
        error: error.message,
      });
    }
  }

  async deleteUser(req, res) {
    const id = parseInt(req.params.id, 10);

    const tokenFromClient = req.headers["x-csrf-token"];
    console.log(req.session);
    const tokenFromSession = req.session.csrfToken;

    console.log(
      "Токен с клиента : ",
      tokenFromClient,
      "токен с сессии:",
      tokenFromSession
    );

    if (tokenFromClient !== tokenFromSession) {
      return res.status(403).json({ message: "Несовпадение токенов!" });
    }

    try {
      const userResult = await mainPool.query(
        `SELECT password FROM users WHERE user_id = $1`,
        [id]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const user = await mainPool.query(
        `DELETE FROM users WHERE user_id = $1 RETURNING *`,
        [id]
      );

      clearCookie(req, res);

      res.status(200).json({ message: "Пользователь удален", user: user.rows[0] });
    } catch (error) {
      logger.error("Возникла ошибка в deleteUser:", error);
      res.status(500).json({ message: "Возникла ошибка сервера." });
    }
  }

  async addUses(req, res) {
    const { id } = req.params;
    const { password, uses } = req.body;

    try {
      const userCheck = await mainPool.query(
        `SELECT * FROM users WHERE user_id = $1 AND password = $2`,
        [id, password]
      );

      if (userCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Пользователь не найден или пароль неверный" });
      }

      const updateUser = await mainPool.query(
        `UPDATE users 
                 SET uses = uses + $1
                 WHERE user_id = $2
                 RETURNING *`,
        [uses, id]
      );

      res.status(200).json({
        message: "Покупка успешно оформлена",
        updatedUser: updateUser.rows[0],
      });
    } catch (error) {
      logger.error("Возникла ошибка в addUses:", error);
      res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
  }

  async isVerificationCodeCorrect(req, res) {
    const { email, verification_code } = req.body;

    try {
      const emailCheck = await mailVerificationModule.verifyCode(
        email,
        verification_code
      );

      if (emailCheck.success !== true) {
        res.status(400).json({ message: "Неправильный код с почты" });
        return;
      } else {
        res.status(200).json({ message: "Код правильный." });
        return;
      }
    } catch (error) {
      logger.error("Ошибка в isVerificationCodeCorrect : ", error);
    }
  }

  async changePassword(req, res) {
    const { newPassword, email } = req.body;

    console.log(req.body);
    try {
      const hashedPassword = await hashPasswordModule(newPassword);

      const changeUserPassword = await mainPool.query(
        `UPDATE users SET password = $1 WHERE email = $2 RETURNING *`,
        [hashedPassword, email]
      );

      if (changeUserPassword.rows.length != 0) {
        res.status(200).json({ message: "Пароль был сменен!" });
      } else {
        res.status(500).json({ message: "Аккаунта не существует" });
      }
    } catch (error) {
      logger.error(
        " (changePassword) Возникла ошибка в изменении пароля :",
        error
      );
    }
  }

  async activatePromocode(req, res) {
    const { promocode, email } = req.body;

    try {
      if (promocode !== process.env.USES_PROMOCODE) {
        return res
          .status(400)
          .json({ status: false, message: "Неверный промокод" });
      }

      const updateQuery = `
        UPDATE users 
        SET uses = uses + 10,
        promo_activated = true
        WHERE email = $1 AND promo_activated = false
        RETURNING uses, promo_activated;
      `;

      const { rowCount, rows } = await mainPool.query(updateQuery, [email]);

      if (rowCount === 0) {
        return res
          .status(409)
          .json({ status: false, message: "Промокод уже активирован." });
      }

      res.status(200).json({ status: true, newUses: rows[0].uses });
    } catch (error) {
      console.error("Ошибка в activatePromocode:", error);
      res.status(500).json({ status: false, message: "Ошибка сервера" });
    }
  }

  async comparePassword(inputPassword, storedHash) {
    return await bcrypt.compare(inputPassword, storedHash);
  }
}

export default UserController;
