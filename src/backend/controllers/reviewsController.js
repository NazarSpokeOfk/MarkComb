import { addReview } from "../services/reviews.service.js";
import sendResponseModule from "../modules/sendResponseModule.js";

async function AddReview(req, res) {
  try {
    const { reviewText, websiteMark } = req.body;

    const result = await addReview(reviewText, websiteMark);

    sendResponseModule(res, result);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}

export default AddReview;