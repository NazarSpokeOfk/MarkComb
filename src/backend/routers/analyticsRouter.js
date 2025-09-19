import { Router } from "express";
import { GetAnalyticsTotal, GetAnalyticsBetween , GetAnalyticsYesterday } from "../controllers/analyticsController.js";
const router = new Router();

router.post("/analytics/between", (req,res) =>  GetAnalyticsBetween(req,res));
router.post("/analytics/total" , (req,res) => GetAnalyticsTotal(req,res));
router.post("/analytics/yesterday" , (req,res) => GetAnalyticsYesterday(req,res));

export default router;