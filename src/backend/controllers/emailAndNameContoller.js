import storagePool from "../db/storageIndex.js";
const apiKey = process.env.GOOGLE_API_KEY;

class EmailAndNameController {
  async returnEmailAndName(req, res) {
    const { channelId } = req.body;
    
    let emailRequest
    try {
        emailRequest = await storagePool.query(
        `SELECT email FROM channels WHERE channelid = $1`,
        [channelId]
      );
    } catch (error) {
      console.log("Возникла ошибка в запросе к бд:", error);
    }

    let email = emailRequest.rows?.[0]?.email;

    if (!email) {
      try {
        const request = await fetch(`${process.env.API_URL}/getdata`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ channelId }),
        });
        const response = await request.json();

        email = response?.description?.[0];

        console.log("Ответ дешевый:", response, "И почта с ним :", email);
      } catch (error) {
        console.log("Возникла ошибка в альтернативном получении почты:", error);
      }
    }

    const descrUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;

    try {
      const response = await fetch(descrUrl);
      const processedResponse = await response.json();
      const name = await processedResponse?.items?.[0].snippet.title;
      res.status(200).json({ name, email });
    } catch (error) {
      console.log("Ошибка в returnEmailAndName:", error);
      res.status(500).json({ message: "purchase data error" });
    }
  }
}
export default EmailAndNameController;
