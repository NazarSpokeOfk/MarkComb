import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled", // Скрываем Puppeteer
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });
  const page = await browser.newPage();

  await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" });

  console.log(
    "🔵 Войди в свой YouTube-аккаунт вручную. НЕ закрывай браузер сам!"
  );

  await page.waitForSelector("#avatar-btn", { timeout: 0 });

  console.log("✅ Логин обнаружен! Сохраняем cookies...");

  const cookies = await page.cookies();
  fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));

  console.log('✅ Cookies сохранены в "cookies.json". Закрываем браузер...');
  await browser.close();
})();
