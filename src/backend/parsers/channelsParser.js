import dotenv from "dotenv";
import path from "path";
import rl from "./readlineHelper.js";
import { fileURLToPath } from "url";
import storagePool from "../db/storageIndex.js";

const __filename = fileURLToPath(import.meta.url);

dotenv.config({ path: path.resolve(process.cwd(), "../environment/.env") });

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("API ключ Google не найден! Проверьте .env файл.");
}

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
};

const askQuestionWithChoises = (question, choises) => {
  return new Promise((resolve, reject) => {
    if (!choises) {
      console.log("Список пар/тэгов пуст");
      return;
    }
    const choisesString = choises
      .map((choice, index) => `${index + 1}.${choice}`)
      .join("\n");

    rl.question(`${question}\n${choisesString}\nВыберите номер:`, (answer) => {
      if(!answer.trim()){
        reject("Вы не выбрали номер")
      }
      const choiceIndex = parseInt(answer, 10) - 1;
      if (choiceIndex >= 0 && choiceIndex < choises.length) {
        resolve(choises[choiceIndex]);
      } else {
        reject("Некорректный номер");
      }
    });
  });
};

const getChannelByTag = async (tags) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        tags
      )}&type=video&maxResults=10&key=${apiKey}`
    );
    if(!response.ok){
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    console.log("результат с getChannelByTag : ", result);
    const channelIds = result.items.map((item) => item.snippet.channelId);
    console.log("channelIds : ", channelIds);
    return channelIds;
  } catch (error) {
    console.log("Произошла ошибка в getChannelByTag : ", error);
  }
};

const getChannelSubscribersCount = async (channelId) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    );
    if(!response.ok){
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    if (result) {
      const subsCount = result?.items?.[0]?.statistics?.subscriberCount
      console.log("количество подписчиков :" ,subsCount)
      return subsCount;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Возникла ошибка в getChannelSubscribersCount : ", error);
  }
};

if (process.argv[1] === __filename) {
  (async () => {
    let age_group = await askQuestionWithChoises(
      "Введите возрастную категорию, откуда брать теги, и куда сохранять каналы : ",
      ["Kids.", "Teenagers.", "Adults.", "OlderGen."]
    );
    console.log("Выбор : ", age_group);
    const content_type = await askQuestion(
      "Введите название категории, откуда брать тэги : "
    );

    let tags;

    try {
      tags = (await storagePool.query(
        `SELECT tag FROM tags WHERE age_group = $1 AND content_type = $2 LIMIT 50`,
        [age_group, content_type]
      )).rows.map(row => row.tag)
      console.log("Тэги из бд : ", tags);
      if (tags.length === 0) {
        console.log("Не найдено тэгов по вашим критериям");
        process.exit(0)
      }
    } catch (error) {
      console.log("Ошибка в получении тэгов из бд : ", error);
    }

    const pairsOrManualChoice = await askQuestion(
      "Использовать ранее подготовленные пары для поиска каналов? (да/нет) : "
    );

    if (pairsOrManualChoice.toLowerCase() != "да") {
      tags = await askQuestion(
        "Выберите 2 тэга из этого списка. Пишите через запятую :"
      );
    } else {
      let pairs;
      try {
        pairs = (await storagePool.query(
          `SELECT pair FROM pairs WHERE content_type = $1 LIMIT 50`,
          [content_type]
        )).rows.map(row => row.pair);
        
      } catch (error) {
        console.log("Возникла ошибка при выборке пар : ", error);
      }
      tags = await askQuestionWithChoises(
        "Пары, по которым можно сделать поиск:",
        pairs
      );
    }

    const channels = await getChannelByTag(tags);

    try {
      for (const channel of channels) {
        console.log("id канала, который будет записан в бд :", channel);

        const channelSubsCount = await getChannelSubscribersCount(channel) || null;

        await storagePool.query(
          `INSERT INTO channels (channelID,content_type,age_group,subs_count) VALUES ($1,$2,$3,$4) ON CONFLICT (channelID) DO NOTHING`,
          [channel, content_type, age_group, channelSubsCount]
        );
      }
    } catch (error) {
      console.log("Возникла ошибка в записи каналов ! : ", error);
    }

    console.log("Канал(-ы) был(-и) записан(-ы) в бд");

    rl.close();
  })();
}

export default getChannelByTag;
