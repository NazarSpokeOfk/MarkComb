import logger from "../../winston/winston.js"
class SearchApiController{
    apiKey = process.env.GOOGLE_API_KEY;

  //Форматировка данных
  transformRes = (result) => {
    return {
      channel_name: result.snippet.title,
      thumbnail: result.snippet.thumbnails.high.url,
      channelId: result.snippet.channelId,
    };
  };

  //Получение количества подписчиков 1квота
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
      logger.error(" (getSubsCount) Error fetching subscriber count:", error.message);
      return null;
    }
  };

  //Получение id видеоролика
  getVideoId = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    const videoId = data.items[0].id.videoId;
    return videoId;
  };

  //Получить Id -> Затем по Id найти видос -> получить жанр в компонент.

  //Получение жанра 1квота
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
      logger.error(" (getGenre) Error fetching genre:", error.message);
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

  //Категории видео
  Categories = {
    Vlogs: 21, //Youth && teenagers
    Animation: 1, // Kids,teenagers,youth,adults,older generation
    Music: 10, //Kids,teenagers,youth,adults,older generation
    FitnessHealth: 17, // Kids,teenagers,youth,adults,older generation
    Travel: 19, // Youth && teens && Adults
    Gaming: 20, //  Kids && Teenagers && Youth && Adults
    Comedy: 23, //Kids,teenagers,youth,adults,older generation
    Entertainment: 24, //Youth && teens && Adults
    NewsCommentary: 25, //Youth && Adults && Older Gen
    Education: 27, //Kids,teenagers,youth,adults,older generation
    TechReviews: 28, //Kids,teenagers,youth,adults,older generation
    BeautyFashion: 26, //Teens && Youth && Adults
  };

  //Получаем категорию видео по id
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
        targetAudience = " Youth,Teenagers";
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

  //Основная функция по поиску канала по данным, полученным из формы.
  FindChannel = async (mainInputValue) => {
    try {
      // const form = document.querySelector(`.${selector}`);
      // if (!form) {
      //   console.error("Форма не найдена");
      //   return null;
      // }

      // const input = form.querySelector("input.search__main");
      // if (!input) {
      //   console.error("Поле ввода не найдено");
      //   return null;
      // }

      const query = mainInputValue.trim();
      if (!query) {
        alert("Введите запрос");
        // setIsSearching(false)
        return null;
      }

      //Получаем id видео, а затем и жанр 100квот
      const idUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&maxResults=1&key=${this.apiKey}`;

      //Получаем название, картинку канала. 100квот
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=channels&maxResults=1&key=${this.apiKey}`;

      // Получаем данные о канале
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Ошибка при fetch");
      }

      const data = await res.json();
      const processedData = data.items.map(this.transformRes);

      // Получаем жанр и добавляем его к данным
      const finalData = await Promise.all(
        processedData.map(async (channel) => {
          try {
            const genreId = await this.run(idUrl); // Получаем ID жанра
            const genreName = genreId
              ? this.getCatById(genreId)
              : "Unknown category";
            return {
              ...channel,
              contenttype: genreName[1],
              targetAudience: genreName[0],
            }; // Добавляем жанр
          } catch (error) {
            logger.error(" (FindChannel) Error processing genre:", error.message);
            return { ...channel, genre: "Unknown category" };
          }
        })
      );

      return finalData;
    } catch (error) {
      logger.error("(FindChannel) Произошла ошибка:", error.message);
    }
  };

  //Функция исполнения запросов, для передачи в другие файлы.
  handleSearch = async (req,res) => {
    const {mainInputValue} = req.body;
    try {
      const data = await this.FindChannel(mainInputValue);
      if (!data || data.length === 0) {
        return;
      }
      const dataInArr = await Promise.all(
        data.map(async (channel) => {
          const subsCount = await this.getSubsCount(channel.channelId);
          return { ...channel, subsCount };
        })
      );

      let updatedData = dataInArr[0]
      res.json({status : true,updatedData})
      return;
    } catch (error) {
      logger.error(" (handleSearch) Search error:", error);
      res.status(500).json({ message: "Ошибка поиска", error: error.message });
    }
  };

  channelAndVideoSearch = async (channelName, videoName) => {
    const urlForChannelId = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelName}&key=${this.apiKey}`;
    try {
      const resForChannelId = await fetch(urlForChannelId);
      if (!resForChannelId.ok) {
        return Promise.reject();
      }
      const finalChannelIdResult = await resForChannelId.json();
      const channelId = finalChannelIdResult?.items?.[0]?.id?.channelId; // Ошибка мб
      const urlForVideoSearch = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&q=${encodeURIComponent(
        videoName
      )}&order=date&key=${this.apiKey}`;
      const resForVideosSearch = await fetch(urlForVideoSearch);
      
      if (!resForVideosSearch.ok) {
        return Promise.reject();
      }
      const videoData = await resForVideosSearch.json();

      let triplet
      
      if(videoData?.items?.[0]?.snippet?.title.length > 30){
         triplet = "..."
      } else {
        triplet = ""
      }
      const finalVideoData = {
        channel_name: videoData?.items?.[0]?.snippet?.title.slice(0,35) + triplet,
        thumbnail: videoData?.items?.[0]?.snippet?.thumbnails?.medium?.url,
        videoId : videoData?.items?.[0]?.id?.videoId
      };
      return finalVideoData;
    } catch (error) {
      logger.error(" (channelAndVideoSearch) Ошибка:", error);
    }
  };

  getAnalitics = async (videoId) => {
    const urlForAnalitics = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${this.apiKey}`;
    try{
      const rawData = await fetch(urlForAnalitics);

      const data = await rawData.json();
      const analitics = {
        views : data?.items?.[0]?.statistics?.viewCount,
        likes : data?.items?.[0]?.statistics?.likeCount
      }
      
      return analitics
    } catch (error) {
      logger.error(" (getAnalitics) Возникла ошибка:",error)
      return Promise.reject()
    }
  };
} 
export default SearchApiController