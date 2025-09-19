import storagePool from "../db/mk_storage/index.js";
import calculateDifference from "../modules/calculateDifference.js";

function getDayDifference(dateString1, dateString2) {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2); // тут просто переводим даты в формат 2025-09-13T21:00:00.000Z

  const millisecondDifference = date2.getTime() - date1.getTime(); // здесь мы переводим даты в миллисекунды, отнимаем одну дату из другой.
  const millisecondsInADay = 1000 * 60 * 60 * 24; // 100000 мс / 1000 мс/мин / 60 секунд/мин / 60 мин/час / 24 часа

  return Math.round(millisecondDifference / millisecondsInADay);
}

export async function getAnalyticsTotal(videoId) {
  try {
    const request = await storagePool.query(
      "SELECT date,views,likes,comments FROM analytics WHERE video_id = $1",
      [videoId]
    );

    const firstDay = request.rows[0];
    const lastDay = request.rows[request.rows.length - 1];

    const daysBetween = getDayDifference(firstDay.date,lastDay.date)
    const { differencesInNumbers, differencesInPercents } = calculateDifference(
      firstDay,
      lastDay
    );

    return {
      daysBetween,
      differencesInNumbers,
      differencesInPercents,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAnalyticsYesterday(videoId) {
  try {
    const request = await storagePool.query(
      "SELECT date,views,likes,comments FROM analytics WHERE video_id = $1 AND date IN (CURRENT_DATE, CURRENT_DATE - INTERVAL '1 day') ORDER BY date ASC",
      [videoId]
    );

    console.log(request.rows)
    if (request.rows.length === 2) {
      const [yesterday, today] = request.rows;

      const { differencesInNumbers, differencesInPercents } =
        calculateDifference(yesterday, today);

      return { differencesInNumbers, differencesInPercents };
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAnalyticsBetween(startDate, endDate, videoId) {
  // 2025-09-02 и 2025-09-07
  try {
    const request = await storagePool.query(
      "SELECT date,views,likes,comments FROM analytics WHERE date BETWEEN $1 AND $2 AND video_id = $3 ORDER BY date ASC",
      [startDate, endDate, videoId]
    );
    const rows = request.rows;
    // 2025-09-07 4545464 34343 123
    // 2025-09-06 4545464 34343 123
    // 2025-09-05 4545464 34343 123
    // 2025-09-04 4545464 34343 123
    // 2025-09-03 4545464 34343 123
    let result = [];
    for (let i = 0; i < rows.length - 1; i++) {
      const current = rows[i];
      const previous = rows[i + 1];
      const { differencesInNumbers, differencesInPercents } =
        calculateDifference(current,previous);

      result.push({
        [`${current.date}_${previous.date}`]: {
          differencesInNumbers,
          differencesInPercents,
        },
      });
    }

    return result;
    // [
    //   { "2025-09-21_2025-09-22": { differencesInNumbers: {...}, differencesInPercents: {...} } },
    //   { "2025-09-22_2025-09-23": { differencesInNumbers: {...}, differencesInPercents: {...} } }
    // ]
  } catch (error) {
    throw new Error(error);
  }
}
