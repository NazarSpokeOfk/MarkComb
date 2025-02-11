import { toast } from "react-toastify";

class FilterAPIController {
  previousThemes = [];
  Categories = {
    Kids: [
      "Animation",
      "Music",
      "Gaming",
      "Comedy",
      "Cartoon",
      "Cartoons",
      "Education",
      "TechReviews",
      "Technologies",
      "Games",
    ], //Youth && teenagers
    Teenagers: [
      "Animation",
      "Cartoon",
      "Cartoons",
      "Music",
      "FitnessHealth",
      "Travel",
      "Gaming",
      "Games",
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
      "Cartoons",
      "Gaming",
      "Games",
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
      "News",
      "Politics",
      "Education",
      "TechReviews",
      "Technologies",
      "Beauty",
      "Fashion",
    ],
    OlderGeneration: [
      "Animation",
      "Music",
      "FitnessHealth",
      "Fitness",
      "Health",
      "Healthy",
      "Comedy",
      "Entertainment",
      "NewsCommentary",
      "News",
      "Politics",
      "Education",
      "TechReviews",
      "Technologies",
    ],
  };
  getSubsCount = async (channelId) => {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${this.apiKey}`;
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        throw new Error("Channel data not found.");
      }

      const subsCount = data.items[0].statistics.subscriberCount;
      return subsCount;
    } catch (error) {
      console.error("Error fetching subscriber count:", error.message);
      return null;
    }
  };
  getVideoId = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    // console.log(data)
    const videoId = data.items[0].id.videoId;
    return videoId;
  };

  //Получить Id -> Затем по Id найти видос -> получить жанр в компонент.

  //Получение жанра
  getGenre = async (videoId) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${this.apiKey}`;
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        throw new Error("Video data not found.");
      }

      const genre = data.items[0].snippet.categoryId; // Проверяем snippet
      return genre;
    } catch (error) {
      console.error("Error fetching genre:", error.message);
      return null;
    }
  };

  // Выполнение функций получения id видео, и передача этого id в getGenre
  run = async (url) => {
    const videoId = await this.getVideoId(url);
    if (videoId) {
      const genre = await this.getGenre(videoId);
      return genre;
    }
    return null;
  };

  getCatById = (id) => {
    let targetAudience;
    const entry = Object.entries(this.Categories).find(
      ([key, value]) => value === Number(id)
    );
    switch (entry?.[1]) {
      case 1:
        targetAudience = "Kids,teenagers,youth,adults,older generation";
        break;
      case 21:
        targetAudience = "Youth,Teenagers";
        break;
      case 10:
        targetAudience = "Kids,teenagers,youth,adults,older generation";
        break;
      case 17:
        targetAudience = "Kids,teenagers,youth,adults,older generation";
        break;
      case 19:
        targetAudience = "Youth,teenagers,adults";
        break;
      case 20:
        targetAudience = "Kids,teenagers,youth,adults";
        break;
      case 23:
        targetAudience = "Kids,teenagers,youth,adults,older generation";
        break;
      case 24:
        targetAudience = "Teenagers, youth , adults";
        break;
      case 25:
        targetAudience = "Youth, adults, older generation";
        break;
      case 27:
        targetAudience = "Kids,teenagers,youth,adults,older generation";
        break;
      case 28:
        targetAudience = "Kids,teenagers,youth,adults,older generation";
        break;
      case 26:
        targetAudience = "Teenagers,youth,adults";
        break;
      default:
        targetAudience = "Unknown target audience";
        break;
    }
    const targetCat = [targetAudience, entry ? entry[0] : "Unknown category"];
    return targetCat;
  };

  transformRes = (result) => {
    return {
      title: result.snippet.title,
      thumbnail: result.snippet.thumbnails.high.url,
      channelId: result.snippet.channelId,
    };
  };
  apiKey = process.env.GOOGLE_API_KEY;

  async searchByContentType(req, res) {
    console.log("req.body:", req.body);
    const { theme, lang } = req.body.bodyData;
    console.log("Язык, по которому будет поиск:", lang);
    const themesLanguages = {
      ru: {
        Animation: "Анимация",
        Vlogs: "Влоги",
        Music: "Музыка",
        Comedy: "Комедия",
        Education: "Образование",
        Travel: "Путешествия",
        Entertaiment: "Развлечения",
        NewsCommentary: "Новости",
        FitnessHealth: "Фитнесс и здоровье",
        Gaming: "Компьютерные игры",
      },
      en: {
        Animation: "Animation",
        Vlogs: "Vlogs",
        Music: "Music",
        Comedy: "Comedy",
        Travel: "Travel",
        Entertaiment: "Entertaiment",
        NewsCommentary: "NewsCommentary",
        FitnessHealth: "FitnessHealth",
        Gaming: "Gaming",
      },
    };

    const languageObject = themesLanguages[lang];
    let transletedTheme;
    // Если объект с переводами для данного языка найден
    if (languageObject) {
      // Возвращаем перевод для конкретной темы
      transletedTheme = languageObject[theme] || theme; // Если перевод не найден, возвращаем тему как есть
    }

    try {
      //Id for Genre
      const idUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        transletedTheme
      )}&type=video&maxResults=1&relevanceLanguage=${lang}&key=${this.apiKey}`;

      const result = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${transletedTheme}&relevanceLanguage=${lang}&key=${this.apiKey}`
      );
      const rawData = await result.json();
      const finalData = rawData.items.map(this.transformRes);
      // console.log("Результат запроса:", finalData);

      const updatedData = await Promise.all(
        finalData.map(async (channel) => {
          const subsCount = await this.getSubsCount(channel.channelId);
          const genreId = await this.run(idUrl); //Тут сомнительный момент, нам не нужен жанр, но целевую аудиторию я не знаю как определить без жанра
          // console.log("genreID:",genreId)
          const genre = genreId ? this.getCatById(genreId) : "unknown category";
          return { ...channel, subsCount, genre };
        })
      );

      // console.log(updatedData)

      res.json({ updatedData }); // Важно возвращать данные
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  }

  async searchContentByTargetAudience(req, res) {
    const { Audience } = req.body.bodyData;
    console.log("Аудитория:", Audience);
    const entry = Object.entries(this.Categories).find(
      ([key, value]) => key === Audience
    );

    // Массив для хранения ранее выбранных значений
    
    const randomTheme = entry
      ? (() => {
          let newTheme;
          // Генерируем новое значение, которое еще не было выбрано
          do {
            newTheme = entry[1][Math.floor(Math.random() * entry[1].length)];
          } while (this.previousThemes.includes(newTheme)); // Пока оно не новое, генерируем заново

          // Сохраняем новое значение в массив
          this.previousThemes.push(newTheme);

          return newTheme;
        })()
      : null;

    console.log("Прошлые темы, и рандомная : ", this.previousThemes, randomTheme);

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
      const transformed = this.transformRes(item);
      console.log("Трансформированные данные:", transformed);
      return transformed;
    });

    const updatedData = await Promise.all(
      finalData.map(async (channel) => {
        const subsCount = await this.getSubsCount(channel.channelId);
        const genreId = await this.run(idUrl); //Тут сомнительный момент, нам не нужен жанр, но целевую аудиторию я не знаю как определить без жанра
        const genre = genreId ? this.getCatById(genreId) : "unknown category";
        return { ...channel, subsCount, genre };
      })
    );
    res.json({ updatedData });
  }

  async searchContentBySubsQuantity(req, res) {
    console.log("req.body:", req.body);
    const { subsQuantity, offset } = req.body.bodyData;

    console.log("subsQuantity:", subsQuantity);

    const themes = [
      "Music",
      "Cartoon",
      "Cartoons",
      "Animation",
      "Gaming",
      "Travel",
      "Traveling",
      "Fitness",
      "Health",
      "Comedy",
      "Entertainment",
      "NewsComentary",
      "News",
      "Politics",
      "Education",
      "TechReviews",
      "Technologies",
      "Beauty",
      "Fashion",
    ];
    const randomInt = (min = 0, max = themes.length - 1) =>
      Math.floor(min + Math.random() * (max + 1 - min));
    const randomTheme = themes[randomInt()];
    console.log("Рандом тема:", randomTheme);

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

    // console.log(statsData.items)

    if (!statsData.items || statsData.items.length === 0) {
      throw new Error("Нет данных о статистике каналов.");
    }

    const filteredChannel = statsData.items.find((channel) => {
      const subscriberCount = parseInt(channel.statistics.subscriberCount, 10);
      return subscriberCount >= offset && subscriberCount <= subsQuantity;
    });

    console.log("filteredChannel:", filteredChannel);

    if (!filteredChannel) {
      res.json({ status: false });
      return;
    }

    const resultArray = [
      {
        title: filteredChannel.snippet.title,
        thumbnail: filteredChannel.snippet.thumbnails.medium.url,
        subsCount: filteredChannel.statistics.subscriberCount,
        channelId: filteredChannel.id,
      },
    ];

    const updatedData = await Promise.all(
      resultArray.map(async (channel) => {
        const genreId = await this.run(idUrl);
        const genre = genreId ? this.getCatById(genreId) : "unknown category";
        return { ...channel, genre };
      })
    );

    res.json({ updatedData });
  }
}
export default FilterAPIController;
