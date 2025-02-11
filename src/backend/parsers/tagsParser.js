import puppeteer from 'puppeteer';
import fs  from 'fs';
import { json } from 'stream/consumers';


const TEENS_RESULTS_FILE = "../channelsStorage/teenagersStorage.json";
const KIDS_RESULTS_FILE = "../channelsStorage/kidsStorage.json";
const ADULTS_RESULTS_FILE = "../channelsStorage/adultsStorage.json"
const OLDER_RESULTS_FILE = "../channelsStorage/olderGenStorage.json"

async function loadCookies(page) {
    const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
    await page.setCookie(...cookies);
}

async function getYouTubeKeywords(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    const browser = await puppeteer.launch({
        headless: true, // Запуск без UI
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await loadCookies(page); // Загружаем cookies (авторизация)

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const keywords = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="keywords"]');
        return meta ? meta.content.split(', ') : [];
    });

    await browser.close();
    return { videoId, keywords };
}

async function saveKeywords(fileName,category,data) {
    let storage = {};

    if(fs.existsSync(fileName)){
        storage = JSON.parse(fs.readFileSync(fileName, "utf8"))
    }

    if(!storage[category]){
        storage[category] = {}
    }

    const existingTags = new Set(storage[category].tags);
    data.keywords.forEach(tag => {
        existingTags.add(tag)
    });

    storage[category].tags = Array.from(existingTags);

    fs.writeFileSync(fileName, JSON.stringify(storage,null,2))
}

async function main(videos) {
    for (const { videoId, category } of videos) {
        console.log(`Происходит парсинг видео : ${videoId} для категории: ${category}`)
        const result = await getYouTubeKeywords(videoId)
        saveKeywords(TEENS_RESULTS_FILE,category,result);
        console.log(`Данные для ${videoId} сохранены. \n`)
    }
}

const videoList = [
    { videoId: 'dQw4w9WgXcQ', category: 'Music' },
    { videoId: '3JZ_D3ELwOQ', category: 'Technologies' }
];
main(videoList);
