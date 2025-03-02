import {Router} from "express"

import ChannelsController from "../controllers/channelsController.js";

const router = new Router();

const channelsController = new ChannelsController();

router.post("/filter" , (req,res) => channelsController.selectChannel(req,res));

export default router;
