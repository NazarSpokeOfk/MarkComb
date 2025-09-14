import { Router } from "express";
import { GetAnalyticsByDay, GetAnalyticsByRande } from "../controllers/analyticsController.js";
const router = new Router();

router.post("/analytics/range", (req,res) =>  GetAnalyticsByRande(req,res));
router.post("/analytics/day" , (req,res) => GetAnalyticsByDay(req,res));

export default router;