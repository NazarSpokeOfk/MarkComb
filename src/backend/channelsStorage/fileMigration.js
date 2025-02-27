import fs from "fs"
import path from "path"
import storagePool from "../db/storageIndex.js"


const importData = async (filePath,fileName) => {

    try{  
        const data = JSON.parse(fs.readFileSync(filePath,"utf-8"));

        console.log("дата : ", data)

        for(const contentType in data){
            const {channels,tags,pairs} = data[contentType];

            for(const channel of channels){
                console.log("Вставляем данные для этого канала: " , channel)
                await storagePool.query(`INSERT INTO channels(channelID , content_type , age_group , subs_count) VALUES ($1 , $2 , $3 , $4) ON CONFLICT (channelID) DO NOTHING`, 
                    [channel,contentType,fileName,null]
                )
            }

            for(const tag of tags) {
            
                await storagePool.query(`INSERT INTO tags(tag,content_type,age_group) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING`,
                    [tag,contentType,fileName]
                )
            }

            if(pairs){
                for (let i = 0; i < pairs.length - 1; i++) {
                    let realPair = pairs[i] + " " + pairs[i + 1];
                    
                    await storagePool.query(
                        `INSERT INTO pairs(pair, content_type) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
                        [realPair, contentType]
                    );
                }
            } else {
                console.log("Пар нет, работа закончена")
            }
        }
        console.log(`Данные из файла : ${filePath} были загружены в бд`)
    } catch ( error ) {
        console.log("Возникла ошибка в importData : " , error)
    }
}

const importAllData = async () => {
    const folderPath = path.join(process.cwd() , "/");
    const files = fs.readdirSync("./").filter(file => file.endsWith('.json'));
    
    for (const file of files) {
        console.log("ало епта")
        const fileName = path.basename(file,'json')
        await importData(path.join(folderPath, file),fileName);
    }

    console.log('Импорт завершён!');
}

importAllData()