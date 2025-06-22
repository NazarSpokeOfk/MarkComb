import {Router} from "express"

import ChannelsController from "../../controllers/channels/channelsController.js";
import EmailAndNameController from "../../controllers/channels/emailAndNameContoller.js";

const router = new Router();

const channelsController = new ChannelsController();
const emailAndNameContoller = new EmailAndNameController();

router.post("/filter" , (req,res) => channelsController.selectChannel(req,res));
router.post("/getemail" , (req,res) => emailAndNameContoller.returnEmailAndName(req,res))

export default router;
