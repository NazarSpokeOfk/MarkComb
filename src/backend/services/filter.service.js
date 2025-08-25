import storagePool from "../../db/mk_storage/index.js";
import logger from "../../winston/winston.js";

export const selectChannel = async (
  ageGroup,
  minSubs,
  maxSubs,
  content_type
) => {
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

    return updatedData;
  } catch (error) {
    logger.error(" (selectChannel) Возникла ошибка в selectChannel:", error);
    throw new Error(error)
  }
};

export const fetchChannelData = async (
  channelId,
  content_type,
  audience,
  apiKey
) => {
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
      return false; //замена
    }
  } catch (error) {
    logger.error(error)
    throw new Error(error)
  }
};

export const returnEmailAndName = async (apiKey, channelId) => {
  let emailRequest;
  try {
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
    return { name, email };
  } catch (error) {
    logger.error(error)
    throw new Error(error)
  }
};
