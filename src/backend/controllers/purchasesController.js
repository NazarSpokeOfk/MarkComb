import sendResponseModule from "../modules/sendResponseModule.js";
import {
  getPurchases,
  addPurchase,
  deletePurchase,
} from "../services/purchases.service.js";

export async function GetPurchases(req, res) {
  try {
    const id = req.params.id;
    const result = await getPurchases(id);
    sendResponseModule(res, result, result);
  } catch (error) {
    sendResponseModule(res, null, error);
  }
}

export async function AddPurchase(req, res) {
  try {
    const { id } = req.params;
    const { thumbnail, email, channelName } = req.body;

    const tokenFromClient = req.cookies.csrfToken;
    const tokenFromSession = req.session.csrfToken;

    const result = await addPurchase(
      id,
      thumbnail,
      email,
      channelName,
      tokenFromClient,
      tokenFromSession
    );
    sendResponseModule(res, result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.log(error)
    sendResponseModule(res, null, error, statusCode);
  }
}

export async function DeletePurchase(req, res) {
  try {
    const { channelName } = req.body;
    const id = req.params.id;
    const tokenFromClient = req.cookies.csrfToken;
    const tokenFromSession = req.session.csrfToken;

    const result = await deletePurchase(
      channelName,
      tokenFromClient,
      tokenFromSession,
      id
    );
    sendResponseModule(res, result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    sendResponseModule(res, null, error, statusCode);
  }
}
