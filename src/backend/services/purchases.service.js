import mainPool from "../db/mk/index.js";
import logger from "../winston/winston.js";

import { ForbiddenError } from "../errorHandlers.js"; 

export const getPurchases = async (id) => {
  try {
    const purchases = await mainPool.query(
      `SELECT thumbnail,email,channelName,transaction_id FROM purchases_channels WHERE user_id = $1`,
      [id]
    );
    if (purchases.rows.length === 0) {
      res
        .status(404)
        .json({ message: "Не удалось получить покупки пользователя" });
    }
    res.status(200).json(purchases.rows[0]);
  } catch (error) {
    logger.error("Возникла ошибка в getPurchases:", error);
  }
};

export const addPurchase = async (
  id,
  thumbnail,
  email,
  channelName,
  tokenFromClient,
  tokenFromSession
) => {
  //дыра в безопасности, тк undefined === undefined. Нет обоих токенов - покупка совершится
  if (tokenFromClient !== tokenFromSession) {
    console.log("Ало?")
    throw new ForbiddenError("Forbidden")
  }
  console.log("ДДАДАД2")
  try {
    // Проверяем, существует ли пользователь
    const userCheck = await mainPool.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [id]
    );
    if (userCheck.rows.length === 0) {
      throw new Error("User not found");
    }

    // Проверяем, существует ли покупка для указанного канала
    const channelsCheck = await mainPool.query(
      `SELECT * FROM purchases_channels WHERE channel_name = $1 AND user_id = $2`,
      [channelName, id]
    );

    if (channelsCheck.rows.length > 0) {
      // Если канал уже куплен, возвращаем соответствующий ответ
      throw new Error("You already bought this contact data");
    }

    const user = userCheck.rows[0];

    // Проверяем, достаточно ли использований на балансе
    if (user.uses < 1) {
      throw new Error("Not enough uses");
    }

    // Обновляем баланс использований
    const updateUses = await mainPool.query(
      `UPDATE users SET uses = uses - 1 WHERE user_id = $1 RETURNING *`,
      [id]
    );

    // Добавляем покупку в таблицу purchases_channels
    const request = await mainPool.query(
      `INSERT INTO purchases_channels (user_id, channel_name, thumbnail, email) 
         VALUES ($1, $2, $3, $4) 
         RETURNING thumbnail, email, channel_name , transaction_id`,
      [id, channelName, thumbnail, email]
    );

    // Возвращаем результат клиенту
    const purchase = request.rows[0];

    return { purchase , updateUses };
  } catch (error) {
    logger.error("Возникла ошибка в addPurchase", error);
    throw new Error("Server error");
  }
};

export const deletePurchase = async (
  channelName,
  tokenFromClient,
  tokenFromSession,
  id
) => {
  if (tokenFromClient !== tokenFromSession) {
    throw new ForbiddenError("Session expired")
  }

  try {
    const deleteOperation = await mainPool.query(
      `DELETE FROM purchases_channels WHERE user_id = $1 AND channel_name = $2 RETURNING *`,
      [id, channelName]
    );
    if (deleteOperation.rows.length === 0) {
      throw new Error("We accured error during deleting a purchase");
    }
    const result = deleteOperation.rows[0];
    return result;
  } catch (error) {
    throw new Error("Server error");
  }
};
