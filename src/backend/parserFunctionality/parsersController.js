import dotenv from "dotenv";
import express from "express";
import path from "path";
import { randomUUID } from "crypto";
import runParser from "./channelsParser.js";
import runTagsParser from "./tagsParser.js";

import logger from "../winston/winston.js";

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

  let runParserResult;
  try {
    runParserResult = await runParser(action,age_group,content_type,selectedTags)
    console.log("результат работы runParser : ", runParserResult);
  } catch (error) {
    console.log("Возникла ошибка при runParser :" , error)
    return res.status(500).json({message : "Возникла ошибка при runParser" , error : error})
  }
    if (action === "tags") {
      try {
        const requestId = randomUUID();
        tempTagsStorage[requestId] = runParserResult;

        setTimeout(() => delete tempTagsStorage[requestId], 10 * 60 * 1000);

        res.json({
          requestId,
          runParserResult: tempTagsStorage[requestId],
        });
      } catch (error) {
        logger.error(" (run-channelsparser) Ошибка при парсинге данных: ", error);
        res.status(500).json({ error: "Ошибка при парсинге данных" });
      }
    } else {
      res.status(200).json({ message: "Данные записаны в бд" });
    }
});

router.post("/run-tagsparser", async (req, res) => {
  
  const { token, tagsTheme, categoryToWrite, age_group } = req.body;

  if (token !== SECRET_TOKEN) {
    return res.status(403).json({ message: "Access denied" });
  }

  let tagsParserResult;

  try {
    tagsParserResult = await runTagsParser(tagsTheme,categoryToWrite,age_group)

    return res.status(200).json({result : tagsParserResult})
  } catch (error) {
    console.log("Возникла ошибка при вызове runTagsParser :" , error)
    return res.status(500).json({message : "Возникла ошибка при запуске tagsParser",error})
  }
});
export default router;
