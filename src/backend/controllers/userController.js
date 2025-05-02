import bcrypt from "bcrypt";
import Joi from "joi";
import crypto from "crypto";
import logger from "../winston/winston.js";
import pool from "../db/index.js";
import verifyCaptcha from "./authController.js";
import generateJWT from "../generateJWT.js";

import MailVerification from "../mailVerification.js";

const mailVerification = new MailVerification();

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
      const users = await pool.query(`SELECT * FROM users`);
      res.json(users.rows);
    } catch (error) {
      logger.error("Возникла ошибка в getAllUsers :", error);
    }
  }

  async getUserByPassword(req, res) {
    const startTime = process.hrtime();

    const { email, password } = req.body;
    try {
      const userResult = await pool.query(
        `SELECT user_id,email,password,username,uses,isvoteenabled FROM users WHERE email = $1`,
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(400).json({
          message: "Ошибка! Неверный пароль или пользователь не найден.",
        });
      }

      const user = userResult.rows[0];

      const lang = await this.getUserIp(); // Получаем язык

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

      const userChannels = await pool.query(
        `SELECT channel_name,email,created_at,thumbnail FROM purchases_channels WHERE user_id = $1`,
        [userId]
      );
      try {
        res.cookie("sessionToken", token, {
          httpOnly: false,
          secure: false,
          maxAge: 3600000,
          sameSite: "lax",
        });
      } catch (error) {
        logger.error(
          "Ошибка при загрузке куки на сайт. GetUserByPassword",
          error
        );
      }

      const csrfToken = crypto.randomBytes(16).toString("hex");
      req.session.csrfToken = csrfToken;

      try {
        res.cookie("csrfToken", csrfToken, {
          httpOnly: false,
          secure: false,
          maxAge: 3600000,
          sameSite: "lax",
        });
      } catch (error) {
        console.log("Ошибка при загрузке csrfТокена на сайт", error);
      }

      console.log( "Создание csrf токена :",req.session)

      res.json({
        message: "Успешный вход",
        token,
        csrfToken,
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
          uses: user.uses,
          password: user.password,
          lang: user.lang,
          isVoteEnabled : user.isvoteenabled
        },
        channels: userChannels.rows,
      });

      const endTime = process.hrtime(startTime);
      const executionTime = endTime[0] * 1000 + endTime[1] / 1e6;
    } catch (error) {
      logger.error("Возникла ошибка в getUserByPassword:", error);
      res
        .status(500)
        .json({ message: "Возникла ошибка при входе", error: error.message });
    }
  }

  async getUserByUserId(req, res) {
    const user_id = req.params.id;

    try {
      const userResult = await pool.query(
        `SELECT user_id,email,password,username,uses FROM users WHERE user_id = $1`,
        [user_id]
      );

      const user = userResult.rows[0];

      if (userResult.rows.length === 0) {
        return res.status(400).json({
          message: "Ошибка! Пользователь не найден.",
        });
      }

      const userChannels = await pool.query(
        `SELECT channel_name,email,created_at,thumbnail FROM purchases_channels WHERE user_id = $1`,
        [user_id]
      );

      res.json({
        message: "Успешный вход",
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
          uses: user.uses,
          password: user.password,
        },
        channels: userChannels.rows,
      });
    } catch (error) {
      logger.error(" (getUserById) ошибка в входе по id", error);
      res
        .status(500)
        .json({ message: "Возникла ошибка при входе", error: error.message });
    }
  }

  async addUser(req, res) {
    try {
      const { email, password, username, verification_code, recaptchaValue } =
        req.body.data;

      if (!req.session.captchaVerified && recaptchaValue) {
        // Если капча еще не была проверена
        const isCaptchaValid = await verifyCaptcha(recaptchaValue);
        if (!isCaptchaValid) {
          return res.status(400).json({ message: "Ошибка проверки CAPTCHA" });
        }

        // Если капча прошла, сохраняем в сессии
        req.session.captchaVerified = true;
        req.session.save((err) => {
          if (err) {
            logger.error("Ошибка сохранения сессии:", err);
            return;
          }
        });
      }

      // Теперь продолжаем обработку кода и регистрации пользователя
      const result = await mailVerification.verifyCode(
        email,
        verification_code
      );

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      await mailVerification.clearUpVerifCodes(email);

      // Валидация данных
      this.validateInput({ email, password, username });

      // Хэширование пароля
      const hashedPassword = await this.hashPassword(password);

      // Добавление пользователя в базу данных
      const addUser = await pool.query(
        `INSERT INTO users(email, password, username) VALUES ($1, $2, $3) RETURNING *`,
        [email, hashedPassword, username]
      );

      const csrfToken = crypto.randomBytes(16).toString("hex");
      req.session.csrfToken = csrfToken;

      const user = addUser.rows[0];

      res.json({
        csrfToken,
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
          uses: user.uses,
          password: user.password,
        },
      });
    } catch (error) {
      if (error.code === "23505") {
        // Ошибка "duplicate key value"
        return res.status(400).json({ error: "Email is already in use" });
      }

      // Обработка других ошибок
      logger.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateUser(req, res) {
    const id = parseInt(req.params.id, 10);
    const { newPassword, oldPassword, username, changeMethod } = req.body;


    try {
      const userResult = await pool.query(
        `SELECT password FROM users WHERE user_id = $1`,
        [id]
      );

      if (userResult.rows.length === 0) {
        return res.status(400).json({
          message: "Ошибка! Неверный пароль или пользователь не найден.",
        });
      }

      this.validateInput({ username, newPassword, oldPassword }, "update");

      const storedHash = userResult.rows[0].password;
      const isPasswordValid = await this.comparePassword(
        oldPassword,
        storedHash
      );

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Неправильный пароль!" });
      }

      let hashedPassword;
      let updateUser;

      if (changeMethod === "password" && !username) {
        delete req.body.username;
        hashedPassword = await this.hashPassword(newPassword);
        if (!hashedPassword) {
          return res.status(400).json({ message: "Ошибка хеширования пароля" });
        }

        updateUser = await pool.query(
          `UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *`,
          [hashedPassword, id]
        );
      } else if (changeMethod === "username") {
        updateUser = await pool.query(
          `UPDATE users SET username = $1 WHERE user_id = $2 RETURNING *`,
          [username, id]
        );
      } else if (changeMethod === "username&password") {
        hashedPassword = await this.hashPassword(newPassword);
        if (!hashedPassword) {
          return res.status(400).json({ message: "Ошибка хеширования пароля" });
        }

        updateUser = await pool.query(
          `UPDATE users SET username = $1, password = $2 WHERE user_id = $3 RETURNING *`,
          [username, hashedPassword, id]
        );
      } else {
        return res
          .status(400)
          .json({ message: "Некорректный метод изменения данных" });
      }

      if (updateUser.rows.length === 0) {
        return res.status(400).json({ message: "Ошибка обновления данных" });
      }

      res.json({
        message: "Данные пользователя успешно обновлены",
        user: updateUser.rows[0],
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
    console.log(req.session)
    const tokenFromSession = req.session.csrfToken;

    console.log( "Токен с клиента : ", tokenFromClient, "токен с сессии:",tokenFromSession)

    if (tokenFromClient !== tokenFromSession) {
      return res.status(403).json({ message: "Несовпадение токенов!" });
    }

    try {
      const userResult = await pool.query(
        `SELECT password FROM users WHERE user_id = $1`,
        [id]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const user = await pool.query(
        `DELETE FROM users WHERE user_id = $1 RETURNING *`,
        [id]
      );

      res.clearCookie("sessionToken", {
        path: "/", 
        secure: false, 
        sameSite: "lax",
      });

      res.json({ message: "Пользователь удален", user: user.rows[0] });
    } catch (error) {
      logger.error("Возникла ошибка в deleteUser:", error);
      res.status(500).json({ message: "Возникла ошибка сервера." });
    }
  }

  async addUses(req, res) {
    const { id } = req.params;
    const { password, uses } = req.body;

    try {
      const userCheck = await pool.query(
        `SELECT * FROM users WHERE user_id = $1 AND password = $2`,
        [id, password]
      );

      if (userCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Пользователь не найден или пароль неверный" });
      }

      const updateUser = await pool.query(
        `UPDATE users 
                 SET uses = uses + $1
                 WHERE user_id = $2
                 RETURNING *`,
        [uses, id]
      );

      res.json({
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
      const emailCheck = await mailVerification.verifyCode(
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

    console.log(req.body)
    try {
      const hashedPassword = await this.hashPassword(newPassword);

      const changeUserPassword = await pool.query(
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
        return res.status(400).json({ status: false, message: "Неверный промокод" });
      }
  
      const updateQuery = `
        UPDATE users 
        SET uses = uses + 10,
        promo_activated = true
        WHERE email = $1 AND promo_activated = false
        RETURNING uses, promo_activated;
      `;
  
      const { rowCount, rows } = await pool.query(updateQuery, [email]);
  
      if (rowCount === 0) {
        return res.status(404).json({ status: false, message: "Промокод уже активирован." });
      }
  
      res.status(200).json({ status: true, newUses: rows[0].uses });
  
    } catch (error) {
      console.error("Ошибка в activatePromocode:", error);
      res.status(500).json({ status: false, message: "Ошибка сервера" });
    }
  }
  

  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(inputPassword, storedHash) {
    return await bcrypt.compare(inputPassword, storedHash);
  }

  userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
  });

  userUpdateSchema = Joi.object({
    oldPassword: Joi.string().min(5).required(),
    newPassword: Joi.string().min(5).optional().allow(""),
    username: Joi.string().alphanum().min(3).max(30).optional().allow(""), // Добавляем allow('') чтобы разрешить пустое значение
  });

  validateInput(input, method) {
    if (method === "update") {
      const { error } = this.userUpdateSchema.validate(input);
      if (error) throw new Error(error.details[0].message);
    } else {
      const { error } = this.userSchema.validate(input);
      if (error) throw new Error(error.details[0].message);
    }
  }
}

export default UserController;
