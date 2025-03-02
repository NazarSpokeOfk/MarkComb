const manageFiltersFetch = async (
  content_type,
  setSimilarChannelData,
  age_group,
  minsubs,
  maxsubs
) => {
  try {
    let response;
    response = await fetch(`http://localhost:5001/api/filter`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ age_group, minsubs, maxsubs, content_type }),
    });

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
