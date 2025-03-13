const GetData  = async (req,res) =>{
    const {channelId} = req.body;
    const apiKey = process.env.GOOGLE_API_KEY;

    const transformDescr = (result) =>{
        return{
            description: result.snippet.description
        }
    }

    const descrUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
    const response = await fetch(descrUrl);
    let jResponse = await response.json();
    const processRes = Array.isArray(jResponse?.items) ? jResponse.items.map(transformDescr) : [];

    // Теперь извлекаем описания, например, если processRes не пустой, берем первое описание
    const description = processRes.length > 0 ? processRes[0].description : '';


    res.json(extractEmail(description)); // Возвращаем результат
}

function extractEmail(text) {
    const emails = [];
    let atIndex = text.indexOf("@");

    while (atIndex !== -1) {
        let start = atIndex - 1;
        let end = atIndex + 1;

        // Проходим влево от @
        while (start >= 0 && !/\s/.test(text[start]) && start >= atIndex - 63) {
            start--;
        }
        start++;

        // Проходим вправо от @
        while (end < text.length && !/\s/.test(text[end])) {
            end++;
        }

        // Потенциальный email
        const candidate = text.slice(start, end);

        // Проверяем с помощью регулярного выражения
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(candidate)) {
            emails.push(candidate);
        }

        // Ищем следующий @
        atIndex = text.indexOf("@", atIndex + 1);
    }

    return emails;
}

export default GetData;
