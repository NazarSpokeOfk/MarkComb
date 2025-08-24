import { Router } from "express";
import rateLimit from "../../node_modules/express-rate-limit/dist/index.cjs"

import SearchController from "../../YouTubeApiRelatedControllers/email/searchController.js"; 
import getEmailController from "../../YouTubeApiRelatedControllers/email/getEmailController.js";
import PromotionController from "../../YouTubeApiRelatedControllers/email/promotionController.js";

const searchLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max : 15,
    handler : (req,res) => {
        res.status(429).json({
            status : 429,
            message : "You have exceeded the request limit. Try again later"
        })
    },
    skip : (req,res) => {
        const allowedIPs = ["181.177.126.105"," 5.101.13.116"]
        return allowedIPs.includes(req.ip)
    }
})

const promotionController = new PromotionController()
const searchController = new SearchController()

const router = new Router();

router.post("/search" , searchLimiter, (req,res) => searchController.handleSearch(req,res))
router.post("/getdata" , (req,res) => getEmailController(req,res))
router.post("/video" , searchLimiter , (req,res) => promotionController.channelAndVideoSearch(req,res))
router.post("/analitics" , (req,res) => promotionController.getAnalitics(req,res))

export default router