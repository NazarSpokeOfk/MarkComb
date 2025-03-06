import MailVerification from "../mailVerification.js";

const verifController = async (req, res) => {
  console.log(req.body)
  const mailVerif = new MailVerification();
  const { email } = req.body;
  console.log("Почта:",email)

  try {
    const result = await mailVerif.sendVerificationCode(email);
    if (result) {
      res.status(200).json({ message: "Verification code sent successfully" });
    } else {
      res.status(500).json({ message: "Failed to send verification code" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default verifController;