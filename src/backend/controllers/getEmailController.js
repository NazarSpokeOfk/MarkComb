import sendResponseModule from "../modules/sendResponseModule";

import { getEmail } from "../services/getEmail.service.js";

export async function GetEmail(req, res) {
  try {
    const { channelId } = req.body;
    const result = await getEmail(channelId);
    sendResponseModule(res, result);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}
