async function createStorageTables (pool) {
    try {
        const createChannelsTable = `CREATE TABLE IF NOT EXISTS channels(
            channelID VARCHAR(255) PRIMARY KEY,
            content_type VARCHAR(255) NOT NULL,
            age_group VARCHAR(50) NOT NULL,
            subs_count bigInt NOT NULL
            )`
        
            const createTagsTable = `CREATE TABLE IF NOT EXISTS tags(
            id SERIAL PRIMARY KEY,
            content_type VARCHAR(255) NOT NULL,
            age_group VARCHAR(255) NOT NULL
        )`
    
        await pool.query(createChannelsTable)
        console.log("Таблица с каналами создана.")
    
        await pool.query(createTagsTable)
        console.log("Таблица с тэгами создана")
    } catch (error) {
        console.log("Возникла ошибка в createStorageTables : " , error)
    }
}
export default createStorageTables;
