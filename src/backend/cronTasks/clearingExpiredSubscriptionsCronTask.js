import cron from "node-cron";
import pool from "../db/index.js";
import logger from "../winston/winston.js";

cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      const clearSubscriptionsDate = await pool.query(
        `UPDATE users SET subscription_expiration = null WHERE subscription_expiration <= CURRENT_DATE`
      );

      console.log(
        `Очищена подписка у ${clearSubscriptionsDate.rowCount} пользователей ${today}`
      );
    } catch (error) {
      logger.error("Ошибка при начислении использований за подписку", error);
    }
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);
