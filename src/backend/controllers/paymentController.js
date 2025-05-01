import pool from "../db/index";
import crypto from "crypto";

const usesPackages = {
  light: { rub: 500, uses: 10 },
  medium: { rub: 1500, uses: 50 },
  big: { rub: 2500, uses: 75 },
  business: { rub: 4500, uses: "5/day" },
};

class PaymentController {
  async handleCallBack(req, res) {
    const { OutSum, InvId, SignatureValue, Shp_package, Shp_userid } = req.body;

    const package = usesPackages[Shp_package];

    if (!package || parseFloat(OutSum) !== package.rub) {
      return res.status(400).json({ message: "Invalid package or amount" });
    }

    const mySignature = crypto
      .createHash("md5")
      .update(
        `${OutSum}:${InvId}:${process.env.PAYMENT_FIRST_PASSWORD}:Shp_package=${Shp_package}:Shp_userid=${Shp_userid}`
      )      
      .digest("hex")
      .toUpperCase();
    if (mySignature !== SignatureValue.toUpperCase()) {
      return res.status(403).json({ message: "Signature mismatch" });
    }

    try {
      const user = await pool.query(
        "UPDATE users SET use = uses + $1 WHERE user_id = $2 RETURNING *",
        [package.uses, Shp_userid]
      );
      if (user.rows.length === 0) {
        return res.status(500).json({ message: "Error during adding uses." });
      } else {
        return res.status(200).json({message : "Successfull purchase."})
      }
    } catch (error) {
      console.log("Возникла ошибка в пополнении баланса пользователя :", error);
    }
  }

  async createLink (req,res) {
    const {package : packageName , user_id} = req.query;

    const package = usesPackages[packageName];
    if(!package) {
      return res.status(400).json({message : "invalid package"})
    }


    const OutSum = package.rub;
    const InvId = user_id;
    const Shp_package = packageName;
    const Shp_userid = user_id;


    const SignatureValue = crypto
    .createHash('md5')
    .update(
      `${OutSum}:${InvId}:${process.env.PAYMENT_FIRST_PASSWORD}:Shp_package=${Shp_package}`
    )
    .digest('hex')
    .toUpperCase();


    const paymentUrl = `https://auth.robokassa.ru/Merchant/Index.aspx?MrchLogin=${process.env.MERCHANT_LOGIN}&OutSum=${OutSum}&InvId=${InvId}&SignatureValue=${SignatureValue}&Shp_package=${Shp_package}&Shp_userid=${Shp_userid}&Encoding=UTF-8`;


    return res.json({paymentUrl})
  }
}
export default PaymentController;
