import storagePool from "../../db/mk_storage/index.js";
import logger from "../../winston/winston.js";

import "../../loadEnv.js";
const apiKey = process.env.GOOGLE_API_KEY;

class ChannelsController {
  async selectChannel(req, res) {
    console.log(req.body);

    const { ageGroup, minSubs, maxSubs, content_type } = req.body;

    let query = "SELECT * FROM channels WHERE 1=1";
    let params = [];
    let index = 1; // Переменная для нумерации параметров ($1, $2, $3)

    if (ageGroup) {
      query += ` AND age_group = $${index}`;
      params.push(ageGroup);
      index++;
    }

    if (minSubs || maxSubs) {
      query += ` AND subs_count BETWEEN $${index} AND $${index + 1}`;
      params.push(minSubs, maxSubs);
      index += 2;
    }

    if (content_type) {
      query += ` AND content_type = $${index}`;
      params.push(content_type);
      index++;
    }

    query += " ORDER BY RANDOM() LIMIT 1";

    try {
      const request = await storagePool.query(query, params);
      console.log("реквест", request);
      const result = request.rows[0];

      console.log("результ в контроллере:", result);
      if (!result) {
        res.json({ status: false });
        return;
      }

      const updatedData = await this.fetchChannelData(
        result.channelid,
        result.content_type,
        result.age_group
      );

      res.status(200).json({ status: true, updatedData });
    } catch (error) {
      logger.error(" (selectChannel) Возникла ошибка в selectChannel:", error);
      res.status(500).json({ error: "Ошибка при выполнении запроса" });
    }
  }

  async fetchChannelData(channelId, content_type, audience) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
      );
      const result = await response.json();
      if (result) {
        const updatedData = {
          subsCount: result?.items?.[0]?.statistics?.subscriberCount,
          content_type: content_type,
          targetAudience: audience,
          thumbnail: result?.items?.[0]?.snippet?.thumbnails?.medium?.url,
          channelId: channelId,
        };
        return updatedData;
      } else {
        return false;
      }
    } catch (error) {
      logger.error("Возникла ошибка в fetchChannelData : ", error);
    }
  }

  async returnEmailAndName(req, res) {
    const { channelId } = req.body;

    let emailRequest;
    try {
      console.log("Pool : ", storagePool.options.database);
      emailRequest = await storagePool.query(
        `SELECT email FROM channels WHERE channelid = $1`,
        [channelId]
      );
    } catch (error) {
      console.log("Возникла ошибка в запросе к бд:", error);
    }

    console.log(emailRequest.rows);

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
export default ChannelsController;
