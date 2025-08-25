import mainPool from "../db/mk/index.js";
import logger from "../winston/winston.js";

export const addReview = async (reviewText, websiteMark) => {
  try {
    await mainPool.query(
      `INSERT INTO reviews (review,mark) VALUES ($1,$2) RETURNING * `,
      [reviewText, websiteMark]
    );
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("exists");
    }
    logger.error("Возникла ошибка при добавлении отзыва : ", error);
    throw new Error("Error during adding a review");
  }
};
