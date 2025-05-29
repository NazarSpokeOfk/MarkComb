import pool from "../db/index.js";
import logger from "../winston/winston.js"
class ReviewsController {
  async addReview(req, res) {
    const { reviewText, websiteMark } = req.body;

    try {
      await pool.query(
        `INSERT INTO reviews (review,mark) VALUES ($1,$2) RETURNING * `,
        [reviewText, websiteMark]
      );
    } catch (error) {
      logger.error("Возникла ошибка при добавлении отзыва : ", error);
      res.status(429).json({status : false})
    }
    res.status(200).json({status : true})
  }
}
export default ReviewsController;
