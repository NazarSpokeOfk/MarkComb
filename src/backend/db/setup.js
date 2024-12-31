async function createTables(pool) {
    try{
        const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(50) NOT NULL,
        balance BigInt DEFAULT 0,
        uses BigInt DEFAULT 0
        )`;

        const createPurchasesTable = `CREATE TABLE IF NOT EXISTS purchases_channels(
        transaction_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        channel_name VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL
        )`;

        await pool.query(createUsersTable)
        console.log('Таблица пользователей создана.')

        await pool.query(createPurchasesTable)
        console.log('Таблица с покупками создана.')

    } catch(error){
        console.log('Возникла ошибка в setup.js:',error)
    }
}
export default createTables;