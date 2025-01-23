import bcrypt from "bcrypt";
import Joi from "joi";

import pool from "../db/index.js";
import verifyCaptcha from "./authController.js";
import generateJWT from "../generateJWT.js";

import MailVerification from "../mailVerification.js";
import { use } from "i18next";

const mailVerification = new MailVerification();

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await pool.query(`SELECT * FROM users`);
      res.json(users.rows);
    } catch (error) {
      console.log("Возникла ошибка в getAllUsers :", error);
    }
  }

  async getUserByPassword(req, res) {
    console.log("Вход по паролю")
    const { email, password } = req.body;
    try {
      const userResult = await pool.query(
        `SELECT user_id,email,password,username,uses FROM users WHERE email = $1`,
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(400).json({
          message: "Ошибка! Неверный пароль или пользователь не найден.",
        });
      }

      const user = userResult.rows[0];
      console.log("КАБИНЕТ ПОЛЬЗОВАТЕЛя:",user)
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
        console.log("Ошибка при загрузке куки на сайт.", error);
      }

      res.json({
        message: "Успешный вход",
        token,
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
      console.log("Возникла ошибка в getUserByPassword:", error);
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
      console.log("ошибка в входе по id", error);
      res
        .status(500)
        .json({ message: "Возникла ошибка при входе", error: error.message });
    }
  }

  async addUser(req, res) {
    const { email, password, username, verification_code, recaptchaValue } =
      req.body.data;
    if (!recaptchaValue) {
      return res.status(400).json({ message: "Вы не прошли CAPTCHA" });
    }

    try {
      const isCaptchaValid = await verifyCaptcha(recaptchaValue);
      if (!isCaptchaValid) {
        return res.status(400).json({ message: "Ошибка проверки CAPTCHA" });
      }
      const result = await mailVerification.verifyCode(
        email,
        verification_code
      );

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      this.validateInput({ email, password, username });

      const hashedPassword = await this.hashPassword(password);

      const addUser = await pool.query(
        `INSERT INTO users(email,password,username) VALUES ($1,$2,$3) RETURNING *`,
        [email, hashedPassword, username]
      );
      res.json(addUser.rows[0]);
    } catch (error) {
      console.log("Возникла ошибка в addUser:", error);
      res.status(500).json({
        message: "Ошибка добавления пользователя",
        error: error.message,
      });
    }
  }

  async updateUser(req, res) {
    const id = parseInt(req.params.id, 10);
    const { newPassword, oldPassword, username, changeMethod } = req.body;
    console.log(req.body);
  
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
      const isPasswordValid = await this.comparePassword(oldPassword, storedHash);
  
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
        console.log("New hashed password:", hashedPassword);
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
        console.log("New hashed password for both:", hashedPassword);
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
      console.error("Возникла ошибка в updateUser:", error);
      res.status(500).json({
        message: "Ошибка изменения пользователя",
        error: error.message,
      });
    }
  }
  

  async deleteUser(req, res) {
    const id = parseInt(req.params.id, 10);
    const { password } = req.body;
    try {
      const userResult = await pool.query(
        `SELECT password FROM users WHERE user_id = $1`,
        [id]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const storedHash = userResult.rows[0].password;
      const isPasswordValid = await this.comparePassword(password, storedHash);

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Неверный пароль" });
      }

      const user = await pool.query(
        `DELETE FROM users WHERE user_id = $1 RETURNING *`,
        [id]
      );

      res.json({ message: "Пользователь удален", user: user.rows[0] });
    } catch (error) {
      console.log("Возникла ошибка в deleteUser:", error);
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
      console.log("Возникла ошибка в addUses:", error);
      res.status(500).json({ message: "Ошибка сервера", error: error.message });
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
    newPassword: Joi.string().min(5).required(),
    username: Joi.string().alphanum().min(3).max(30).optional().allow(''),  // Добавляем allow('') чтобы разрешить пустое значение
  });
  

  validateInput(input, method) {
    console.log(method)
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
