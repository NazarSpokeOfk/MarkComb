import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import rl from "./readlineHelper.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const TEENS_RESULTS_FILE = "../channelsStorage/teenagersStorage.json";
const KIDS_RESULTS_FILE = "../channelsStorage/kidsStorage.json";
const ADULTS_RESULTS_FILE = "../channelsStorage/adultsStorage.json";
const OLDER_RESULTS_FILE = "../channelsStorage/olderGenStorage.json";

const FILES_MAP = {
  KIDS_RESULTS_FILE: KIDS_RESULTS_FILE,
  TEENS_RESULTS_FILE: TEENS_RESULTS_FILE,
  ADULTS_RESULTS_FILE: ADULTS_RESULTS_FILE,
  OLDER_RESULTS_FILE: OLDER_RESULTS_FILE,
};

const apiKey = process.env.GOOGLE_API_KEY;

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
};

const askQuestionWithChoises = (question, choises) => {
  return new Promise((resolve, reject) => {
    console.log("выборы:",choises)
    if(!choises){
      console.log("Список пар/тэгов пуст")
      return;
    }
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

const getChannelByTag = async (tags) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        tags
      )}&type=video&maxResults=10&key=${apiKey}`
    );
    const result = await response.json();
    const channelIds = result.items.map((item) => item.snippet.channelId);
    console.log("channelIds : ", channelIds);
    return [...new Set(channelIds)];
  } catch (error) {
    console.log("Произошла ошибка в getChannelByTag : ", error);
  }
};

if (process.argv[1] === __filename) {
  (async () => {
    let fileName = await askQuestionWithChoises(
      "Введите название файла, откуда брать теги, и куда сохранять каналы : ",
      [
        "KIDS_RESULTS_FILE",
        "TEENS_RESULTS_FILE",
        "ADULTS_RESULTS_FILE",
        "OLDER_RESULTS_FILE",
      ]
    );
    console.log("Выбор : ", fileName);
    const category = await askQuestion(
      "Введите название категории, откуда брать тэги : "
    );

    if (!FILES_MAP[fileName]) {
      console.log("Файл с таким названием не найден.");
      return;
    }

    fileName = FILES_MAP[fileName];

    const data = fs.readFileSync(fileName, "utf8");

    const jsonData = await JSON.parse(data);

    const rawPairs = jsonData[category].pairs;

    if (!jsonData[category]) {
      console.log("Введенной вами категории не существует.");
      return;
    }

    console.log("Список полученных тэгов: ", jsonData[category].tags);

    const pairsOrManualChoice = await askQuestion(
      "Использовать ранее подготовленные пары для поиска каналов? (да/нет) : "
    );

    let tags;

    if (pairsOrManualChoice.toLowerCase() != "да") {
      tags = await askQuestion(
        "Выберите 2 тэга из этого списка. Пишите через запятую :"
      );
    } else {
      tags = await askQuestionWithChoises(
        "Пары, по которым можно сделать поиск:",
        rawPairs
      );
    }

    const tagList = tags.split(",").map((tag) => tag.trim());

    const response = await getChannelByTag(tagList);

    jsonData[category].channels.push(
      ...(Array.isArray(response) ? response : [response])
    );

    jsonData[category].channels = jsonData[category].channels.flat();

    fs.writeFileSync(fileName, JSON.stringify(jsonData, null, 2));

    console.log(`Канал(-ы) был(-и) записан(-ы) в ${fileName}`);

    rl.close();
  })();
}

export default getChannelByTag;
