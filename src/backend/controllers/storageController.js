import fs from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const TEENS_RESULTS_FILE = "./channelsStorage/teenagersStorage.json";
const KIDS_RESULTS_FILE = "./channelsStorage/kidsStorage.json";
const ADULTS_RESULTS_FILE = "./channelsStorage/adultsStorage.json";
const OLDER_RESULTS_FILE = "./channelsStorage/olderGenStorage.json";

const apiKey = process.env.GOOGLE_API_KEY;

class StorageController {
  storagesCase = {
    Kids: KIDS_RESULTS_FILE,
    Teenagers: TEENS_RESULTS_FILE,
    Adults: ADULTS_RESULTS_FILE,
    OlderGen: OLDER_RESULTS_FILE,
  };
  async getRandomChannelByAudience(req, res) {
    const { Audience } = req.body;
    console.log("Аудитория : ",Audience)
    let jsonData;
    if (fs.existsSync(this.storagesCase[Audience])) {
      const fileData = fs.readFileSync(this.storagesCase[Audience]);
      jsonData = fileData ? JSON.parse(fileData) : {};
    }

    if (jsonData) {
      const categories = Object.keys(jsonData);

      const randomCategoryIndex = Math.floor(Math.random() * categories.length);

      const randomCategory = categories[randomCategoryIndex];

      const targetAudience = jsonData[randomCategory].audience

      console.log("Рандомная категория : " , randomCategory)

      console.log("Целевая :" , targetAudience)

      const randomCategoryData = jsonData[randomCategory].channels; // данные категории

      const channels = randomCategoryData[0];

      console.log("Каналы : ",channels)

      if (Array.isArray(randomCategoryData) && randomCategoryData.length > 0) {
        const randomChannelIndex = Math.floor(Math.random() * channels.length);
        const randomChannel = channels[randomChannelIndex]
        console.log(randomChannel);
        const payload = await this.fetchChannelData(
          randomChannel,
          randomCategory,
          targetAudience
        );
        if (payload) {
          res.json({
            status: true,
            payload,
          });
        } else {
          res
            .status(500)
            .json({
              message: "Возникла ошибка сервера в getRandomChannelByAudience",
            });
        }
      } else {
        res.status(404).json({ message: "Нет каналов в выбранной категории." });
      }
    } else {
      res.status(404).json({ message: "Нет данных для выбранной аудитории." });
    }
  }

  async getRandomChannelByContentType(req, res) {
    const { ContentType } = req.params;
    console.log("Тип контента :", ContentType);
    const keys = Object.keys(this.storagesCase);

    const randomKeyIndex = Math.floor(Math.random() * keys.length);

    const randomKey = keys[randomKeyIndex];

    console.log("Индекс рандомного хранилища :", randomKeyIndex);

    const randomStorage = this.storagesCase[randomKey];

    let randomStorageData;

    if (fs.existsSync(randomStorage)) {
      const fileData = fs.readFileSync(randomStorage);
      randomStorageData = fileData ? JSON.parse(fileData) : {};
    }

    const channels = randomStorageData?.[ContentType]?.channels?.[0];

    if (channels) {
      const randomChannelIndex = Math.floor(Math.random() * channels.length);
      const randomChannel = channels[randomChannelIndex];
      const audience = randomStorageData?.[ContentType]?.audience;

      const payload = await this.fetchChannelData(
        randomChannel,
        ContentType,
        audience
      );

      res.json({ status: true, payload });
    } else {
      res.json({ status: false, message: "В этой категории нет каналов." });
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
export default StorageController;
