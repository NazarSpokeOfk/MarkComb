import pkg from 'pg';
import path from "path"
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

dotenv.config({ path: path.resolve(process.cwd(), "./environment/.env") });

const pool = new Pool({
    user : process.env.DB_USER,
    host : process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

console.log('Подключение к базе данных: ', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

export default pool