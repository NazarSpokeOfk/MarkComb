import {Router} from "express"
import { SelectChannel , ReturnEmailAndName} from "../controllers/filterController.js"
const router = new Router();

router.post("/filter" , (req,res) => SelectChannel(req,res));
router.post("/getemail" , (req,res) => ReturnEmailAndName(req,res))

export default router;
