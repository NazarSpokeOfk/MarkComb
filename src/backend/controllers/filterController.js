import "../loadEnv.js";
const apiKey = process.env.GOOGLE_API_KEY;

import {
  selectChannel,
  returnEmailAndName,
} from "../services/filter.service.js";

import sendResponseModule from "../modules/sendResponseModule.js";

export async function SelectChannel(req, res) {
  try {
    const { ageGroup, minSubs, maxSubs, content_type } = req.body;

    const result = await selectChannel(
      ageGroup,
      minSubs,
      maxSubs,
      content_type
    );
    sendResponseModule(res, result);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}

export async function ReturnEmailAndName(req, res) {
  try {
    const { channelId } = req.body;
    const result = await returnEmailAndName(apiKey, channelId);
    sendResponseModule(res, result);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}
