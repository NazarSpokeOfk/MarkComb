import { Router } from "express";
import rateLimit from "../node_modules/express-rate-limit/dist/index.cjs"

import PromotionAPIController from "../API/promotionAPIController.js"
import SearchApiController from "../API/searchAPIController.js";
import GetData from "../API/getData.js";

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

const filterLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max : 10,
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

const promotionAPIController = new PromotionAPIController()
const searchAPIController = new SearchApiController()

const router = new Router();

router.post("/search" , searchLimiter, (req,res) => searchAPIController.handleSearch(req,res))
router.post("/getdata" , (req,res) => GetData(req,res))
router.post("/video" , searchLimiter , (req,res) => promotionAPIController.channelAndVideoSearch(req,res))
router.post("/analitics" , (req,res) => promotionAPIController.getAnalitics(req,res))

export default router