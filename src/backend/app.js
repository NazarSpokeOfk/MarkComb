import cookieParser from "cookie-parser";
import crypto from "crypto"
import cors from "./node_modules/cors/lib/index.js"
import express from "./node_modules/express/index.js"
import createTables from "./db/setup.js";
import session from "express-session";
import pool from "./db/index.js";

import userRouter from "./routers/userRouter.js";
import purchasesRouter from "./routers/purchasesRouter.js";


const app = express();

app.use(session({
  secret : "0b8c5b3e58eb7df0c7c45e7948ec438f",
  resave : false,
  saveUninitialized : true,
  cookie : {
    httpOnly : false,
    secure : false,
    maxAge : 600000
  }
}))

app.use(
    cors({
      origin: "http://localhost:3000", 
      credentials: true, 
    })
  );
const PORT = process.env.port || 5001;

app.use(express.json())

app.use(cookieParser())

app.use('/api',purchasesRouter)
app.use('/api',userRouter)


async function initializeApp(){
    try{
        await createTables(pool);
        app.listen(PORT,()=>{
            console.log('Сервер запущен на порте:',PORT)
        });
    } catch (error) {
        console.log("Возникла ошибка в Intialize app:",error)
    }
}

initializeApp()