import dotenv from "dotenv";
import Yookassa from "yookassa";

import mainPool from "../db/mk/index.js";

import logger from "../winston/winston.js";

import "../loadEnv.js"

const shopId = process.env.SHOP_ID;
const YMoneyAPIKEY = process.env.YMoney_API_KEY;

const yookassa = new Yookassa({
  shopId: shopId,
  secretKey: YMoneyAPIKEY,
});

const createPayment = async (req, res) => {
  const { packageId, user_id, userEmail } = req.body;

  console.log(packageId)

  let result;
  try {
    const request = await mainPool.query(
      "SELECT title,price,uses FROM packages WHERE package_id = $1",
      [packageId]
    );

    result = await request.rows[0];
  } catch (error) {
    logger.error("Возникла ошибка при получении данных пакета", error);
  }

  if (!result) {
    return res.status(400).json({ message: "invalid package_id" });
  }

  const { title, price, uses } = result;

  try {
    const payment = await yookassa.createPayment({
      amount: {
        value: price.toFixed(2),
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: "🤫",
      },
      capture: true,
      description: `Пакет ${title}, кол-во использований : ${uses}`,
      metadata : {
        user_id : user_id,
        packageId : packageId
      },receipt: {
        customer: {
          email: userEmail,
        },
        items: [
          {
            description: `Пакет: ${title}`,
            quantity: 1,
            amount: {
              value: Number(price.toFixed(2)),
              currency: "RUB",
            },
            vat_code: 4, 
            payment_mode: "full_prepayment",
            payment_subject: "service",
          },
        ],
      }
    });
    res.json({ confirmationURL: payment.confirmation.confirmation_url });
  } catch (error) {
    logger.error("Возникла ошибка при создании платежа : ", error);
    res.status(500).json({message : "Payment creation failure."})
  }
};

export default createPayment;
