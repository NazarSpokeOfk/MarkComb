import logger from "../winston/winston.js"
async function createTables(pool) {
    try{
        const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(50),
        uses BigInt DEFAULT 0,
        PRIMARY KEY(user_id)
        )`;

        

        const createUserVerificationTable = `CREATE TABLE IF NOT EXISTS user_verifications (
        email VARCHAR(255) PRIMARY KEY,
        verification_code VARCHAR(10) NOT NULL,
        verification_expiry TIMESTAMP NOT NULL 
        )`

        const createPurchasesTable = `CREATE TABLE IF NOT EXISTS purchases_channels(
            transaction_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            channel_name VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            created_at DATE DEFAULT CURRENT_DATE NOT NULL
        )`; 

        await pool.query(createUsersTable)
        console.log('Таблица пользователей создана.')

        await pool.query(createPurchasesTable)
        console.log('Таблица с покупками создана.')

        await pool.query(createUserVerificationTable)
        console.log('Таблица верификации создана.')

    } catch(error){
        logger.error('Возникла ошибка в setup.js:',error)
    }
}
export default createTables;