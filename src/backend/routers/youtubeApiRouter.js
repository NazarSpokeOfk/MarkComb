import { Router } from "express";

import {
  HandleSearch
} from "../controllers/searchController.js";
import { CollectAnalytics } from "../controllers/keeperController.js";
import { GetEmail } from "../controllers/getEmailController.js";
import searchLimiter from "./limiters/youtubeApiRouterLimiters.js";

const router = new Router();

router.post("/search", searchLimiter, (req, res) => HandleSearch(req, res));
router.post("/getdata", (req, res) => GetEmail(req, res));
router.post("/collect-analytics", searchLimiter, (req, res) =>
  CollectAnalytics(req, res)
);

export default router;
