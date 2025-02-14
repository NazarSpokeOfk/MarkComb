import {Router} from "express"

import StorageController from "../controllers/storageController"

const router = new Router();
const storageController = new StorageController();

router.post("/kidsChannels" , (res,res) => storageController.manageChannelsData(req,res));

export default router;
