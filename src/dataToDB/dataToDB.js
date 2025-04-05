class DataToDB {
  constructor(setIsLoggedIn, setUserData, setIsModalOpened, setCsrfToken) {
    this.setIsLoggedIn = setIsLoggedIn;
    this.setUserData = setUserData;
    this.setIsModalOpened = setIsModalOpened;
    this.setCsrfToken = setCsrfToken;
    this.apiUrl = "c";
    this.localApiUrl = "http://localhost:5001/api";
  }

  makePurchaseForm = {
    uses: "",
    thumbnail: "",
    email: "",
    channelName: "",
  };

  async fetchData(endpoint, method, body = null, csrfToken = "") {
    const headers = { "Content-Type": "application/json" };
    if (csrfToken) headers["X-CSRF-TOKEN"] = csrfToken;
    
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    if (method !== "GET") options.credentials = "include";

    try {
      const response = await fetch(endpoint, options);
      return response.ok ? await response.json() : Promise.reject(response);
    } catch (error) {
      console.error(`Ошибка запроса (${method} ${endpoint}):`, error);
      return Promise.reject(error);
    }
  }

  deletePurchaseData(channelName, userId, csrfToken) {
    return this.fetchData(`${this.apiUrl}/rmpurchase/${userId}`, "DELETE", { channelName }, csrfToken);
  }

  async validatePurchaseData(data, userId, csrfToken) {
    try {
      const result = await this.fetchData(`${this.apiUrl}/purchase/${userId}`, "POST", data, csrfToken);
      this.setUserData((prevData) => ({ ...prevData, channels: [...prevData.channels, result.purchase] }));
      console.log("Успешная покупка!", result);
    } catch {
      console.log("Ошибка при покупке данных. Возможно, недостаточно использований на балансе.");
    }
  }

  async validateSignIn(data, setCsrfToken) {
    try {
      const result = await this.fetchData(`${this.apiUrl}/user`, "POST", { data });
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
      const result = await this.fetchData(`${this.apiUrl}/login`, "POST", data);
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
      const result = await this.fetchData(`${this.apiUrl}/update/${data.user_id}`, "PUT", data);
      this.setUserData(result);
      return { message: true };
    } catch {
      console.log("Не удалось изменить данные аккаунта.");
    }
  }

  deleteProfile(userId, csrfToken) {
    return this.fetchData(`${this.apiUrl}/user/${userId}`, "DELETE", {}, csrfToken)
      .then(() => {
        this.setIsLoggedIn(false);
        this.setUserData({});
        return { message: true };
      })
      .catch(() => ({ message: false }));
  }

  isVerificationCodeCorrect(email, verificationCode) {
    return this.fetchData(`${this.apiUrl}/checkCode`, "POST", { email, verification_code: verificationCode })
      .then(() => ({ message: true }))
      .catch(() => ({ message: false }));
  }

  changePassword(newPassword, email) {
    return this.fetchData(`${this.apiUrl}/changePassword`, "PUT", { newPassword, email })
      .then(() => ({ message: true }))
      .catch(() => ({ message: false }));
  }

  activatePromocode(promocode, email) {
    return this.fetchData(`${this.apiUrl}/promocode`, "PUT", { promocode, email })
      .then((response) => {return response});
  }
}

export default DataToDB;
