import pool from "../db/index.js";
import logger from "../winston/winston.js";

import ipaddr from "ipaddr.js";
import dayjs from "dayjs";

const handleWebHook = async (req, res) => {
  console.log("рек хеадер :", req.headers["x-forwarded-for"]);

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  console.log("АЙПИ :", ip);

  const isTrustedIp = (ip) => {
    const ranges = [
      "185.71.76.0/27",
      "185.71.77.0/27",
      "77.75.153.0/25",
      "77.75.156.11",
      "77.75.156.35",
      "77.75.154.128/25",
      "2a02:5180::/32",
    ];

    try {
      const parsedIP = ipaddr.parse(ip);

      return ranges.some((range) => {
        const [rangeAddr, prefix] = range.split("/");
        const parsedRange = ipaddr.parse(rangeAddr);

        return parsedIP.match(parsedRange, parseInt(prefix));
      });
    } catch (error) {
      logger.error("Ошибка распознавания ip :", error);
      return false;
    }
  };

  if (!isTrustedIp(ip)) {
    logger.error(`🚨 Попытка вызова webhook с НЕдоверенного IP: ${ip}`);
    return res.status(403).json({ message: "Forbidden" });
  }

  const { user_id, packageId } = req.body.object.metadata;

  const event = req.body;

  if (event.event === "payment.succeeded") {
    const payment = event.object;

    const value = payment.amount.value;

    try {
      const selectPackage = await pool.query(
        "SELECT price,uses FROM packages WHERE package_id = $1",
        [packageId]
      );

      const result = await selectPackage.rows[0];

      if (parseFloat(value) !== parseFloat(result.price)) {
        return res.status(400).end();
      }

      const { uses } = result;

      if (packageId === 4) {
        const endingDate = dayjs().add(1, "month").toISOString();

        try {
          const addingUses = await pool.query(
            "UPDATE users SET uses = uses + 5 WHERE user_id = $1 RETURNING *",
            [user_id]
          );

          const redeemingSubscription = await pool.query(
            "UPDATE users SET subscription_expiration = $1 WHERE user_id = $2 RETURNING *",
            [endingDate, user_id]
          );

          if (addingUses.rowCount > 0 && redeemingSubscription.rowCount > 0) {
            return res
              .status(200)
              .json({ message: "Подписка активирована", status: true });
          } else {
            return res
              .status(500)
              .json({
                message: "Подписка не была активирована",
                status: false,
              });
          }
        } catch (error) {
          logger.error("Возникла ошибка при начислении подписки:", error);
          return res
            .status(500)
            .json({ message: "Ошибка сервера", status: false });
        }
      }

      const addingUses = await pool.query(
        "UPDATE users SET uses = uses + $1 WHERE user_id = $2 RETURNING *",
        [uses, user_id]
      );

      if (addingUses.rowCount > 0) {
        return res.status(200).json({ message: "Успешная покупка." });
      } else {
        return res.status(500).json({ message: "ошибка сервера." });
      }
    } catch (error) {
      logger.error("Возникла ошибка при проверке покупки :", error);
      return res.status(500).end();
    }
  }
  return res.status(200).end();
};
export default handleWebHook;
