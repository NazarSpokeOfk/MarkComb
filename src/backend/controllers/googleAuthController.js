import pool from "../db/index.js";

import logger from "../winston/winston.js";
import crypto from "crypto";

import generateJWT from "../generateJWT.js";

import { OAuth2Client } from "google-auth-library";

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

    const token = generateJWT(user);

    if (!findUser) {
      return res
        .status(400)
        .json({
          message: "Аккаунта, в который вы пытаетесь зайти, не существует",
        });
    }

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
