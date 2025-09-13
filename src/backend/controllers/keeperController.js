import { collectAnalytics } from "../services/keeper.service.js";
import sendResponseModule from "../modules/sendResponseModule.js";

export async function CollectAnalytics (req,res) {
    const {channel_name,videoName} = req.body;
    try {
        const result = await collectAnalytics(channel_name,videoName);
        sendResponseModule(res,result);
    } catch (error) {
        sendResponseModule(res,null,error)
    }
}