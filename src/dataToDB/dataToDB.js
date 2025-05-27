import { handleHttpError } from "../errorHandler/errorHandler";
const apiBaseUrl = import.meta.env.VITE_API_URL;

class DataToDB {
  constructor(setIsLoggedIn, setUserData, setIsModalOpened, setCsrfToken) {
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

  async fetchData(endpoint, method, body = null, csrfToken = "") {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_API_KEY,
    };
    if (csrfToken) headers["x-csrf-token"] = csrfToken;

    const options = { method, headers, credentials: "include" };
    if (body) options.body = JSON.stringify(body);
    
    try {
      const response = await fetch(endpoint, options);
  
      if (!response.ok) {
        handleHttpError(response);
        return Promise.reject(response);
      }
  
      return await response.json();
    } catch (error) {
      console.error(`Ошибка запроса (${method} ${endpoint}):`, error);
      return Promise.reject(error);
    }
  }

  deletePurchaseData(channelName, userId, csrfToken) {
    return this.fetchData(
      `${apiBaseUrl}/rmpurchase/${userId}`,
      "DELETE",
      { channelName },
      csrfToken
    );
  }

  async getEmail (csrfToken,channelId) {
    console.log("Поступившие данные : " ,channelId,csrfToken)
    try {
      const result = await fetch(`${apiBaseUrl}/getemail`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          "x-csrf-token": csrfToken,
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ channelId }),
      });
      const response = await result.json();

      return response

    } catch (error) {
      return { message : error,status: false };
    }
  }

  async validatePurchaseData(data, userId, csrfToken, uses) {
    console.log("Дата в validatePurchaseData : ", data);
    if (!data.email) {
      return;
    }
    try {
      const result = await this.fetchData(
        `${apiBaseUrl}/purchase/${userId}`,
        "POST",
        data,
        csrfToken,
        uses
      );
      this.setUserData((prevData) => ({
        ...prevData,
        channels: [...prevData.channels, result.purchase],
        user: {
          ...prevData.user,
          uses: prevData.userInformation.uses - 1,
        },
      }));
    } catch (error) {
      console.log("Ошибка : ", error);
    }
  }

  async validateSignIn(data, setCsrfToken) {
    try {
      const result = await this.fetchData(`${apiBaseUrl}/user`, "POST", {
        data,
      });
      console.log(result)
      this.setIsLoggedIn(true);
      this.setUserData(result);
      setCsrfToken(result.csrfToken);
      return { status: true };
    } catch {
      this.setIsLoggedIn(false);
      return { status: "already" };
    }
  }

  async validateLogIn(data) {
    try {
      const result = await this.fetchData(
        `${apiBaseUrl}/login`,
        "POST",
        data
      );
      this.setIsLoggedIn(true);
      this.setUserData(result);
      this.setCsrfToken(result.csrfToken);
      return { message: true };
    } catch {
      this.setIsLoggedIn(false);
      return { message: false };
    }
  }

  async updateData(data) {
    try {
      const result = await this.fetchData(
        `${apiBaseUrl}/update/${data.user_id}`,
        "PUT",
        data
      );
      this.setUserData(result);
      return { message: true };
    } catch {
      console.log("Не удалось изменить данные аккаунта.");
      return { message: false };
    }
  }

  async deleteProfile(userId, csrfToken) {
    console.log("Токен в dataToDB:", csrfToken);
    console.log("ID пользователя в deleteProfile:", userId);

    return this.fetchData(
      `${apiBaseUrl}/user/${userId}`,
      "DELETE",
      null,
      csrfToken
    )
      .then(() => {
        this.setIsLoggedIn(false);
        this.setUserData({});
        return { message: true };
      })
      .catch(async (error) => {
        try {
          const errData = await error.json?.();
          return { message: errData?.message || "Unknown error" };
        } catch (e) {
          return { message: "Unknown error" };
        }
      });
  }

  isVerificationCodeCorrect(email, verificationCode) {
    return this.fetchData(`${apiBaseUrl}/checkCode`, "POST", {
      email,
      verification_code: verificationCode,
    })
      .then(() => ({ message: true }))
      .catch(() => ({ message: false }));
  }

  changePassword(newPassword, email) {
    return this.fetchData(`${apiBaseUrl}/changePassword`, "PUT", {
      newPassword,
      email,
    })
      .then(() => ({ message: true }))
      .catch(() => ({ message: false }));
  }

  activatePromocode(promocode, email) {
    return this.fetchData(`${apiBaseUrl}/promocode`, "PUT", {
      promocode,
      email,
    }).then((response) => {
      return response;
    });
  }

  async payment (user_id,packageId,userEmail) {
    console.log(packageId,user_id,userEmail)
    return this.fetchData(`${apiBaseUrl}/payment`, "POST" , {
      user_id,
      packageId,
      userEmail
    }).then((response) => {
      console.log("респонс в payment методе :",response)
      return response;
    })
  }

  async makeVote(featureName, user_id) {
    return this.fetchData(`${apiBaseUrl}/vote`, "POST", {
      featureName,
      user_id,
    })
      .then(() => ({ message: true }))
      .catch(() => ({ message: false }));
  }

  async logOut () {
    return this.fetchData(`${apiBaseUrl}/logout`,"GET")
  }
}

export default DataToDB;
