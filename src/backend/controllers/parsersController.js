import dotenv from "dotenv";
import express from "express";
import path from "path";
import { spawn } from "child_process";

dotenv.config({ path: path.resolve(process.cwd(), "./environment/.env") });

const SECRET_TOKEN = process.env.PARSER_TOKEN;
const router = express.Router();

const parserPath = path.resolve("parsers"); // Базовый путь

const tempTagsStorage = {};

router.post("/run-channelsparser", async (req, res) => {
  console.log("Рек бади : ", req.body);

  const { action, age_group, content_type, selectedTags , token } = req.body;

  if (token != SECRET_TOKEN) {
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

  parserProcess.on("close", (code) => {
    if (code === 0 && action === "tags") {
      try {
        const parsedTags = JSON.parse(tags);
  
        console.log("Тэги после парсинга: ", parsedTags);

        const requestId = Date.now().toString();
        tempTagsStorage[requestId] = parsedTags;
  
        res.json({
          requestId,
          tags: tempTagsStorage[requestId]
        });
      } catch (error) {
        console.error("Ошибка при парсинге данных: ", error);
        res.status(500).json({ error: "Ошибка при парсинге данных" });
      }
    } else {
      res.status(200).json({message : "Каналы были записаны в бд"});
    }
  });
});

router.post("/run-tagsparser", async (req, res) => {
  console.log("рек бади :", req.body);
  const { token, tagsTheme, categoryToWrite, age_group } = req.body;

  if (token != SECRET_TOKEN) {
    return res.status(403).json({ message: "Access denied" });
  }

  console.log("Запускаем tagsParser...");

  const parserProcess = spawn("node", [
    path.join(parserPath, `tagsParser.js`), // Корректный путь
    tagsTheme,
    categoryToWrite,
    age_group || "", // Значения должны быть строками или числами
  ]);

  parserProcess.stdout.on("data", (data) =>
    console.log(`Парсер выводит: ${data.toString()}`)
  );
  parserProcess.stderr.on("data", (data) =>
    console.error(`Ошибка в парсере: ${data.toString()}`)
  );
  parserProcess.on("close", (code) =>
    console.log(`Парсер завершил работу с кодом ${code}`)
  );
  res.json({ message: "Парсер запущен" });
});
export default router;
