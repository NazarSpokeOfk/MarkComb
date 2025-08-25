import {Router} from "express"

import reviewLimiter from "./limiters/reviewsRouterLimiter.js";

import AddReview from "../controllers/reviewsController.js"

const router = new Router();

router.post('/review'  , reviewLimiter, (req,res) => AddReview(req,res))

export default router;