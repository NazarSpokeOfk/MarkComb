import sendResponseModule from "../modules/sendResponseModule.js";
import returnCsrftokenModule from "../modules/returnCsrftokenModule.js";
import returnCookieModule from "../modules/returnCookieModule.js";

import {
  logIn,
  getUserByUserId,
  signIn,
  changeUserName,
  addUses,
  activatePromocode,
} from "../services/user.service.js";

export async function LogIn(req, res) {
  try {
    const { email, password } = req.body;
    const result = await logIn(email, password);
    req.session.csrfToken = result.meta.csrfToken;
    returnCsrftokenModule(result.meta.csrfToken, res);
    returnCookieModule(result.meta.token, res);
    sendResponseModule(res, result.data);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}
export async function GetUserById(req, res) {
  try {
    const user_id = req.params.id;
    const result = await getUserByUserId(user_id);
    sendResponseModule(res, result);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}

export async function SignIn(req, res) {
  try {
    const { email, password, username, verification_code, recaptchaValue } =
      req.body.data;
    
    const result = await signIn(
      email,
      password,
      username,
      verification_code,
      recaptchaValue,
      req
    );

    req.session.csrfToken = result.meta.csrfToken;
    returnCsrftokenModule(result.meta.csrfToken, res);
    returnCookieModule(result.meta.token, res);
    sendResponseModule(res, result.data);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}

export async function ChangeUserName(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { newValue, changeMethod } = req.body;
    const result = await changeUserName(newValue, changeMethod, id);
    sendResponseModule(res, result);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}

export async function AddUses(req, res) {
  try {
    const { id } = req.params;
    const { password, uses } = req.body;
    const result = await addUses(id, password, uses);
    sendResponseModule(res, result);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}

export async function ActivatePromocode(req, res) {
  try {
    const { promocode, email } = req.body;
    const result = await activatePromocode(promocode, email);
    sendResponseModule(res, result);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}
