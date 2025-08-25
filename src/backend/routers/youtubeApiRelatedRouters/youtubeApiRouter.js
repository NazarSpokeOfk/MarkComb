import { Router } from "express";

import SearchController from "../../YouTubeApiRelatedControllers/email/searchController.js"; 
import getEmailController from "../../YouTubeApiRelatedControllers/email/getEmailController.js";
import PromotionController from "../../YouTubeApiRelatedControllers/email/promotionController.js";

import searchLimiter from "./limiters.js";

const promotionController = new PromotionController()
const searchController = new SearchController()

const router = new Router();

router.post("/search" , searchLimiter, (req,res) => searchController.handleSearch(req,res))
router.post("/getdata" , (req,res) => getEmailController(req,res))
router.post("/video" , searchLimiter , (req,res) => promotionController.channelAndVideoSearch(req,res))
router.post("/analitics" , (req,res) => promotionController.getAnalitics(req,res))

export default router