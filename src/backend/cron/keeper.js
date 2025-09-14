import cron from "node-cron";
import storagePool from "../db/mk_storage/index.js";
import logger from "../winston/winston.js";

import { getAnalitics } from "../services/promotion.service.js";
import { calculateInterestCoef } from "../modules/calculateInterestCoef.js";

cron.schedule(
  "00 00 * * *",
  async () => {
    try {
      const request = await storagePool.query(
        "SELECT video_id, points_of_interest FROM analytics_meta"
      );
      // берем videoID и очки интереса всех видео
      for (const row of request.rows) {
        // проходимся по каждому из видео
        try {
          const days_in_db = await storagePool.query(
            "SELECT CURRENT_DATE - MIN(date) AS days_in_db FROM analytics WHERE video_id = $1",
            [row.video_id]
          );
          console.log("row.points_of_interest : ",row.points_of_interest)
          console.log("rdays_in_db.rows[0] : ",days_in_db.rows[0].days_in_db)
          // смотрим сколько дней видос лежит в бд
          
          const coef = calculateInterestCoef(
            row.points_of_interest,
            days_in_db.rows[0].days_in_db
          );
          console.log("coef : ",coef)
          console.log("typeof(coef) : ",typeof(coef))
          // рассчитываем коэфициент интереса к видосу
          if (coef <= 0.14) {
            await storagePool.query("DELETE FROM videos WHERE video_id = $1", [
              row.video_id,
            ]);
            // если коэф меньше или равен 0.14 то удаляем его из videos, а записи прязанные к этому videoId сами удалятся из остальных таблиц при помощи каскадного удаления
            continue; // хз удалять или нет
          } else {
            const request = await getAnalitics(row.video_id);
            // получаем свежую аналитику видоса
            await storagePool.query(
              "UPDATE analytics_meta SET interest_coef = $1 WHERE video_id = $2",
              [coef, row.video_id]
            );
            // обновляем коэффициент для следующего сбора аналитики.
            await storagePool.query(
              "INSERT INTO analytics(video_id,views,likes,comments) VALUES ($1,$2,$3,$4) ON CONFLICT (video_id, date) DO UPDATE SET views = EXCLUDED.views, likes = EXCLUDED.likes, comments = EXCLUDED.comments",
              [row.video_id, request.views, request.likes, request.comments]
            );
            // добавляем свежие данные.
          }
        } catch (error) {
          console.log("Ошибка при работе с полученными метаданными : ", error);
          logger.error("Ошибка при работе с полученными метаданными : ", error);
        }
      }
    } catch (error) {
      logger.error("Ошибка при работе keeper : ", error);
    }
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);
