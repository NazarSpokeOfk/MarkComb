import { Router } from "express";
import rateLimit from "../node_modules/express-rate-limit/dist/index.cjs"

import SearchApiController from "../API/searchAPIController.js";
import FilterAPIController from "../API/filterAPIController.js";
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


const searchAPIController = new SearchApiController()
const filterAPIController = new FilterAPIController()

const router = new Router();

router.post("/search" , searchLimiter, (req,res) => searchAPIController.handleSearch(req,res))
router.post("/content-type" , filterLimiter , (req,res) => filterAPIController.searchByContentType(req,res))
router.post("/audience" , filterLimiter,  (req,res) => filterAPIController.searchContentByTargetAudience(req,res))
router.post("/subscribers" , filterLimiter ,  (req,res) => filterAPIController.searchContentBySubsQuantity(req,res))
router.post("/getdata" , filterLimiter , (req,res) => GetData(req,res))

export default router