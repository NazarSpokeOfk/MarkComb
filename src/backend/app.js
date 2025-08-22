import cookieParser from "cookie-parser";
import cors from "./node_modules/cors/lib/index.js";

import express from "./node_modules/express/index.js";

import createTables from "./db/main/setup.js";
import createStorageTables from "./db/storage/setupStorage.js";

import session from "express-session";

import pool from "./db/main/index.js";
import storagePool from "./db/storage/storageIndex.js";

import helmet from "helmet";

import ParserController from "./controllers/parser/parsersController.js";

import "./cronTasks/addingUsesCronTask.js"
import "./cronTasks/clearingExpiredSubscriptionsCronTask.js"

import userRouter from "./routers/user/userRouter.js";
import purchasesRouter from "./routers/user/purchasesRouter.js";
import googleAPIRouter from "./routers/google/googleAPIRouter.js";
import storageRouter from "./routers/storage/storageRouter.js";
import reviewsRouter from "./routers/user/reviewsRouter.js";
import voteRouter from "./routers/user/voteRouter.js";
import yoomoneyRouter from "./routers/payment/yoomoneyRouter.js";

import logger from "./winston/winston.js";

const app = express();

app.set("trust proxy",1);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(helmet());

app.use(express.json());

app.use(
  session({
    secret: "0b8c5b3e58eb7df0c7c45e7948ec438f",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 600000,
    },
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://apis.google.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
  );
  next();
});

const PORT = process.env.port || 5001;

function checkApiKey(req, res, next) {
  if (req.path === "/checkpayment") {
    return next();
  }
  const key = req.headers["x-api-key"];
  if (!key || key !== process.env.VITE_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid API key" });
  }

  next();
}

app.use("/api", checkApiKey, ParserController);
app.use("/api", googleAPIRouter);
app.use("/api", purchasesRouter);
app.use("/api", userRouter);
app.use("/api", storageRouter);
app.use("/api", reviewsRouter);
app.use("/api", voteRouter);
app.use("/api", yoomoneyRouter);

app.use((err, req, res, next) => {
  logger.error(`Ошибка: ${err.message}`);
  res.status(500).json({ message: "Внутренняя ошибка сервера" });
});

async function initializeApp() {
  try {
    await createTables(pool);
    await createStorageTables(storagePool);
    app.listen(PORT, () => {});
  } catch (error) {
    logger.error("Возникла ошибка в Intialize app:", error);
  }
}

export default app;

initializeApp();

