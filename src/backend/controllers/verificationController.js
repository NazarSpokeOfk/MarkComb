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

    const result = await sendVerification(value, action, email, userId);
    sendResponseModule(res, result);
  } catch (error) {
    console.log(error);
    sendResponseModule(res, null, error);
  }
}

export async function VerifyValue(value,action) {
  try {
    const result = await verifyValue(value, action);
    return result
  } 
  catch (error) {
    console.log(error)
    return error
  }
}

