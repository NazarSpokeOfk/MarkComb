import mainPool from "../db/mk/index.js";
import logger from "../winston/winston.js";
export const makeVote = async (featureName, user_id) => {
  try {
    const addVote = await mainPool.query(
      "INSERT INTO votes (user_id,feature_name) VALUES ($1,$2) RETURNING *",
      [user_id, featureName]
    );

    if (addVote.rows.length > 0) {
      return true;
    } else {
      throw new Error("Your vote was not delivered");
    }
  } catch (error) {
    logger.error("Возникла ошибка при добавлении голоса : ", error);
    throw new Error("Server error");
  }
};
