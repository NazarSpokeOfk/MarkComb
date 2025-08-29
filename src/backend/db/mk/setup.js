import logger from "../../winston/winston.js";
async function createTables(pool) {
  try {
    const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(50),
        uses BigInt DEFAULT 0,
        PRIMARY KEY(user_id)
        )`;

    const createPurchasesTable = `CREATE TABLE IF NOT EXISTS purchases_channels(
            transaction_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            channel_name VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            created_at DATE DEFAULT CURRENT_DATE NOT NULL
        )`;

    const createReviewsTable = `CREATE TABLE IF NOT EXISTS reviews(
        review_id SERIAL PRIMARY KEY,
        review VARCHAR(200),
        mark INT,
        created_at DATE DEFAULT CURRENT_DATE NOT NULL
        )`;

    const createVotesTable = `CREATE TABLE IF NOT EXISTS votes (
    user_id INTEGER PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    voted_at TIMESTAMP DEFAULT NOW()
    );`;

    const createPackagesTable = `CREATE TABLE IF NOT EXISTS packages (
    package_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    price INT NOT NULL,
    uses INT NOT NULL
    )`;

    const createVerificationTokensTable = `CREATE TABLE IF NOT EXISTS verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    email TEXT,
    verification_token VARCHAR(50) NOT NULL,
    action TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    CHECK (
        (user_id IS NOT NULL AND email IS NULL)
        OR (user_id IS NULL AND email IS NOT NULL)
    )
   );`;

    await pool.query(createVerificationTokensTable);

    await pool.query(createUsersTable);

    await pool.query(createPurchasesTable);

    await pool.query(createReviewsTable);

    await pool.query(createVotesTable);

    await pool.query(createPackagesTable);
  } catch (error) {
    logger.error("Возникла ошибка в setup.js:", error);
  }
}
export default createTables;
