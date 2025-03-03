import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

import dotenv from "dotenv";

import storagePool from "../db/storageIndex.js";

dotenv.config({ path: path.resolve(process.cwd(), "../environment/.env") });

const apiKey = process.env.GOOGLE_API_KEY;

async function loadCookies(page) {
  const cookies = JSON.parse(
    fs.readFileSync(
      "/Users/nazarkuratnikov/Desktop/Project X /markcomb/src/backend/parsers/cookies.json",
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

    console.log("Результат getChannelId : ", result);

    if (!result.items || result.items.length === 0) {
      console.log("Не найдено каналов по теме:", videoTheme);
      return [];
    }

    return result.items.map((item) => item?.id?.channelId).filter(Boolean);
  } catch (error) {
    console.error("Возникла ошибка в getChannelID : ", error);
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
    console.log("Результат getVideoIds : ", videoIDs);
    return videoIDs;
  } catch (error) {
    console.error("Возникла ошибка в getVideoIds : ", error);
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
  console.log("ТЭГИ : ", tags);
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
      if (forbiddenTags.includes(tag)) continue;

      await storagePool.query(
        `INSERT INTO tags (tag,content_type,age_group) VALUES ($1,$2,$3)`,
        [tag, category, age_group]
      );
      console.log(`Данные для ${tag} , были записаны`);
    }
  } catch (error) {
    console.error("Возникла ошибка в saveKeywords : ", error);
  }
}

async function tagsReceiptAutomation(videoTheme, category, age_group) {
  const channelId = await getChannelId(videoTheme);

  if (!channelId) {
    console.log("Канал не найден.");
    return;
  }

  console.log(`✅ Channel ID: ${channelId}`);

  const videoIds = await getVideoIds(channelId);
  if (!videoIds) {
    console.log("VideoID не найдены.");
    return;
  }

  for (const videoId of videoIds) {
    console.log(
      `Происходит парсинг видео : ${videoId} для категории : ${category}`
    );
    const tags = await getYouTubeKeywords(videoId);

    saveKeywords(category, tags.keywords, age_group);
    console.log(`Данные для ${videoId} сохранены.\n`);
  }
}

(async () => {
  const videoTheme = process.argv[2];
  const category = process.argv[3];
  const age_group = process.argv[4];
  console.log("Аге гроуп", age_group);

  console.log(
    `Тема видео : ${videoTheme} , категория : ${category} , возрастная категория : ${age_group}`
  );

  await tagsReceiptAutomation(videoTheme, category, age_group).then(() => {
    process.exit(0);
  });
})();
