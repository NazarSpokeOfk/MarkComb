import mainPool from "../db/mk/index.js";

import generateJWT from "../cookies/generateJWT.js";

import returnUserInformationModule from "../modules/returnUserInformationModule.js";
import returnCsrftokenModule from "../modules/returnCsrftokenModule.js";
import returnCookieModule from "../modules/returnCookieModule.js";
import hashPasswordModule from "../modules/hashPasswordModule.js";

import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

export const authThroughGoogle = async (credential) => {
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

    const user = findUser.rows[0];

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

          returnCookieModule(token, res);

          returnCsrftokenModule(csrfToken, res);

          const userInformation = returnUserInformationModule(user, token, csrfToken);

          return userInformation

        } else {
          throw new Error("Error creation account through Google")
        }
      } catch (error) {
        throw new Error("Server error")
      }
    }

    const token = generateJWT(user);

    const userId = await findUser.rows[0].user_id;

    const userChannels = await mainPool.query(
      `SELECT channel_name,email,thumbnail,transaction_id FROM purchases_channels WHERE user_id = $1`,
      [userId]
    );

    returnCookieModule(token, res);

    const csrfToken = crypto.randomBytes(16).toString("hex");
    req.session.csrfToken = csrfToken;

    returnCsrftokenModule(csrfToken, res);
    const userInformation = returnUserInformationModule(user, token, csrfToken);

    res.json({
      userInformation,
      channels: userChannels.rows,
    });
  } catch (error) {
    throw new Error("Server error")
  }
};
