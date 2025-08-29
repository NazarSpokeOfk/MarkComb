import { Router } from "express";

import { SendVerification } from "../controllers/verificationController.js";

const router = new Router();

router.post("/verification/:action", (req, res) => SendVerification(req, res)); 

export default router