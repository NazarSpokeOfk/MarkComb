import pool from "../db/index.js";

class PurchasesController {
  async getPurchases(req, res) {
    const  id  = req.params.id; //Возможна ошибка из за фигурных скобок
    try {
      const purchases = await pool.query(
        `SELECT * FROM purchases_channels WHERE user_id = $1`,
        [id]
      );
      if(purchases.rows.length === 0){
        res.status(404).json({message:"Не удалось получить покупки пользователя"})
      }
      res.json(purchases.rows[0]);
    } catch (error) {
      console.log("Возникла ошибка в getPurchases:", error);
    }
  }

  async addPurchase(req, res) {
    const { id } = req.params; // Получаем id пользователя из параметров
    const { uses } = req.body; // Получаем количество "использований" из тела запроса
    const { thumbnail, email, channel_name } = req.body;
  
    try {
      
      const userCheck = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [id]);
      if (userCheck.rows.length === 0) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
  
      const user = userCheck.rows[0];
  
      
      if (user.uses < uses) {
        return res.status(402).json({ message: "Недостаточно использований на балансе!" });
      }
  
     
      const updateUses = await pool.query(
        `UPDATE users SET uses = uses - $1 WHERE user_id = $2 RETURNING *`,
        [uses, id]
      );
  
      
      const purchase = await pool.query(
        `INSERT INTO purchases_channels (user_id, thumbnail, email, channel_name) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [id, thumbnail, email, channel_name]
      );
  
      
      res.json({
        message: "Вы успешно приобрели данные ютубера",
        purchase: purchase.rows[0],
        remainingUses: updateUses.rows[0].uses,
      });
    } catch (error) {
      console.log("Возникла ошибка в addPurchase", error);
      res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
  }
  

  async deletePurchase(req, res) {
    const {channelName} = req.body;
    const id = req.params.id
    try {
      const deleteOperation = await pool.query(
        `DELETE FROM purchases_channels WHERE user_id = $1 AND channel_name = $2 RETURNING *`,
        [id, channelName]
      );
      if(deleteOperation.rows.length === 0){
        res.status(400).json({message:"Возникла ошибка в удалении покупки."})
      }
      res.json(deleteOperation.rows[0]);
    } catch (error) {
      console.log("Ошибка в deletePurchase : ", error);
    }
  }
}

export default PurchasesController;
