import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

import dotenv from "dotenv";

import logger from "../winston/winston.js";

import storagePool from "../db/mk_storage/index.js";

import "../loadEnv.js"

const apiKey = process.env.GOOGLE_API_KEY;

async function loadCookies(page) {
  const cookies = JSON.parse(
    fs.readFileSync(
      "/Users/nazarkuratnikov/Desktop/MarkComb/Markcomb/src/backend/parsers/cookies.json",
      "utf8"
    )
  );
  await page.setCookie(...cookies);
}

async function getChannelId(videoTheme) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        videoTheme
      )}&type=channel&key=${apiKey}`
    );
    const result = await response.json();

    if (!result.items || result.items.length === 0) {
      return [];
    }

    return result.items.map((item) => item?.id?.channelId).filter(Boolean);
  } catch (error) {
    logger.error("Возникла ошибка в getChannelID : ", error);
    return [];
  }
}

async function getVideoIds(channelIds) {
  try {
    let videoIDs = [];
    for (let channelId of channelIds) {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=5&type=video&key=${apiKey}`
      );
      const result = await response.json();

      if (result.items) {
        const ids = result.items
          .map((item) => item?.id?.videoId)
          .filter(Boolean);
        videoIDs.push(...ids);
      }
    }

    return videoIDs;
  } catch (error) {
    logger.error("Возникла ошибка в getVideoIds : ", error);
    return [];
  }
}

async function getYouTubeKeywords(videoId) {
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  const browser = await puppeteer.launch({
    headless: true, // Запуск без UI
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await loadCookies(page); // Загружаем cookies (авторизация)

  await page.goto(url, { waitUntil: "domcontentloaded" });

  const keywords = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="keywords"]');
    return meta ? meta.content.split(", ") : [];
  });

  await browser.close();
  return { videoId, keywords };
}

async function saveKeywords(category, tags, age_group) {
  const forbiddenTags = [
    "бесплатно",
    "телефон с камерой",
    "поделиться",
    "телефон с видео",
    "загрузить",
    "видео",
    "поделиться",
  ];
  try {
    for (const tag of tags) {

      console.log("Полученные тэги : ", tag)

      if (forbiddenTags.includes(tag)) continue;

      await storagePool.query(
        `INSERT INTO tags (tag,content_type,age_group) VALUES ($1,$2,$3) RETURNING *`,
        [tag, category, age_group]
      );
    }
    return {status : "success" , message : "Tags was written to db"}
  } catch (error) { 
    logger.error("Возникла ошибка в saveKeywords : ", error);
    return {status : "failure" , cause : error}
  }
}

async function tagsReceiptAutomation(videoTheme, category, age_group) {
  const channelId = await getChannelId(videoTheme);

  if (!channelId) {
    return {status : "failure" , cause : "fail in getChannelId"}
  }

  const videoIds = await getVideoIds(channelId);
  if (!videoIds) {
    return {status : "failure" , cause : "fail in getVideoIds"}
  }

  for (const videoId of videoIds) {
    console.log(
      `Происходит парсинг видео : ${videoId} для категории : ${category}`
    );
    const tags = await getYouTubeKeywords(videoId);

    const saveKeywordsResult = await saveKeywords(category, tags.keywords, age_group);
    return saveKeywordsResult;
  }
}

const runTagsParser = async (tagsTheme,categoryToWrite,age_group) => {
  console.log(
    `Тема видео : ${tagsTheme} , категория : ${categoryToWrite} , возрастная категория : ${age_group}`
  );

  return await tagsReceiptAutomation(tagsTheme, categoryToWrite, age_group);
};

export default runTagsParser;