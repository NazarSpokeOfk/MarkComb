import Router from "express";

import VoteController from "../../controllers/user/voteController.js";

const router = new Router();

const voteController = new VoteController();

router.post("/vote" , (req,res) => voteController.makeVote(req,res))

export default router