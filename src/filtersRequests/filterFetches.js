const apiBaseUrl = import.meta.env.VITE_API_URL;

const manageFiltersFetch = async (
  content_type,
  setSimilarChannelData,
  age_group,
  minsubs,
  maxsubs,
  setIsFiltersFetching
) => {
  console.log(
    "Данные которые приходят в filterFetches : ",
    content_type,
    age_group,
    minsubs,
    maxsubs 
  );

  try {
    let response;
    response = await fetch(`${apiBaseUrl}/filter`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify({ age_group, minsubs, maxsubs, content_type }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const result = await response.json();
    if (result?.status) {
      setSimilarChannelData(result);
      setIsFiltersFetching(false)
    } else {
      console.error("Возникла ошибка в contentTypeFilter", result);
      setIsFiltersFetching(false)
      return false;
    }
  } catch (error) {
    console.error("Возникла ошибка в contentTypeFilter : ", error);
  }
};
export default manageFiltersFetch;
