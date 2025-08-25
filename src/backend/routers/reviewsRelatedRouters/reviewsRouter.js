import {Router} from "express"
import ReviewsController from "../../controllers/reviewsRelatedControllers/reviewsController.js"

import reviewLimiter from "./limiters.js";

const router = new Router();

const reviewsController = new ReviewsController();

router.post('/review'  , reviewLimiter, (req,res) => reviewsController.addReview(req,res))

export default router;