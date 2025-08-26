import { authThroughGoogle } from "../services/googleAuth.service.js";
import sendResponseModule from "../modules/sendResponseModule.js";
import returnCsrftokenModule from "../modules/returnCsrftokenModule.js";
import returnCookieModule from "../modules/returnCookieModule.js";

async function AuthThroughGoogle(req, res) {
  try {
    const { credential } = req.body;
    const result = await authThroughGoogle(credential);
    req.session.csrfToken = result.meta.csrfToken;
    returnCsrftokenModule(result.meta.csrfToken, res);
    returnCookieModule(result.meta.token, res);

    sendResponseModule(res, result.data);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}

export default AuthThroughGoogle;
