import {Router} from "express"
import { SelectChannel , ReturnEmailAndName} from "../controllers/filterController.js"
import searchLimiter from "./limiters/youtubeApiRouterLimiters.js"
const router = new Router();

router.post("/filter" , searchLimiter ,  (req,res) => SelectChannel(req,res));
router.post("/getemail" , (req,res) => ReturnEmailAndName(req,res))

export default router;
