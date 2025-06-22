
import pool from "../db/index.js";
import logger from "../winston/winston.js"

class PurchasesController {
  async getPurchases(req, res) {
    const id = req.params.id;
    try {
      const purchases = await pool.query(
        `SELECT thumbnail,email,channelName FROM purchases_channels WHERE user_id = $1`,
        [id]
      );
      if (purchases.rows.length === 0) {
        res
          .status(404)
          .json({ message: "Не удалось получить покупки пользователя" });
      }
      res.json(purchases.rows[0]);
    } catch (error) {
      logger.error("Возникла ошибка в getPurchases:", error);
    }
  }

  async addPurchase(req, res) {
    const { id } = req.params; // Получаем id пользователя из параметров
    const { thumbnail, email, channelName } = req.body; // Получаем данные из тела запроса

    console.log(`${thumbnail} заглушка ${email} почта, ${channelName} имя`)

    const tokenFromClient = req.cookies.csrfToken;
    const tokenFromSession = req.session.csrfToken;

    if (tokenFromClient !== tokenFromSession) {
      return res.status(403).send('CSRF token mismatch');
    }

    try {
      // Проверяем, существует ли пользователь
      const userCheck = await pool.query(
        `SELECT * FROM users WHERE user_id = $1`,
        [id]
      );
      if (userCheck.rows.length === 0) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Проверяем, существует ли покупка для указанного канала
      const channelsCheck = await pool.query(
        `SELECT * FROM purchases_channels WHERE channel_name = $1 AND user_id = $2`,
        [channelName, id]
      );

      if (channelsCheck.rows.length > 0) {
        // Если канал уже куплен, возвращаем соответствующий ответ
        return res
          .status(409)
          .json({ message: "У вас уже приобретены данные этого канала!" });
      }

      const user = userCheck.rows[0];

      // Проверяем, достаточно ли использований на балансе
      if (user.uses < 1) {
        return res
          .status(402)
          .json({ message: "Недостаточно использований на балансе!" });
      }

      // Обновляем баланс использований
      const updateUses = await pool.query(
        `UPDATE users SET uses = uses - 1 WHERE user_id = $1 RETURNING *`,
        [id]
      );

      // Добавляем покупку в таблицу purchases_channels
      const purchase = await pool.query(
        `INSERT INTO purchases_channels (user_id, channel_name, thumbnail, email) 
         VALUES ($1, $2, $3, $4) 
         RETURNING thumbnail, email, channel_name`,
        [id, channelName, thumbnail, email]
      );

      // Возвращаем результат клиенту
      res.json({
        message: "Вы успешно приобрели данные ютубера",
        purchase: purchase.rows[0],
        remainingUses: updateUses.rows[0].uses,
      });
    } catch (error) {
      logger.error("Возникла ошибка в addPurchase", error);
      res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
  }

  async deletePurchase(req, res) {
    const { channelName } = req.body;
    const id = req.params.id;

    const tokenFromClient = req.cookies.csrfToken;
    const tokenFromSession = req.session.csrfToken;

    console.log(`Бэк : id : ${id}, channelName : ${channelName}`)
    if (tokenFromClient !== tokenFromSession) {
      return res.status(403).send('CSRF token mismatch');
    }
    
    
    try {
      const deleteOperation = await pool.query(
        `DELETE FROM purchases_channels WHERE user_id = $1 AND channel_name = $2 RETURNING *`,
        [id, channelName]
      );
      if (deleteOperation.rows.length === 0) {
        res
          .status(400)
          .json({ message: "Возникла ошибка в удалении покупки." });
      }
      res.json(deleteOperation.rows[0]);
    } catch (error) {
      logger.error("Ошибка в deletePurchase : ", error);
    }
  }
}

export default PurchasesController;
