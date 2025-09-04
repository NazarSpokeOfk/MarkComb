import bcrypt from "bcrypt";
import crypto from "crypto";
import logger from "../winston/winston.js";
import mainPool from "../db/mk/index.js";
import verifyCaptchaModule from "../modules/verifyCaptchaModule.js";
import generateJWT from "../cookies/generateJWT.js";
import domains from "disposable-email-domains/index.json" assert { type: "json" };
import { randomUUID } from "crypto";

import { VerifyValue } from "../controllers/verificationController.js";
import returnUserInformationModule from "../modules/returnUserInformationModule.js";
import clearCookie from "../cookies/clearCookies.js";

import validateInput from "../validation/validation.js";

import hashPasswordModule from "../modules/hashPasswordModule.js";

import "../loadEnv.js";

export async function getUserIp() {
  const ipInfoKey = process.env.IP_INFO_API_KEY;
  try {
    const response = await fetch(`https://ipinfo.io/json?token=${ipInfoKey}`);
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
    return "en";
  }
}

export async function logIn(email, password) {
  try {
    const userResult = await mainPool.query(
      `SELECT user_id,email,password,username,uses,isvoteenabled,subscription_expiration FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      throw new Error("We can't find user");
    }

    let user = userResult.rows[0];

    if (user.subscription_expiration !== null) {
      user.isSubscriber = true;
    } else {
      user.isSubscriber = false;
    }

    const lang = await getUserIp();

    user.lang = lang;

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Wrong password");
    }

    const token = generateJWT(user);

    const userId = await user.user_id;

    const userChannels = await mainPool.query(
      `SELECT channel_name,email,thumbnail,transaction_id FROM purchases_channels WHERE user_id = $1`,
      [userId]
    );

    console.log("Каналы пользователя : ",userChannels.rows)

    const csrfToken = crypto.randomBytes(16).toString("hex");

    const userInformation = returnUserInformationModule(user, token, csrfToken);

    return {
      data: { userInformation, channels: userChannels.rows },
      meta: { csrfToken, token },
    };
  } catch (error) {
    logger.error("Возникла ошибка в logIn:", error);
    throw new Error("Error during logging in.");
  }
}

export async function getUserByUserId(user_id) {
  try {
    const userResult = await mainPool.query(
      `SELECT user_id,email,username,uses,subscription_expiration,isvoteenabled FROM users WHERE user_id = $1`,
      [user_id]
    );

    const user = userResult.rows[0];

    if (userResult.rows.length === 0) {
      throw new Error("User not found");
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
    const csrfToken = crypto.randomBytes(16).toString("hex");
    const userInformation = returnUserInformationModule(user, csrfToken);
    return { userInformation, channels: userChannels.rows };
  } catch (error) {
    logger.error(" (getUserById) ошибка в входе по id", error);
  }
}

export async function signIn(
  email,
  password,
  username,
  verification_code,
  recaptchaValue,
  req
) {
  try {
    const domain = email.split("@")[1].toLowerCase(); //закомментировать при тестировании

    if (domains.includes(domain)) {
      //закомментировать при тестировании
      throw new Error("Temp mail not allowed");
    }

    if (!req.session.captchaVerified && recaptchaValue) {
      //закомментировать при тестировании
      // Если капча еще не была проверена
      const isCaptchaValid = await verifyCaptchaModule(recaptchaValue);
      if (!isCaptchaValid) {
        throw new Error("Invalid captcha validation");
      }

      // Если капча прошла, сохраняем в сессии //закомментировать при тестировании
      req.session.captchaVerified = true;
      req.session.save((err) => {
        if (err) {
          logger.error("Ошибка сохранения сессии:", err);
          return;
        }
      });
    }

    const verification = await VerifyValue(verification_code, "signIn");

    if (!verification.isActionDone) return verification;

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

    const user = SignIn.rows[0];

    const token = generateJWT(user);

    const userInformation = returnUserInformationModule(user, token, csrfToken);

    return {
      data: { userInformation, channels: [] },
      meta: { csrfToken, token },
    };
  } catch (error) {
    logger.error(error);
    console.log("Ошибка signIn :", error);
    throw new Error("Server error");
  }
}

export async function changeUserName(newValue, changeMethod, id) {
  try {
    const userResult = await mainPool.query(
      `SELECT password FROM users WHERE user_id = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      throw new Error("Wrong password");
    }

    validateInput({ newValue }, "update");

    let updateUser;

    if (changeMethod === "username") {
      updateUser = await mainPool.query(
        `UPDATE users SET username = $1 WHERE user_id = $2 RETURNING *`,
        [newValue, id]
      );
    } else {
      throw new Error("Not correct data changing method");
    }

    if (updateUser.rows.length === 0) {
      throw new Error("Data changing error");
    }

    const userInformation = returnUserInformationModule(updateUser.rows[0]);
    return { userInformation };
  } catch (error) {
    logger.error(" (updateUser) Возникла ошибка в updateUser:", error);
    throw new Error("Data changing error");
  }
}

export async function changePassword(newPassword,token){
  console.log("Пропсы в changePassword : " , newPassword,token)
  try {
    const verification = await VerifyValue(token, "reset");

    const hashedPassword = await hashPasswordModule(newPassword);

    if (verification.isActionDone) {
      const result = await mainPool.query(
        "UPDATE users SET password = $1 WHERE email = $2 RETURNING *",
        [hashedPassword,verification.row.email]
      );
      if (result.rowCount > 0) {
        return { isPasswordChanged: true };
      } else {
        return { isPasswordChanged: false };
      }
    } else {
      throw new Error("Token mismatch");
    }
  } catch (error) {
    console.log(error)
    throw new Error("Error during changing password")
  }
}

export async function deleteUser(token) {
  console.log("Пропсы в deleteUser : " , token)
  try {
    const verification = await VerifyValue(token, "delete");

    if (verification.isActionDone) {
      const result = await mainPool.query(
        "DELETE FROM users WHERE email = $1 RETURNING *",
        [verification.row.email]
      );
      if (result.rowCount > 0) {
        return { isAccountDeleted: true };
      } else {
        return { isAccountDeleted: false };
      }
    } else {
      throw new Error("Token mismatch");
    }
  } catch (error) {
    console.log(error)
    throw new Error("Error while deleting profile");
  }
}

export async function addUses(id, password, uses) {
  try {
    const userCheck = await mainPool.query(
      `SELECT * FROM users WHERE user_id = $1 AND password = $2`, //Че за хуйня? Зачем здесь пароль?
      [id, password]
    );

    if (userCheck.rows.length === 0) {
      throw new Error("????");
    }

    const updateUser = await mainPool.query(
      `UPDATE users 
                 SET uses = uses + $1
                 WHERE user_id = $2
                 RETURNING *`,
      [uses, id]
    );

    return { updatedUser: updateUser.rows[0] };
  } catch (error) {
    logger.error("Возникла ошибка в addUses:", error);
    throw new Error("Server error");
  }
}

// export async function isVerificationCodeCorrect(req, res) {
//   const { email, verification_code } = req.body;

//   try {
//     const emailCheck = await mailVerificationModule.verifyCode(
//       email,
//       verification_code
//     );

//     if (emailCheck.success !== true) {
//       res.status(400).json({ message: "Неправильный код с почты" });
//       return;
//     } else {
//       res.status(200).json({ message: "Код правильный." });
//       return;
//     }
//   } catch (error) {
//     logger.error("Ошибка в isVerificationCodeCorrect : ", error);
//   }
// } Мб отвал регистрации

// export async function changePassword(req, res) {
//   const { newPassword, email } = req.body;

//   console.log(req.body);
//   try {
//     const hashedPassword = await hashPasswordModule(newPassword);

//     const changeUserPassword = await mainPool.query(
//       `UPDATE users SET password = $1 WHERE email = $2 RETURNING *`,
//       [hashedPassword, email]
//     );

//     if (changeUserPassword.rows.length != 0) {
//       res.status(200).json({ message: "Пароль был сменен!" });
//     } else {
//       res.status(500).json({ message: "Аккаунта не существует" });
//     }
//   } catch (error) {
//     logger.error(
//       " (changePassword) Возникла ошибка в изменении пароля :",
//       error
//     );
//   }
// }

export async function activatePromocode(promocode, email) {
  try {
    if (promocode !== process.env.USES_PROMOCODE) {
      throw new Error("Wrong promocode");
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
      throw new Error("Promocode activated already");
    }

    return { newUses: rows[0].uses };
  } catch (error) {
    logger.error("Ошибка в activatePromocode:", error);
    throw new Error(error.message);
  }
}

async function comparePassword(inputPassword, storedHash) {
  return await bcrypt.compare(inputPassword, storedHash);
}
