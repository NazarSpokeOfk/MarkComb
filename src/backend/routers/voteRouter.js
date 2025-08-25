import Router from "express";

import { MakeVote } from "../controllers/voteController.js"

const router = new Router();

router.post("/vote" , (req,res) => MakeVote(req,res))

export default router