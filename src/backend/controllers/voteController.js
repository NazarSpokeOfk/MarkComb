import sendResponseModule from "../modules/sendResponseModule";
import { makeVote } from "../services/vote.service";

export async function MakeVote(req,res) {
  try {
    const {featureName, user_id} = req.body;
    const result = await makeVote(featureName,user_id)
    sendResponseModule(res,result)
  } catch (error) {
    sendResponseModule(res,null,error)
  }
}