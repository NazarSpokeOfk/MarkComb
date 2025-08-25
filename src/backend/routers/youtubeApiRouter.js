import { Router } from "express";

import {
  HandleSearch,
  ChannelAndVideoSearch,
} from "../controllers/searchController.js";
import { GetEmail } from "../controllers/getEmailController.js";
import { GetAnalitics } from "../controllers/promotionController.js";
import searchLimiter from "./limiters/youtubeApiRouterLimiters.js";

const router = new Router();

router.post("/search", searchLimiter, (req, res) => HandleSearch(req, res));
router.post("/getdata", (req, res) => GetEmail(req, res));
router.post("/video", searchLimiter, (req, res) =>
  ChannelAndVideoSearch(req, res)
);
router.post("/analitics", (req, res) => GetAnalitics(req, res));

export default router;
