import pool from "../../db/main/index.js";
import logger from "../../winston/winston.js"
class ReviewsController {
  async addReview(req, res) {
    const { reviewText, websiteMark } = req.body;

    try {
       await pool.query(
        `INSERT INTO reviews (review,mark) VALUES ($1,$2) RETURNING * `,
        [reviewText, websiteMark]
      );
      return res.status(200).json({status : "ok"})
    } catch (error) {
      if(error.code === "23505"){
        return res.status(400).json({message : "exists"})
      }
      logger.error("Возникла ошибка при добавлении отзыва : ", error);
      return res.status(500).json({status : false})
    }
  }
}
export default ReviewsController;
