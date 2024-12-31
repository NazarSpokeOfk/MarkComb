const GetData  = async (channelId) =>{
    const apiKey = 'AIzaSyAdpuNLLn_Wnq_L4mioZYahKgSDAJdcBC4';

    const transformDescr = (result) =>{
        return{
            description: result.snippet.description
        }
    }

    const descrUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
    const res = await fetch(descrUrl);
    let jRes = await res.json();
    const processRes = Array.isArray(jRes?.items) ? jRes.items.map(transformDescr) : [];

    // Теперь извлекаем описания, например, если processRes не пустой, берем первое описание
    const description = processRes.length > 0 ? processRes[0].description : '';

    console.log(extractEmail(description)); // Передаем строку в extractEmail

    return extractEmail(description); // Возвращаем результат
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
