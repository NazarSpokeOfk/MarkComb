import pool from "../db/index.js";

class UserController{
    async getAllUsers(req,res){
        try{
            const users = await pool.query(`SELECT * FROM users`);
            res.json(users.rows)
        } catch(error){
            console.log('Возникла ошибка в getAllUsers :',error)
        }
    }

    async getUserByPassword(req,res){
        const {email,password} = req.body;
        try{
            const user = await pool.query(`SELECT user_id,email,password,username,balance,uses FROM users WHERE email = $1 AND password = $2`,
                [email,password]
            )
            const userId = await user.rows[0].user_id
            const userChannels = await pool.query(`SELECT channel_name FROM purchases_channels WHERE user_id = $1`,[userId])
            // console.log(userChannels.rows)
            if (user.rows.length === 0) {
                return res.status(400).json({ message: "Ошибка! Неверный пароль или пользователь не найден." });
            }
            res.json({ message: "Успешный вход", user: user.rows[0] , channels : userChannels.rows });
        } catch (error) {
            console.log('Возникла ошибка в getUserById:',error)
            res.status(500).json({message : "Возникла ошибка при входе", error : error.message})
        }
    }

    async addUser(req,res){
        const {email,password,username} = req.body;
        try{
            const addUser = await pool.query(`INSERT INTO users(email,password,username) VALUES ($1,$2,$3) RETURNING *`,
                [email,password,username]
            );
            res.json(addUser.rows[0])
        } catch (error) {
            console.log('Возникла ошибка в addUser:',error)
            res.status(500).json({message : "Ошибка добавления пользователя", error : error.message})
        }
    }

    async updateUser(req, res) {
        const id = parseInt(req.params.id, 10);
        const { email, password, username , balance } = req.body;
    
        try {
            const updateUser = await pool.query(
                `UPDATE users SET email = $1, username = $2 , balance = $5 
                 WHERE user_id = $3 AND password = $4 
                 RETURNING *`,
                [email,username, id, password , balance]
            );
    
            if (updateUser.rows.length === 0) {
                return res.status(400).json({ message: "Ошибка! Неверный пароль или пользователь не найден." });
            }
    
            res.json({ message: "Данные пользователя успешно обновлены", user: updateUser.rows[0] });
        } catch (error) {
            console.log("Возникла ошибка в updateUser:", error);
            res.status(500).json({ message: "Ошибка изменения пользователя", error: error.message });
        }
    }
    

    async deleteUser(req,res){
        const id = parseInt(req.params.id,10);
        const {password} = req.body;
        try{
            const user = await pool.query(`DELETE FROM users WHERE user_id = $1 AND password = $2 RETURNING *`,
                [id,password]
            );

            if(user.rows.length === 0){
                return res.status(401).json({message: "Ошибка! Пользователь не был удален, возможно неправильный пароль."})
            }
            res.json({message : "Пользователь был удален", user : user.rows[0]})
            res.json(user.rows[0])
        } catch (error){
            console.log('Возникла ошибка в deleteUser:',error)
        }
    }

    async addUses(req, res) {
        const { id } = req.params;
        const { password, uses } = req.body; 
        const costPerUse = 10; 
    
        try {
           
            const userCheck = await pool.query(
                `SELECT * FROM users WHERE user_id = $1 AND password = $2`,
                [id, password]
            );
    
            if (userCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Пользователь не найден или пароль неверный' });
            }
    
            const user = userCheck.rows[0];
            const totalCost = uses * costPerUse; 
    
            
            if (user.balance < totalCost) {
                return res.status(402).json({ message: 'Недостаточно средств на балансе' });
            }
    
           
            const updateUser = await pool.query(
                `UPDATE users 
                 SET uses = uses + $1, balance = balance - $2 
                 WHERE user_id = $3 
                 RETURNING *`,
                [uses, totalCost, id]
            );
    
            res.json({
                message: 'Покупка успешно оформлена',
                updatedUser: updateUser.rows[0],
            });
        } catch (error) {
            console.log('Возникла ошибка в addPurchase:', error);
            res.status(500).json({ message: 'Ошибка сервера', error: error.message });
        }
    }
    
}

export default UserController