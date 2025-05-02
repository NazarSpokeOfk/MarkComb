import { Router } from "react-router-dom"

import PaymentController from "../controllers/paymentController";

const router = new Router();

const paymentController = new PaymentController();

router.post("/payment" , (req,res) => paymentController.handleCallBack(req,res))
router.get("/payment-link" , (req,res) => paymentController.createLink(req,res))

export default router;