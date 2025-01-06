class DataToDB {
    constructor(setIsLoggedIn,setUserData) {
      this.setIsLoggedIn = setIsLoggedIn; 
      this.setUserData = setUserData;
    }
  
    makePurchaseForm = {
      uses: "",
      thumbnail: "",
      email: "",
      channelName: "",
    };
  
    async deletePurchaseData(channelName, user_id) {
        console.log("Данные для удаления:", channelName, user_id);
        try {
            const response = await fetch(`http://localhost:5001/api/rmpurchase/${user_id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ channelName: channelName })  // Передаем как объект в JSON
            });
    
            if (response.ok) {
                return Promise.resolve()
            } else {
                return Promise.reject()
            }
        } catch (error) {
            console.log('Ошибка!', error);
        }
    }
    
    
    async validatePurchaseData(data,user_id){
        try {
            console.log("ID пользователя, переданный в validatePurchaseData:",user_id)
            console.log("Данные, переданные в validatePurchaseData:",data)
            const response = await fetch(`http://localhost:5001/api/purchase/${user_id}`, {
                method : "POST",
                headers : {
                    "Content-type":"application/json"
                },
                body : JSON.stringify(data)
            })
            if(response.ok){
                const result = await response.json()
                console.log('Успешная покупка!', result)
            } else {
                console.log('Возникла ошибка при покупке данных. Возможно, недостаточно использований на балансе.')
            }
        } catch (error) {
            console.log("Возникла ошибка при покупке данных.",error)
        }
    }

    async validateLogIn(data , closeModal) {
            try{
                const response = await fetch(`http://localhost:5001/api/login` , {
                    method : "POST",
                    headers : {
                        "Content-type":"application/json"
                    },
                    body : JSON.stringify(data)
                })

                if(response.ok){
                    const result = await response.json()
                    console.log("Успешный вход!",result)
                    this.setIsLoggedIn(true);
                    this.setUserData(result)
                    closeModal()
                } else {
                    this.setIsLoggedIn(false); 
                    console.log('Не удалось войти в аккаунт. Возможно неправильный пароль или email')
                }
            } 
            catch (error) {
                console.log("Возникла ошибка при входе:",error)
            }
      }
    }
  export default DataToDB;
  