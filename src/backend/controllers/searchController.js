import sendResponseModule from "../modules/sendResponseModule.js";
import { handleSearch , channelAndVideoSearch } from "../services/search.service.js";

export async function HandleSearch(req, res) {
  try {
    const { mainInputValue } = req.body;
    const result = await handleSearch(mainInputValue);
    sendResponseModule(res, result);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}

export async function ChannelAndVideoSearch(req,res) {
  try {
    const {channel_name, videoName} = req.body;
    const result = await channelAndVideoSearch(channel_name,videoName)
    sendResponseModule(res,result);
  } catch (error) {
    sendResponseModule(res,null,error);
  }
}


