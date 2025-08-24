import { Router } from "express";
import PurchasesController from "../../controllers/purchasesRelatedControllers/purchasesController.js"

const router = new Router()
const purchasesController = new PurchasesController

router.get('/purchases/:id',(req,res) =>purchasesController.getPurchases(req,res))
router.post('/purchase/:id',(req,res) =>purchasesController.addPurchase(req,res))
router.delete('/rmpurchase/:id',(req,res) =>purchasesController.deletePurchase(req,res))

export default router