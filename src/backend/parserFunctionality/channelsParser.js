import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import storagePool from "../db/mk_storage/index.js";

import logger from "../winston/winston.js";
import getEmailModule from "../modules/getEmailModule.js";


import "../loadEnv.js";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.log("ало",process.env)
  throw new Error("API ключ Google не найден! Проверьте .env файл.");
}

const getChannelByTag = async (tags) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        tags
      )}&type=video&maxResults=20&key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    const channelIds = result.items.map((item) => item.snippet.channelId);
    return channelIds;
  } catch (error) {
    logger.error("Произошла ошибка в getChannelByTag : ", error);
  }
};

const getChannelSubscribersCount = async (channelId) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    if (result) {
      const subsCount = result?.items?.[0]?.statistics?.subscriberCount;
      return subsCount;
    } else {
      return null;
    }
  } catch (error) {
    logger.error("Возникла ошибка в getChannelSubscribersCount : ", error);
  }
};

const getTags = async (age_group, content_type) => {
  let tags;
  try {
    tags = (
      await storagePool.query(
        `SELECT tag FROM tags WHERE age_group = $1 AND content_type = $2 LIMIT 150`,
        [age_group, content_type]
      )
    ).rows.map((row) => row.tag);

    if (tags.length === 0) {
      return { error: "Не найдено тэгов по вашим критериям" };
    }
  } catch (error) {
    logger.error(" (getTags) Ошибка в получении тэгов из БД:", error);
    return { error: "Ошибка в получении тэгов" };
  }

  let pairs;
  try {
    pairs = (
      await storagePool.query(
        `SELECT pair FROM pairs WHERE content_type = $1 LIMIT 50`,
        [content_type]
      )
    ).rows.map((row) => row.pair);

    if (pairs.length === 0) {
      pairs = "Нет пар для такой аудитории и типа контента";
    }
  } catch (error) {
    logger.error(" (getTags) Ошибка при выборке пар:", error);
    return { error: "Ошибка при выборке пар" };
  }

  return { tags, pairs };
};

const getChannelsAndWriteIntoDB = async (tags, content_type, age_group) => {
  const channels = await getChannelByTag(tags);

  try {
    for (const channel of channels) {
      console.log("channelID:", channel);
    
      const channelSubsCount = await getChannelSubscribersCount(channel);
      const getdata = await getEmailModule(channel);
      const email = getdata.description[0];
    
      if (!email) continue;
    
      console.log("email:", email);
    
      await storagePool.query(
        `INSERT INTO channels (channelID, content_type, age_group, subs_count, email) 
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT (channelID) DO NOTHING`,
        [channel, content_type, age_group, channelSubsCount, email]
      );
    }
    return JSON.stringify({ message: "Каналы записаны в бд" });
  } catch (error) {}
};

const runParser = async (action, age_group, content_type, selectedTags) => {
  if (action === "tags") {
    const result = await getTags(age_group, content_type);
    return result;
  } else if (action === "channels") {
    await getChannelsAndWriteIntoDB(selectedTags, content_type, age_group);
    return { status: true };
  } else if (action != "tags" && "channels") {
    return { message: "Wrong action assigment" };
  }
};

export default runParser;
