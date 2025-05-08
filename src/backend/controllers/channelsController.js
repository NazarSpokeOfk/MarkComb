import storagePool from "../db/storageIndex.js";
import path from "path";
import dotenv from "dotenv";
import logger from "../winston/winston.js"

dotenv.config({ path: path.resolve(process.cwd(), "./environment/.env") });

const apiKey = process.env.GOOGLE_API_KEY;

class ChannelsController {
  async selectChannel(req, res) {

    console.log(req.body)
    
    const { age_group, minsubs, maxsubs, content_type } = req.body;

    
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
      
      const request = await storagePool.query(query, params);
      console.log("реквест",request)
      const result = request.rows[0];

      
      console.log("результ в контроллере:",result)
      if(!result){
        res.json({status : false})
        return;
      }

      const channelStats = await this.fetchChannelData(
        result.channelid,
        result.content_type,
        result.age_group
      );

      res.json({ status: true, channelStats });
    } catch (error) {
      logger.error(" (selectChannel) Возникла ошибка в selectChannel:", error);
      res.status(500).json({ error: "Ошибка при выполнении запроса" });
    }
  }

  async fetchChannelData(channelId, contentType, audience) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
      );
      const result = await response.json();
      if (result) {
        const channelData = {
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
      logger.error("Возникла ошибка в fetchChannelData : ", error);
    }
  }
}
export default ChannelsController;
