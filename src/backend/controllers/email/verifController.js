import MailVerification from "../../Email/mailVerification.js";

const verifController = async (req, res) => {
  
  const mailVerif = new MailVerification();
  const { email,operationCode } = req.body;
  

  console.log("Почта в verifController : " , email)

  try {
    const result = await mailVerif.sendVerificationCode(email,operationCode);
    if (result) {
      res.status(200).json({ message: "Verification code sent successfully" });
    } else {
      res.status(300).json({ message: "Failed to send verification code" });
    }
  } catch (error) {
    console.log("Вай бля ошибка :",error)
    if(error === "exists"){
      res.status(400).json({message : "Account exists"})
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

export default verifController;