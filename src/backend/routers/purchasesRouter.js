import { Router } from "express";
import {
  GetPurchases,
  AddPurchase,
  DeletePurchase,
} from "../controllers/purchasesController.js";

const router = new Router();

router.get("/purchases/:id", (req, res) => GetPurchases(req, res));
router.post("/purchase/:id", (req, res) => AddPurchase(req, res));
router.delete("/rmpurchase/:id", (req, res) => DeletePurchase(req, res));

export default router;
