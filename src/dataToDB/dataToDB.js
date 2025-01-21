class DataToDB {
    constructor(setIsLoggedIn,setUserData,setIsModalOpened) {
      this.setIsLoggedIn = setIsLoggedIn; 
      this.setUserData = setUserData;
      this.setIsModalOpened = setIsModalOpened
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
                console.log(result)
                this.setUserData((prevData)=>({...prevData, channels : [...prevData.channels,result.purchase]}))
                console.log('Успешная покупка!', result)
            } else {
                console.log('Возникла ошибка при покупке данных. Возможно, недостаточно использований на балансе.')
            }
        } catch (error) {
            console.log("Возникла ошибка при покупке данных.",error)
        }
    }

    async validateSignIn(data){
        try {
            console.log({data})
            const response = await fetch("http://localhost:5001/api/user", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({data}),
            });
            
            if (response.ok) {
              const result = await response.json();
              console.log("Пользователь создан", result);
    
              this.setIsLoggedIn(true)
              this.setUserData(result);
              return Promise.resolve()
            } else {
              this.setIsLoggedIn(false);
              console.log("Ошибка при создании пользователя.");
              return Promise.reject()
            }
          } catch (error) {
            console.log("Возникла ошибка при регистрации.", error);
            return Promise.reject()
          }
    }

    async validateLogIn(data) {
            try{
                const response = await fetch(`http://localhost:5001/api/login` , {
                    method : "POST",
                    credentials : "include",
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
                    return Promise.resolve()
                } else {
                    this.setIsLoggedIn(false); 
                    console.log('Не удалось войти в аккаунт. Возможно неправильный пароль или email')
                    return Promise.reject()
                }
            } 
            catch (error) {
                console.log("Возникла ошибка при входе:",error)
                return Promise.reject()
            }
      }
    }

    
  export default DataToDB;
  