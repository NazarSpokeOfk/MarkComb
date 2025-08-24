import MailVerificationModule from "../../modules/mailVerificationModule.js";
const verifController = async (req, res) => {
  
  const mailVerificationModule = new MailVerificationModule();
  const { email,operationCode } = req.body;
  

  console.log("Почта в verifController : " , email)

  try {
    const result = await mailVerificationModule.sendVerificationCode(email,operationCode);
    if (result) {
      res.status(200).json({ message: "Verification code sent successfully" });
    } else {
      res.status(300).json({ message: "Failed to send verification code" });
    } 
  } catch (error) {
    console.log("Вай бля ошибка :",error)
    if(error === "exists"){
      console.log("Ошбика для",error)
      res.status(400).json({message : "exists"})
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

export default verifController;