import sendResponseModule from "../modules/sendResponseModule.js";
import { handleSearch } from "../services/search.service.js";

export async function HandleSearch(req, res) {
  try {
    const { mainInputValue } = req.body;
    const result = await handleSearch(mainInputValue);
    sendResponseModule(res, result);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}


