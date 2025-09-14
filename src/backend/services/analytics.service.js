import storagePool from "../db/mk_storage/index.js";

export async function getAnalyticsByRande(videoId, startDate, endDate) {
  try {
    const request = await storagePool.query(
      "SELECT date,views,likes,comments FROM analytics WHERE date BETWEEN $1 AND $2 AND video_id = $3 ORDER BY date ASC",
      [startDate, endDate, videoId]
    );

    if (!request) {
      throw new Error("There is no analytics in that range.");
    }

    return request;
  } catch (error) {
    throw new Error("Error while searching analytics in range.");
  }
}

export async function getAnalyticsByDay(videoId, date) {
  try {
    const request = await storagePool.query(
      "SELECT date,views,likes,comments FROM analytics WHERE date = $1 AND videoId = $2",
      [date, videoId]
    );

    if(!request){
        throw new Error("There is no analytics on that day.")
    }
  } catch (error) {
    throw new Error("Error while searching analytics by day.");
  }
}
