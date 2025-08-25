import sendResponseModule from "../modules/sendResponseModule";

import { getAnalitics } from "../services/promotion.service";

export async function GetAnalitics(req,res) {
  try {
    const { videoId } = req.body;
    const result = await getAnalitics(videoId);
    sendResponseModule(res,result);
  } catch (error) {
    sendResponseModule(res,null,error)
  }
}