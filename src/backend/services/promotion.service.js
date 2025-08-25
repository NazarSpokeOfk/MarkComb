import logger from "../../winston/winston.js";
import "../loadEnv.js"

apiKey = process.env.GOOGLE_API_KEY;

export const getAnalitics = async (videoId) => {
    const urlForAnalitics = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${apiKey}`;
    try {
      const rawData = await fetch(urlForAnalitics);
  
      const data = await rawData.json();
      const analitics = {
        views: data?.items?.[0]?.statistics?.viewCount,
        likes: data?.items?.[0]?.statistics?.likeCount,
      };
  
      return analitics;
    } catch (error) {
      logger.error(" (getAnalitics) Возникла ошибка:", error);
      throw new Error("Error during getting analitics");
    }
  };
