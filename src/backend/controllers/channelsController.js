import storagePool from "../db/storageIndex";

class ChannelsController {
    async selectChannel(req, res) {
        const { audience, subscribers, content_type } = req.body;
        let query = 'SELECT * FROM channels WHERE 1=1';  // Начинаем с базового запроса
        let params = [];

        
        if (audience) {
            query += ' AND audience = $1';
            params.push(audience);
        }

        if (subscribers) {
            query += ' AND subs_count >= $' + (params.length + 1); 
            params.push(subscribers);
        }

        if (content_type) {
            query += ' AND content_type = $' + (params.length + 1);  
            params.push(content_type);
        }


        query += ' ORDER BY RANDOM() LIMIT 1';

        try {
            const request = await storagePool.query(query, params);
            const result = request.rows[0]

            const channelStats = await this.fetchChannelData(result.channelID,result.content_type,result.age_group)

            console.log(channelStats) 

            res.json({status : true , channelStats})
        } catch (error) {
            console.log("Возникла ошибка в selectChannel:", error);
            res.status(500).json({ error: 'Ошибка при выполнении запроса' });  
        }
    }


    async fetchChannelData(channelId, contentType, audience) {
        console.log("channelID : " ,channelId)
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
          );
          const result = await response.json();
          console.log("результат : ",result)
          if (result) {
            const channelData = {
              title: result?.items?.[0]?.snippet?.title,
              subs: result?.items?.[0]?.statistics?.subscriberCount,
              contenttype: contentType,
              targetAudience: audience,
              thumbnail : result?.items?.[0]?.snippet?.thumbnails?.medium?.url,
              channelId : channelId
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
export default ChannelsController