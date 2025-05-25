import pool from "../db/index.js";

import bcrypt from "bcrypt";

import logger from "../winston/winston.js";
import crypto from "crypto";

import generateJWT from "../generateJWT.js";

import { OAuth2Client } from "google-auth-library";

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const googleAuthController = async (req, res) => {
  const { credential } = req.body;

  const client = new OAuth2Client(process.env.OAUTH2_CLIENT);

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.OAUTH2_CLIENT,
    });
    const payload = ticket.getPayload();

    const findUser = await pool.query(
      `SELECT email,user_id,username,uses FROM users WHERE email = $1`,
      [payload.email]
    );

    const user = findUser.rows[0];

    if (!user) {
      const generatedUsername = payload.email.split("@")[0];
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await hashPassword(randomPassword);

      try {
        const creatingUser = await pool.query(
          "INSERT INTO users (email,password,username) VALUES ($1,$2,$3) RETURNING *",
          [payload.email, hashedPassword, generatedUsername]
        );
        const user = creatingUser.rows[0];
        if (user) {
          const token = generateJWT(user);

          console.log("Отправка куки :", token);

          try {
            res.cookie("sessionToken", token, {
              httpOnly: false,
              secure: true,
              maxAge: 3600000,
              sameSite: "lax",
            });
            console.log("Ответ отправлен. Заголовки:", res.getHeaders());
          } catch (error) {
            console.log("Ошибка при отправке куки.", error);
          }
          return res.status(200).json({
            message: "Аккаунт создан через Google",
            status: true,
            user: {
              user_id: user.user_id,
              email: user.email,
              uses: user.uses,
              username: user.username,
            },
          });
        } else {
          return res
            .status(500)
            .json({ message: "Ошибка создания аккаунта через Google" });
        }
      } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
      }
    }

    const token = generateJWT(user);

    const userId = await findUser.rows[0].user_id;

    const userChannels = await pool.query(
      `SELECT channel_name,email,created_at,thumbnail FROM purchases_channels WHERE user_id = $1`,
      [userId]
    );

    try {
      res.cookie("sessionToken", token, {
        httpOnly: false,
        secure: true,
        maxAge: 3600000,
        sameSite: "strict",
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
        secure: true,
        maxAge: 3600000,
        sameSite: "strict",
      });
    } catch (error) {
      console.log("Ошибка при загрузке csrfТокена на сайт", error);
    }

    res.json({
      message: "Успешный вход",
      user: {
        user_id: userId,
        email: user.email,
        uses: user.uses,
        username: user.username,
      },
      channels: userChannels.rows,
    });
  } catch (error) {
    return res.status(400).json({ message: "Аутентификация гугл не прошла." });
  }
};
export default googleAuthController;
