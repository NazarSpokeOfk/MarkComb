import getEmailModule from "../modules/getEmailModule.js";
import logger from "../winston/winston.js";

export const getEmail = async (channelId) => {
  const { channelId } = req.body;

  try {
    const getDataRequest = await getEmailModule(channelId);

    return getDataRequest
  } catch (error) {
    logger.error("Возникла ошибка в getDataController : ", error);
    throw new Error("Error getting email")
  }
};