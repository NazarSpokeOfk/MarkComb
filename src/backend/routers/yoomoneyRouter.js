import {Router} from "express"

import createPayment from "../payment/yoomoney.js";
import handleWebHook from "../payment/webhook.js";

const router = new Router();

router.post("/payment" , (req,res) => createPayment(req,res));
router.post("/checkpayment" , (req,res) => handleWebHook(req,res))

export default router