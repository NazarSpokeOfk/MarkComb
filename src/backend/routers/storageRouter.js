import {Router} from "express"

import StorageController from "../controllers/storageController.js";

const router = new Router();

const storageController = new StorageController();

router.post("/audience" , (req,res) => storageController.getRandomChannelByAudience(req,res));
router.get("/contenttype/:ContentType" , (req,res) => storageController.getRandomChannelByContentType(req,res));

export default router;
