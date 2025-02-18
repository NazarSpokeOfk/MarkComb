import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import rl from "./readlineHelper.js";


import dotenv from "dotenv";

import getChannelByTag from "./channelsParser.js"

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const apiKey = process.env.GOOGLE_API_KEY;

const TEENS_RESULTS_FILE = "../channelsStorage/teenagersStorage.json";
const KIDS_RESULTS_FILE = "../channelsStorage/kidsStorage.json";
const ADULTS_RESULTS_FILE = "../channelsStorage/adultsStorage.json";
const OLDER_RESULTS_FILE = "../channelsStorage/olderGenStorage.json";

async function loadCookies(page) {
  const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"));
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
    console.log("Возникла ошибка в getChannelID : ", error);
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
    console.log("Возникла ошибка в getVideoIds : ", error);
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

async function saveKeywords(fileName, category, data) {
  let storage = {};

  if (fs.existsSync(fileName)) {
    storage = JSON.parse(fs.readFileSync(fileName, "utf8"));
  }

  if (!storage[category]) {
    storage[category] = {};
  }

  const existingTags = new Set(storage[category].tags);
  data.keywords.forEach((tag) => {
    existingTags.add(tag);
  });

  storage[category].tags = Array.from(existingTags);

  fs.writeFileSync(fileName, JSON.stringify(storage, null, 2));
}


const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      console.log(`Введено: ${answer}`); 
      resolve(answer);
    });
  });
};

const askQuestionWithChoises = (question, choises) => {
  return new Promise((resolve, reject) => {
    const choisesString = choises
      .map((choice, index) => `${index + 1}.${choice}`)
      .join("\n");

    rl.question(`${question}\n${choisesString}\nВыберите номер:`, (answer) => {
      const choiceIndex = parseInt(answer, 10) - 1;
      if (choiceIndex >= 0 && choiceIndex < choises.length) {
        resolve(choises[choiceIndex]);
      } else {
        reject("Некорректный номер");
      }
    });
  });
};

async function tagsReceiptAutomation(videoTheme, category, fileName) {
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
    const result = await getYouTubeKeywords(videoId);

    saveKeywords(fileName, category, result);
    console.log(`Данные для ${videoId} сохранены.\n`);
  }
}

const FILES_MAP = {
  KIDS_RESULTS_FILE: KIDS_RESULTS_FILE,
  TEENS_RESULTS_FILE: TEENS_RESULTS_FILE,
  ADULTS_RESULTS_FILE: ADULTS_RESULTS_FILE,
  OLDER_RESULTS_FILE: OLDER_RESULTS_FILE,
};

(async () => {
  const videoTheme = await askQuestion("Введите тему : ");
  const category = await askQuestion(
    "Введите категорию, в которую будут записаны тэги : "
  );
  let fileName = await askQuestionWithChoises(
    "Введите название файла, куда будут записаны тэги : ",
    [
      "KIDS_RESULTS_FILE",
      "TEENS_RESULTS_FILE",
      "ADULTS_RESULTS_FILE",
      "OLDER_RESULTS_FILE",
    ]
  );

  console.log(
    `Тема видео : ${videoTheme} , категория : ${category} , имя файла : ${fileName}`
  );

  if (FILES_MAP[fileName]) {
    fileName = FILES_MAP[fileName];
  } else {
    console.log(`Файла  ${fileName} не существует.`);
    return;
  }

  await tagsReceiptAutomation(videoTheme, category, fileName);

  await proccessChannelSearch(category, fileName);

  rl.close();

})();

async function proccessChannelSearch (category,filename) {
  const recordChannels = await askQuestion(
    `Начать запись каналов, исходя из имеющихся тэгов в категорию ${category} ? (Да/Нет) : `
  );

  if (recordChannels.toLowerCase() !== "да") {
    console.log("Работа завершена.");
    return;
  } else {
    try {
      const data = fs.readFileSync(filename, "utf8"); 
      const jsonData = await JSON.parse(data);

      const getRandomTags = (tags, count = 2) => {
        if (tags.length <= count) return tags; 
      
        const shuffled = [...tags].sort(() => Math.random() - 0.5); 
        return shuffled.slice(0, count); 
      };
      
      const tags = getRandomTags(jsonData[category].tags);      
  
      console.log("Полученные тэги : " , tags)
  
      const response = await getChannelByTag(tags)
  
      if(!jsonData[category]){
        jsonData[category] = { channels: [] };
      } 
  
      jsonData[category].channels.push(response)
      
      fs.writeFileSync(filename,JSON.stringify(jsonData,null,2))
  
      console.log(`Канал(-ы) был(-и) записан(-ы) в ${filename}`)
    } catch (error) {
      console.log("Возникла ошибка в записи каналов : " , error)
    }
  }
  }
    
