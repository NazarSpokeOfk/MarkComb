import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });


const apiKey = process.env.GOOGLE_API_KEY;

const getChannelByTag = async (tags) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        tags
      )}&type=video&maxResults=10&key=${apiKey}`
    );
    const result = await response.json()
    const channelIds = result.items.map((item)=>item.snippet.channelId);
    console.log("channelIds : " , channelIds)
    return [...new Set(channelIds)]
  } catch (error) {
    console.log("Произошла ошибка в getChannelByTag : ", error);
  }
};
export default getChannelByTag;
