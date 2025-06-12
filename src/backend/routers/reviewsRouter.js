import {Router} from "express"
import ReviewsController from "../controllers/reviewsController.js"
import rateLimit from "../node_modules/express-rate-limit/dist/index.cjs"

const reviewLimiter = rateLimit({
    windowMs : 30 * 60 * 1000,
    max : 3,
    handler : (req,res)=>{
        res.status(429).json({
            status : 429,
            message : "You have exceeded the request limit. Try again later"
        })
    },
    skip : (req,res) => {
        const allowedIPs = ["181.177.126.105","5.101.13.116"]
        return allowedIPs.includes(req.ip)
    }
})

const router = new Router();

const reviewsController = new ReviewsController();

router.post('/review'  , reviewLimiter, (req,res) => reviewsController.addReview(req,res))

export default router;