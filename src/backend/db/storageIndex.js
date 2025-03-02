import pkg from 'pg';
import path from "path"
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), "/Users/nazarkuratnikov/Desktop/Project X /markcomb/src/backend/environment/.env.storage") });

const storagePool = new Pool({
    user : process.env.ST_DB_USER,
    host : process.env.ST_DB_HOST,
    database : process.env.ST_DB_NAME,
    password : process.env.ST_DB_PASSWORD,
    port : process.env.ST_DB_PORT
})
export default storagePool;