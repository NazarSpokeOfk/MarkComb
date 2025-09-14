import "../loadEnv.js";

import returnWorkingThumbnailURL from "../modules/returnWorkingThumbnailURL.js";

const apiKey = process.env.GOOGLE_API_KEY;
export const channelAndVideoSearch = async (channel_name, videoName) => {
  const urlForChannelId = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channel_name}&key=${apiKey}`;
  try {
    const resForChannelId = await fetch(urlForChannelId);
    if (!resForChannelId.ok) {
      return Promise.reject();
    }
    const finalChannelIdResult = await resForChannelId.json();
    const channelId = finalChannelIdResult?.items?.[0]?.id?.channelId; // Ошибка мб
    const urlForVideoSearch = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&q=${encodeURIComponent(
      videoName
    )}&order=date&key=${apiKey}`;
    const resForVideosSearch = await fetch(urlForVideoSearch);
    if (!resForVideosSearch.ok) {
      return Promise.reject();
    }
    const videoData = await resForVideosSearch.json();
    let triplet;

    if (videoData?.items?.[0]?.snippet?.title.length > 30) {
      triplet = "...";
    } else {
      triplet = "";
    }
    const finalVideoData = {
      channel_name:
        videoData?.items?.[0]?.snippet?.title.slice(0, 35) + triplet,
      thumbnail: returnWorkingThumbnailURL(
        videoData?.items?.[0]?.snippet?.thumbnails?.medium?.url
      ),
      videoId: videoData?.items?.[0]?.id?.videoId,
    };
    const { views, likes, comments } = await getAnalitics(
      finalVideoData.videoId
    );

    return {
      videoData: {
        title: videoData?.items?.[0]?.snippet?.title.slice(0, 35) + triplet,
        thumbnail: returnWorkingThumbnailURL(
          videoData?.items?.[0]?.snippet?.thumbnails?.medium?.url
        ),
        videoId: videoData?.items?.[0]?.id?.videoId,
      },
      currentAnalytics: {
        views,
        likes,
        comments,
      },
    };
  } catch (error) {
    console.log("Ошибка в promotion : ", error);
    logger.error(" (channelAndVideoSearch) Ошибка:", error);
  }
};

export const getAnalitics = async (videoId) => {
  const urlForAnalitics = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${apiKey}`;
  try {
    const rawData = await fetch(urlForAnalitics);

    const data = await rawData.json();
    return {
      views: data?.items?.[0]?.statistics?.viewCount,
      likes: data?.items?.[0]?.statistics?.likeCount,
      comments: data?.items?.[0]?.statistics?.commentCount,
    };
  } catch (error) {
    logger.error(" (getAnalitics) Возникла ошибка:", error);
    throw new Error("Error during getting analitics");
  }
};
