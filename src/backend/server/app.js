import cookieParser from "cookie-parser";
import cors from "cors";

import express from "express";

import createTables from "../db/mk/setup.js"
import createStorageTables from "../db/mk_storage/setup.js";

import session from "express-session";

import pool from "../db/mk/index.js";
import storagePool from "../db/mk_storage/index.js";

import helmet from "helmet";

import ParserController from "../parserFunctionality/parsersController.js";

import "../cron/subscriptionTopUp.js"
import "../cron/clearingExpiredSubscriptions.js"

import userRouter from "../routers/userRelatedRouters/userRouter.js"
import purchasesRouter from "../routers/purchasesRelatedRouters/purchasesRouter.js"
import youtubeApiRouter from "../routers/youtubeApiRelatedRouters/youtubeApiRouter.js"
import storageRouter from "../routers/mk_storageRelatedRouters/storageRouter.js";
import reviewsRouter from "../routers/reviewsRelatedRouters/reviewsRouter.js";
import voteRouter from "../routers/voteRelatedRouters/voteRouter.js";
import yoomoneyRouter from "../routers/paymentRelatedRouters/yoomoneyRouter.js";

import logger from "../winston/winston.js";

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
app.use("/api", youtubeApiRouter);
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
  } catch (error) {
    logger.error("Возникла ошибка в Intialize app:", error);
  }
}

export default app;

initializeApp();

