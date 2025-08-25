import mainPool from "../../db/mk/index.js";

class VoteController {
  async makeVote(req, res) {
    const { featureName, user_id } = req.body;

    try {
      const addVote = await mainPool.query(
        "INSERT INTO votes (user_id,feature_name) VALUES ($1,$2) RETURNING *",
        [user_id, featureName]
      );

      if (addVote.rows.length > 0) {
        return res
          .status(200)
          .json({ message: "vote has been delivered", status: true });
      } else {
        return res
          .status(500)
          .json({ message: "vote has't been delivered", status: false });
      }
    } catch (error) {
      console.log("Возникла ошибка при добавлении голоса : ", error);
      return res.status(500).json({message : "server error", status : false})
    }
  }
}
export default VoteController;
