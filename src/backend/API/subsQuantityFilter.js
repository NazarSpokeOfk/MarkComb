
class FilterAPIController {
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

  async searchContentBySubsQuantity(req, res) {
    console.log("req.body:", req.body);
    const { subsQuantity, offset } = req.body;

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
      console.log("Нет доступных каналов.");
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

    const result = {
        title: filteredChannel.snippet.title,
        thumbnail: filteredChannel.snippet.thumbnails.medium.url,
        subs: filteredChannel.statistics.subscriberCount,
        channelId: filteredChannel.id,
    }

    const contentTypeID = await this.run(idUrl);
    const contenttype = contentTypeID ? this.getCatById(contentTypeID) : "unknown category"

    const payload = {...result, contenttype};

    res.json({ status : true, payload });
  }
}
export default FilterAPIController;
