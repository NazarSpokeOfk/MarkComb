import { addReview } from "../services/reviews.service";
import sendResponseModule from "../modules/sendResponseModule";

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