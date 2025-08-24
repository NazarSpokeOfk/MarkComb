import logger from "../../winston/winston.js";
async function createStorageTables(pool) {
  try {
    const createChannelsTable = `CREATE TABLE IF NOT EXISTS channels(
            channelID VARCHAR(255) PRIMARY KEY,
            content_type VARCHAR(255) NOT NULL,
            age_group VARCHAR(50) NOT NULL,
            subs_count bigInt
            )`;

    const createTagsTable = `CREATE TABLE IF NOT EXISTS tags(
            id SERIAL PRIMARY KEY,
            tag VARCHAR(255) NOT NULL,
            content_type VARCHAR(255) NOT NULL,
            age_group VARCHAR(255) NOT NULL
            )`;

    const createPairsTable = `CREATE TABLE IF NOT EXISTS pairs(
            id SERIAL PRIMARY KEY,
            pair VARCHAR(255) NOT NULL,
            content_type VARCHAR(255) NOT NULL
            )`;

    await pool.query(createChannelsTable);
    

    await pool.query(createTagsTable);
    

    await pool.query(createPairsTable)
    

  } catch (error) {
    logger.error("Возникла ошибка в createStorageTables : ", error);
  }
}
export default createStorageTables;
