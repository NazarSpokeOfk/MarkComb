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

    const createVideosTable = `
    CREATE TABLE IF NOT EXISTS videos (
    video_id VARCHAR(64) PRIMARY KEY
    );
    `
    
    const createAnaliticsTable = `
    CREATE TABLE IF NOT EXISTS analytics (
    id BIGSERIAL PRIMARY KEY,
    video_id VARCHAR(64) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    views BIGINT NOT NULL,
    likes BIGINT NOT NULL,
    comments BIGINT,
    CONSTRAINT uq_video_date UNIQUE(video_id, date),
    FOREIGN KEY (video_id) REFERENCES videos(video_id) ON DELETE CASCADE
    );
    `;

    const createAnalyticsMetaTable = `
    CREATE TABLE IF NOT EXISTS analytics_meta (
    video_id VARCHAR(64) PRIMARY KEY,
    points_of_interest INT DEFAULT 1,
    interest_coef NUMERIC(4,2) DEFAULT 1.00,
    FOREIGN KEY (video_id) REFERENCES videos(video_id) ON DELETE CASCADE
    );
    `;

    await pool.query(createVideosTable);

    await pool.query(createChannelsTable);

    await pool.query(createTagsTable);

    await pool.query(createPairsTable);

    await pool.query(createAnaliticsTable);

    await pool.query(createAnalyticsMetaTable);
  } catch (error) {
    logger.error("Возникла ошибка в createStorageTables : ", error);
  }
}
export default createStorageTables;
