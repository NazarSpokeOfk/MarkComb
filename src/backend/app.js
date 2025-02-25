import cookieParser from "cookie-parser";
import cors from "./node_modules/cors/lib/index.js";
import express from "./node_modules/express/index.js";
import createTables from "./db/setup.js";
import createStorageTables from "./db/setupStorage.js";
import session from "express-session";
import pool from "./db/index.js";
import storagePool from "./db/storageIndex.js";
import helmet from "helmet"

import userRouter from "./routers/userRouter.js";
import purchasesRouter from "./routers/purchasesRouter.js";
import googleAPIRouter from "./routers/googleAPIRouter.js"
import storageRouter from "./routers/storageRouter.js";
import logger from "./winston/winston.js";

const app = express();

app.use(helmet())

app.use(express.json());

app.use(
  session({
    secret: "0b8c5b3e58eb7df0c7c45e7948ec438f",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 600000 ,
    },
  })
);

app.use((err, req, res, next) => {
  logger.error(`Ошибка: ${err.message}`);
  res.status(500).json({ message: "Внутренняя ошибка сервера" });
});


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use((req,res,next) => {
  res.setHeader(
    "Content-Security-Policy",
     "default-src 'self'; script-src 'self' https://apis.google.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
  )
  next()
})
//Тут надо аккуратным быть
const PORT = process.env.port || 5001;

app.use("/api", googleAPIRouter)
app.use("/api", purchasesRouter);
app.use("/api", userRouter);
app.use("/api", storageRouter);

async function initializeApp() {
  try {
    await createTables(pool);
    await createStorageTables(storagePool)
    app.listen(PORT, () => {
      
    });
  } catch (error) {
    logger.info("Возникла ошибка в Intialize app:", error);
  }
}

initializeApp();
