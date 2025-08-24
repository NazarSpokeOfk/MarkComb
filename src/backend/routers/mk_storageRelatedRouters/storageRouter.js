import {Router} from "express"

import ChannelsController from "../../controllers/filterRelatedControllers/filterController.js";

const router = new Router();

const channelsController = new ChannelsController();

router.post("/filter" , (req,res) => channelsController.selectChannel(req,res));
router.post("/getemail" , (req,res) => channelsController.returnEmailAndName(req,res))

export default router;
