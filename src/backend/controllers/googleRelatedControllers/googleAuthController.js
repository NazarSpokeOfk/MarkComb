import mainPool from "../../db/mk/index.js";

import crypto from "crypto";

import generateJWT from "../../cookies/generateJWT.js";

import returnUserInformation from "../../modules/returnUserInformationModule.js";
import returnCsrftoken from "../../modules/returnCsrftokenModule.js";
import returnCookie from "../../modules/returnCookieModule.js";
import { OAuth2Client } from "google-auth-library";

import hashPasswordModule from "../../modules/hashPasswordModule.js";

const googleAuthController = async (req, res) => {
  const { credential } = req.body;

  const client = new OAuth2Client(process.env.OAUTH2_CLIENT);

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.OAUTH2_CLIENT,
    });
    const payload = ticket.getPayload();

    const findUser = await mainPool.query(
      `SELECT email,user_id,username,uses,subscription_expiration,isvoteenabled FROM users WHERE email = $1`,
      [payload.email]
    );

    console.log("check");

    const user = findUser.rows[0];

    console.log("USer :", user);

    if (!user) {
      const generatedUsername = payload.email.split("@")[0];
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await hashPasswordModule(randomPassword);

      try {
        const creatingUser = await mainPool.query(
          "INSERT INTO users (email,password,username) VALUES ($1,$2,$3) RETURNING *",
          [payload.email, hashedPassword, generatedUsername]
        );
        const user = creatingUser.rows[0];
        if (user) {
          const token = generateJWT(user);

          const csrfToken = crypto.randomBytes(16).toString("hex");
          req.session.csrfToken = csrfToken;

          returnCookie(token, res);

          returnCsrftoken(csrfToken, res);

          const userInformation = returnUserInformation(user, token, csrfToken);

          return res.status(200).json({
            userInformation,
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

    const userChannels = await mainPool.query(
      `SELECT channel_name,email,thumbnail,transaction_id FROM purchases_channels WHERE user_id = $1`,
      [userId]
    );

    returnCookie(token, res);

    const csrfToken = crypto.randomBytes(16).toString("hex");
    req.session.csrfToken = csrfToken;

    returnCsrftoken(csrfToken, res);
    const userInformation = returnUserInformation(user, token, csrfToken);

    res.json({
      userInformation,
      channels: userChannels.rows,
    });
  } catch (error) {
    return res.status(400).json({ message: "Аутентификация гугл не прошла." });
  }
};
export default googleAuthController;
