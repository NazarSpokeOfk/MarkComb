import storagePool from "../db/storageIndex.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), "./environment/.env") });

const apiKey = process.env.GOOGLE_API_KEY;

class ChannelsController {
  async selectChannel(req, res) {
    const { age_group, minsubs, maxsubs, content_type } = req.body;
    console.log(
      "Данные полученные в selectChannel : ",
      age_group,
      minsubs,
      maxsubs,
      content_type
    );
    let query = "SELECT * FROM channels WHERE 1=1";
    let params = [];
    let index = 1; // Переменная для нумерации параметров ($1, $2, $3)

    if (age_group) {
      query += ` AND age_group = $${index}`;
      params.push(age_group);
      index++;
    }

    if (minsubs || maxsubs) {
      query += ` AND subs_count BETWEEN $${index} AND $${index + 1}`;
      params.push(minsubs, maxsubs);
      index += 2;
    }
    
    if (content_type) {
      query += ` AND content_type = $${index}`;
      params.push(content_type);
      index++;
    }

    query += " ORDER BY RANDOM() LIMIT 1";

    try {
      console.log("Квери с параметрами :" ,query,params)
      const request = await storagePool.query(query, params);
      const result = request.rows[0];

      console.log("результат с бд cc : ", result);

      if(!result){
        res.json({status : false})
        return;
      }

      const channelStats = await this.fetchChannelData(
        result.channelid,
        result.content_type,
        result.age_group
      );

      console.log(channelStats);

      res.json({ status: true, channelStats });
    } catch (error) {
      console.log("Возникла ошибка в selectChannel:", error);
      res.status(500).json({ error: "Ошибка при выполнении запроса" });
    }
  }

  async fetchChannelData(channelId, contentType, audience) {
    console.log("channelID : ", channelId);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
      );
      const result = await response.json();
      if (result) {
        const channelData = {
          title: result?.items?.[0]?.snippet?.title,
          subs: result?.items?.[0]?.statistics?.subscriberCount,
          contenttype: contentType,
          targetAudience: audience,
          thumbnail: result?.items?.[0]?.snippet?.thumbnails?.medium?.url,
          channelId: channelId,
        };
        return channelData;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Возникла ошибка в fetchChannelData : ", error);
    }
  }
}
export default ChannelsController;
