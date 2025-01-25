import Request from "./Requests";

import { toast } from "react-toastify";

class SimilarChannel {
  request = new Request();
  apiKey = "AIzaSyAdpuNLLn_Wnq_L4mioZYahKgSDAJdcBC4";

  async searchByContentType(theme) {
    try {
      //Id for Genre
      const idUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        theme
      )}&type=video&maxResults=1&key=${this.apiKey}`;
      
      const result = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${theme}&key=${this.apiKey}`
      );
      const rawData = await result.json();
      const finalData = rawData.items.map(this.request.transformRes);
      // console.log("Результат запроса:", finalData);

      const updatedData = await Promise.all(
        finalData.map(async (channel) => {
          const subsCount = await this.request.getSubsCount(channel.channelId);
          const genreId = await this.request.run(idUrl); //Тут сомнительный момент, нам не нужен жанр, но целевую аудиторию я не знаю как определить без жанра
          // console.log("genreID:",genreId)
          const genre = genreId
            ? this.request.getCatById(genreId)
            : "unknown category";
          return { ...channel, subsCount, genre };
        })
      );

      // console.log(updatedData)

      return updatedData; // Важно возвращать данные
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  }

  async searchContentByTargetAudience(Audience) {
    //adults for ex

    const Categories = {
      Kids: [
        "Animation",
        "Music",
        "Gaming",
        "Comedy",
        "Education",
        "TechReviews",
      ], //Youth && teenagers
      Teenagers: [
        "Animation",
        "Music",
        "FitnessHealth",
        "Travel",
        "Gaming",
        "Comedy",
        "Entertainment",
        "NewsComentary",
        "Education",
        "TechReviews",
        "Beauty",
        "Fashion",
      ],
      Youth: [
        "Music",
        "Animation",
        "Gaming",
        "Travel",
        "Fitness",
        "Health",
        "Comedy",
        "Entertaiment",
        "NewsComentary",
        "Education",
        "TechReviews",
        "Beauty",
        "Fashion",
      ],
      Adults: [
        "Music",
        "Animation",
        "Gaming",
        "Travel",
        "FitnessHealth",
        "Comedy",
        "Entertaiment",
        "NewsComentary",
        "Education",
        "TechReviews",
        "Beauty",
        "Fashion",
      ],
      OlderGeneration: [
        "Animation",
        "Music",
        "FitnessHealth",
        "Comedy",
        "Entertainment",
        "NewsCommentary",
        "Education",
        "TechReviews",
      ],
    };
    const entry = Object.entries(Categories).find(
      ([key, value]) => key === Audience
    );

    const randomTheme = entry
      ? entry[1][Math.floor(Math.random() * entry[1].length)]
      : null;
    const idUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      randomTheme
    )}&type=video&maxResults=1&key=${this.apiKey}`;

    const requestRandomTheme = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${randomTheme}&maxResults=1&key=${this.apiKey}`
    );
    console.log("Рандомная тема:", randomTheme);

    const rawRandomData = await requestRandomTheme.json();

    console.log("Ответ от API:", rawRandomData);

    const finalData = rawRandomData.items.map((item) => {
      const transformed = this.request.transformRes(item);
      console.log("Трансформированные данные:", transformed);
      return transformed;
    });

    const updatedData = await Promise.all(
      finalData.map(async (channel) => {
        const subsCount = await this.request.getSubsCount(channel.channelId);
        const genreId = await this.request.run(idUrl); //Тут сомнительный момент, нам не нужен жанр, но целевую аудиторию я не знаю как определить без жанра
        const genre = genreId
          ? this.request.getCatById(genreId)
          : "unknown category";
        return { ...channel, subsCount, genre };
      })
    );
    return updatedData;
  }

  async searchContentBySubsQuantity(subcsCount, offset) {
    const themes = [
      "Music", "Animation", "Gaming", "Travel", "Fitness",
      "Health", "Comedy", "Entertainment", "NewsComentary",
      "Education", "TechReviews", "Beauty", "Fashion"
    ];
    const randomInt = (min = 0, max = themes.length - 1) => Math.floor(min + Math.random() * (max + 1 - min));
    const randomTheme = themes[randomInt()];

    const idUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      randomTheme
    )}&type=video&maxResults=1&key=${this.apiKey}`; //Получаем id видеоролика от этого же ютубера.

    const themeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${randomTheme}&maxResults=10&key=${this.apiKey}`;
    const channelsRequest = await fetch(themeUrl);
    const channelsResults = await channelsRequest.json();
  
    console.log("Channel results:", channelsResults);
  
    const channelIdS = channelsResults.items
      .map((item) => item.id.channelId)
      .join(",");
    if (!channelIdS) {
      throw new Error("Нет доступных каналов.");
    }
  
    const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIdS}&key=${this.apiKey}`;
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();
  
    if (!statsData.items || statsData.items.length === 0) {
      throw new Error("Нет данных о статистике каналов.");
    }
  
    const filteredChannel = statsData.items.find((channel) => {
      const subscriberCount = parseInt(channel.statistics.subscriberCount, 10);
      return subscriberCount >= offset && subscriberCount <= subcsCount;
    });

    console.log('filteredChannel:',filteredChannel)

    if (!filteredChannel) {
      toast.error("There is no matching channels")
    }
  
    const resultArray = [
      {
        title: filteredChannel.snippet.title,
        thumbnail: filteredChannel.snippet.thumbnails.medium.url,
        subsCount: filteredChannel.statistics.subscriberCount,
        channelId: filteredChannel.id
      },
    ];
  
    const quantityReqResult = await Promise.all(
      resultArray.map(async (channel) => {
        const genreId = await this.request.run(idUrl);
        const genre = genreId ? this.request.getCatById(genreId) : "unknown category";
        return { ...channel, genre };
      })
    );
  
    return quantityReqResult;
  }  
}
export default SimilarChannel;
