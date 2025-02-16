const manageFiltersFetch = async (
  operationType,
  ContentType,
  setSimilarChannelData,
  Audience
) => {
  try {
    let response;
    if (operationType === "content") {
      response = await fetch(
        `http://localhost:5001/api/contenttype/${ContentType}`,
        {
          method: "GET",
        }
      );
    } else {
      response = await fetch(`http://localhost:5001/api/audience`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ Audience }),
      });
    }

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const result = await response.json();
    if (result?.status) {
      console.log("Получены данные с бэка : ", result);
      setSimilarChannelData(result);
    } else {
      console.error("Возникла ошибка в contentTypeFilter");
      return false;
    }
  } catch (error) {
    console.error("Возникла ошибка в contentTypeFilter : ", error);
  }
};
export default manageFiltersFetch;
