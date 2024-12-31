import { Router } from "express";
const router = new Router

import UserController from "../controllers/userController.js";

const userController = new UserController

router.get('/users', (req,res) => userController.getAllUsers(req,res))
router.post('/Uses/:id',(req,res) => userController.addUses(req,res))
router.post('/user', (req,res) =>userController.addUser(req,res))
router.put('/update/:id', (req,res) =>userController.updateUser(req,res))
router.delete('/user/:id', (req,res) =>userController.deleteUser(req,res))

export default router
