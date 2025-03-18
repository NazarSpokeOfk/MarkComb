
class DataToDB {
  constructor(setIsLoggedIn, setUserData, setIsModalOpened , setCsrfToken) {
    this.setIsLoggedIn = setIsLoggedIn;
    this.setUserData = setUserData; 
    this.setIsModalOpened = setIsModalOpened;
    this.setCsrfToken = setCsrfToken;
  }

  makePurchaseForm = {
    uses: "",
    thumbnail: "",
    email: "",
    channelName: "",
  };

  async deletePurchaseData(channelName, user_id , csrfToken) {
    console.log("Данные для удаления:", channelName, user_id);
    try {
      const response = await fetch(
        `https://markcomb.com/api/rmpurchase/${user_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            'X-CSRF-TOKEN': csrfToken
          },
          body: JSON.stringify({ channelName: channelName }), // Передаем как объект в JSON
        }
      );

      if (response.ok) {
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    } catch (error) {
      console.log("Ошибка!", error);
    }
  }

  async validatePurchaseData(data, user_id , csrfToken) {
    try {
      console.log(
        "Токен:",csrfToken
      );
      console.log("Данные, переданные в validatePurchaseData:", data);
      const response = await fetch(
        `https://markcomb.com/api/purchase/${user_id}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            'X-CSRF-TOKEN': csrfToken
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        this.setUserData((prevData) => ({
          ...prevData,
          channels: [...prevData.channels, result.purchase],
        }));
        console.log("Успешная покупка!", result);
      } else {
        console.log(
          "Возникла ошибка при покупке данных. Возможно, недостаточно использований на балансе."
        );
      }
    } catch (error) {
      console.log("Возникла ошибка при покупке данных.", error);
    }
  }

  async validateSignIn(data,setCsrfToken) {
    try {
      console.log({ data });
      const response = await fetch("https://markcomb.com/api/user", {
        method: "POST",
        credentials : "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Пользователь создан", result);

        this.setIsLoggedIn(true);
        this.setUserData(result);
        setCsrfToken(result.csrfToken)
        return {status : true}
      } else {
        this.setIsLoggedIn(false);
        console.log("Ошибка при создании пользователя.");
        return response
      }
    } catch (error) {
      console.log("Возникла ошибка при регистрации.", error);
      return {status : "already"};
    }
  }

  async validateLogIn(data) {
    try {
      const response = await fetch(`https://markcomb.com/api/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Успешный вход!", result);
        this.setIsLoggedIn(true);
        this.setUserData(result);
        this.setCsrfToken(result.csrfToken)
        console.log("токен при входе:",result.csrfToken)
        return {message : true}
      } else {
        this.setIsLoggedIn(false);
        console.log(
          "Не удалось войти в аккаунт. Возможно неправильный пароль или email"
        );
        this.setIsLoggedIn(false);
        return {message : false}
      }
    } catch (error) {
      console.log("Возникла ошибка при входе:", error);
      return Promise.reject();
    }
  }

  async updateData(data) {
    console.log('setUserData in updateData:', this.setUserData);
    try {
      const response = await fetch(`https://markcomb.com/api/update/${data.user_id}`,
        {
            method : "PUT",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify(data)
        }
      );

      if(response.ok){
        const result = await response.json()
        this.setUserData(result)
        console.log(result)
        return {message : true}
      } else {
        console.log("Не удалось изменить данные вашего аккаунта.")
      }
    
    } catch (error) {
        console.log("Возникла ошибка в изменении данных профиля:",error)
    }
  }

  async deleteProfile(data,userId,csrfToken){
    console.log("Данные, пришедшие в deleteProfile:",userId,data)
    try{
      const response = await fetch(`https://markcomb.com/api/user/${userId}` , {
        method : "DELETE",
        credentials : "include",
        headers : {
          "Content-type" : "application/json",
          "X-CSRF-TOKEN": csrfToken
        },
        body : JSON.stringify({data})
      })
      console.log("токен при удалении:",csrfToken)
      if(response.ok){
        const result = await response.json()
        this.setIsLoggedIn(false)
        this.setUserData({})
        return {message : true}
      } else {
        return {message : false}
      }
    } catch (error) {
      console.log("Возникла ошибка в deleteProfile:",error)
    }
  }

  async isVerificationCodeCorrect(email,verification_code){
    try {
      const request = await fetch("https://markcomb.com/api/checkCode", {
        method : "POST",
        headers : {
          "Content-type" : "application/json"
        },
        body : JSON.stringify({email,verification_code})
      })
      console.log("Данные при смене пароля : " , email, verification_code)
      if(request.ok){
        return {message : true}
      } else {
        return {message : false}
      }
    } catch (error) {
      console.log("Возникла ошибка в isVerificationCodeCorrect : " , error)
    }
  }

  async changePassword(newPassword,email){
    console.log("Новый пароль, почта : " , newPassword , email)
    try { 
      const request = await fetch("https://markcomb.com/api/changePassword" , {
        method : "PUT",
        headers : {
          "Content-type" : "application/json"
        },
        body : JSON.stringify({newPassword,email})
      })
      console.log("Пароль и почта в changePassword : " , newPassword , email)
  
      if(request.ok){
        return {message : true}
      } else {
        console.log("Данные не были сменены.")
        return {message : false}
      }
    } catch (error) {
      console.log("Возникла ошибка в changePassword :" , error)
    }
  }
}

export default DataToDB;
