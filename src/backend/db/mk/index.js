import pkg from 'pg';
import path from "path"
const { Pool } = pkg;
import dotenv from 'dotenv';
import "../../loadEnv.js"
console.log(process.env.DB_USER)
const mainPool = new Pool({
    user : process.env.DB_USER,
    host : process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export default mainPool