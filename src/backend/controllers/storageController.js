import fs from "fs";

const TEENS_RESULTS_FILE = "../channelsStorage/teenagersStorage.json";
const KIDS_RESULTS_FILE = "../channelsStorage/kidsStorage.json";
const ADULTS_RESULTS_FILE = "../channelsStorage/adultsStorage.json";
const OLDER_RESULTS_FILE = "../channelsStorage/olderGenStorage.json";

class StorageController {
  storagesCase = {
    "Kids": KIDS_RESULTS_FILE,
    "Teenagers": TEENS_RESULTS_FILE,
    "Adults": ADULTS_RESULTS_FILE,
    "OlderGen": OLDER_RESULTS_FILE,
  };
  async manageChannelsData(req, res) {
    const { Audience } = req.body;
    let jsonData;
    if (fs.existsSync(this.storagesCase[Audience])) {
      const fileData = fs.readFileSync(this.storagesCase[Audience]);
      jsonData = fileData ? JSON.parse(fileData) : {};
    }

    if (jsonData && Array.isArray(jsonData) && jsonData.length > 0) {
      const randomCategory = Math.floor(Math.random() * jsonData.length); // случайная категория
      const randomCategoryData = jsonData[randomCategory]; // данные категории

      if (Array.isArray(randomCategoryData) && randomCategoryData.length > 0) {
        const randomChannel = Math.floor(
          Math.random() * randomCategoryData.length
        ); // случайный канал из категории
        res.json({
          message: true,
          randomChannel: randomCategoryData[randomChannel],
        });
      } else {
        res.status(404).json({ message: "Нет каналов в выбранной категории." });
      }
    } else {
      res.status(404).json({ message: "Нет данных для выбранной аудитории." });
    }
  }
}
export default StorageController;
