import { sendVerification , verifyValue } from "../services/verification.service.js";
import sendResponseModule from "../modules/sendResponseModule.js";
import { randomUUID } from "crypto";

export async function SendVerification(req, res) {
  const { email , userId } = req.body;

  const { action } = req.params;
  try {
    let value;

    if (action === "signIn") {
      value = Math.floor(100000 + Math.random() * 900000).toString();
    } else {
      value = randomUUID();
    }

    console.log("Пропсы в контроллере : " , email, value, action)

    const result = await sendVerification(value, action, email, userId);
    sendResponseModule(res, result);
  } catch (error) {
    console.log(error);
    sendResponseModule(res, null, error);
  }
}

export async function VerifyValue(email,value,action,user_id) {
  try {
    const result = await verifyValue(email, value, action, user_id);
    return result
  } 
  catch (error) {
    console.log(error)
    return error
  }
}

