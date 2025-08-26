import { authThroughGoogle } from "../services/googleAuth.service.js";
import sendResponseModule from "../modules/sendResponseModule.js";

async function AuthThroughGoogle(req, res) {
  try {
    const { credential } = req.body;
    const result = await authThroughGoogle(credential);
    sendResponseModule(res, result);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}

export default AuthThroughGoogle;
