const apiBaseUrl = import.meta.env.VITE_API_URL;

import { FilterFetchesProps } from "../types/types";

const manageFiltersFetch = async ({
  content_type,
  setChannelData,
  ageGroup,
  minSubs,
  maxSubs,
  setIsFiltersFetching,
}: FilterFetchesProps) => {

  try {
    let response;
    response = await fetch(`${apiBaseUrl}/filter`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify({ ageGroup, minSubs, maxSubs, content_type }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const result = await response.json();
    if (result?.data) {
      console.log("result : ",result.data)
      setChannelData(result.data);
      setIsFiltersFetching(false);
    } else {
      console.error("Возникла ошибка в contentTypeFilter", result);
      setIsFiltersFetching(false);
      return false;
    }
  } catch (error) {
    console.error("Возникла ошибка в contentTypeFilter : ", error);
  }
};
export default manageFiltersFetch;
