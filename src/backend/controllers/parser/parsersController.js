import dotenv from "dotenv";
import express from "express";
import path from "path";
import { randomUUID } from "crypto";
import { spawn } from "child_process";

import logger from "../../winston/winston.js";

dotenv.config({ path: path.resolve(process.cwd(), "./environment/.env") });

const SECRET_TOKEN = process.env.PARSER_TOKEN;
const router = express.Router();

const parserPath = path.resolve("parsers");

const tempTagsStorage = {};

router.post("/run-channelsparser", async (req, res) => {
  

  const { action, age_group, content_type, selectedTags, token } = req.body;

  if (token !== SECRET_TOKEN) {
    return res.status(403).json({ message: "Access denied" });
  }

  const parserProcess = spawn("node", [
    path.join(parserPath, "channelsParser.js"),
    action,
    age_group,
    content_type,
    selectedTags,
  ]);

  let tags = "";

  parserProcess.stdout.on("data", (data) => {
    tags += data.toString();
  });

  parserProcess.on("error", (error) => {
    logger.error(
      `Произошла ошибка при запуске channelsParser : ${error.message}`
    );
    return res
      .status(500)
      .json({ error: "Произошла ошибка при запуске парсера!" });
  });

  parserProcess.on("close", (code) => {
    if (code === 0 && action === "tags") {
      try {
        const parsedTags = JSON.parse(tags);

        

        const requestId = randomUUID();
        tempTagsStorage[requestId] = parsedTags.tags;

        setTimeout(() => delete tempTagsStorage[requestId], 10 * 60 * 1000);

        res.json({
          requestId,
          tags: tempTagsStorage[requestId],
        });
      } catch (error) {
        logger.error(" (run-channelsparser) Ошибка при парсинге данных: ", error);
        res.status(500).json({ error: "Ошибка при парсинге данных" });
      }
    } else if (code === 1) {
      res.status(500).json({ message: "Ошибка парсера,проверьте данные." });
    } else {
      res.status(200).json({ message: "Данные записаны в бд" });
    }
  });
});

router.post("/run-tagsparser", async (req, res) => {
  
  const { token, tagsTheme, categoryToWrite, age_group } = req.body;

  if (token !== SECRET_TOKEN) {
    return res.status(403).json({ message: "Access denied" });
  }

  

  const parserProcess = spawn("node", [
    path.join(parserPath, `tagsParser.js`),
    tagsTheme,
    categoryToWrite,
    age_group || "",
  ]);

  parserProcess.stdout.on("data", (data) => {
    console.log(`Парсер тэгов выводит: ${data.toString()}`)
  }
)
  parserProcess.stderr.on("data", (data) =>
    logger.error(`Ошибка в парсере тэгов: ${data.toString()}`)
  );
  parserProcess.on("close", (code) =>
    console.log(`Парсер завершил работу с кодом ${code}`)
  );
  res.json({ message: "Парсер запущен" });
});
export default router;
