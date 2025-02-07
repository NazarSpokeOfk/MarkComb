import cookieParser from "cookie-parser";
import cors from "./node_modules/cors/lib/index.js";
import express from "./node_modules/express/index.js";
import createTables from "./db/setup.js";
import session from "express-session";
import pool from "./db/index.js";

import userRouter from "./routers/userRouter.js";
import purchasesRouter from "./routers/purchasesRouter.js";
import googleAPIRouter from "./routers/googleAPIRouter.js"

const app = express();

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

async function initializeApp() {
  try {
    await createTables(pool);
    app.listen(PORT, () => {
      console.log("Сервер запущен на порте:", PORT);
    });
  } catch (error) {
    console.log("Возникла ошибка в Intialize app:", error);
  }
}

initializeApp();
