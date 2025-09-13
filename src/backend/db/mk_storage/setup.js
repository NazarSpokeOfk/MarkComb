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

    const createAnaliticsTable = `
    CREATE TABLE IF NOT EXISTS analytics (
    id BIGSERIAL PRIMARY KEY,
    video_id VARCHAR(64) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    views BIGINT NOT NULL,
    likes BIGINT NOT NULL,
    comments BIGINT,
    points_of_interest INT DEFAULT 1.2,
    interest_coef NUMERIC(4,2) DEFAULT 1.00
    );
    CREATE INDEX IF NOT EXISTS idx_analytics_video ON analytics(video_id, date)
    `;
    //     ALTER TABLE analytics
    // ADD CONSTRAINT uq_video_date UNIQUE (video_id, date);

    await pool.query(createChannelsTable);

    await pool.query(createTagsTable);

    await pool.query(createPairsTable);

    await pool.query(createAnaliticsTable);
  } catch (error) {
    logger.error("Возникла ошибка в createStorageTables : ", error);
  }
}
export default createStorageTables;
