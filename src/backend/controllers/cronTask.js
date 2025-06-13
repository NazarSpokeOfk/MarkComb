import cron from "node-cron";
import pool from "../db";
import logger from "../winston/winston";

cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const result = await pool.query(
      `UPDATE users 
       SET uses = uses + 5 
       WHERE subscription_expiration >= CURRENT_DATE`
    );
    
    console.log(`Начислено 5 uses ${result.rowCount} пользователям в ${today}`);
  } catch (error) {
    logger.error("Ошибка при начислении использований за подписку", error);
  }
}, {
    scheduled : true,
    timezone : "Europe/Moscow"
});
