import cron from "node-cron";
import mainPool from "../db/mk/index.js";
import logger from "../winston/winston.js";

cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const result = await mainPool.query(
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
