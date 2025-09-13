import { channelAndVideoSearch } from "./promotion.service.js";

import storagePool from "../db/mk_storage/index.js";

export async function collectAnalytics(channel_name, videoName) {
    let currentAnalytics;
    let videoData;
  try {
    ({ currentAnalytics, videoData } = await channelAndVideoSearch(channel_name, videoName));
    // analiticsAndData: {
    //     title: 'Обзор Marvel Rivals',
    //     thumbnail: 'https://i.ytimg.com/vi/v0qspoyYdiA/mqdefault.jpg',
    //     videoId: 'v0qspoyYdiA',
    //     analitics: { views: '424918', likes: '15388' }
    //     }
    if (!currentAnalytics) {
      throw new Error("Can't find analytics.");
    }
  } catch (error) {
    console.log(error)
    throw new Error("Error accessing promotion.service");
  }

  try {
    const insertAnalytics = await storagePool.query(
      "INSERT INTO analytics(video_id,views,likes,comments) VALUES ($1,$2,$3,$4) ON CONFLICT (video_id, date) DO UPDATE SET views = EXCLUDED.views, likes = EXCLUDED.likes, comments = EXCLUDED.comments,points_of_interest = analytics.points_of_interest + 1 RETURNING video_id",
      [
        videoData.videoId,
        currentAnalytics.views,
        currentAnalytics.likes,
        currentAnalytics.comments,
      ]
    );

    const videoId = insertAnalytics.rows[0].video_id;

    const checkIsHasPreviousAnalytics = await storagePool.query("SELECT * FROM analytics WHERE video_id = $1 AND date  < CURRENT_DATE ORDER BY date DESC LIMIT 1",[videoId]);

    const oldAnalytics = checkIsHasPreviousAnalytics.rows[0] || null;

    // 1 fe93fkq 13.09.2025 1000 500 15 1
    // 2 fe93fkq 14.09.2025 1267 570 20 2
    // 3 fe93fkq 15.09.2025 1000 500 15 1
    return {videoData,currentAnalytics,oldAnalytics}
  } catch (error) {
    console.log(error)
    throw new Error("There was an error during collecting analytics.")
  }
}
