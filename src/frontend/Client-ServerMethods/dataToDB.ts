/// <reference types="vite/client" />

import { handleHttpError } from "../utilities/errorHandler";

const apiBaseUrl = import.meta.env.VITE_API_URL;

import { LogInData , ChangedData } from "../interfaces/interfaces";

import { defaultUserData } from "../types/types";

import {toast} from "react-toastify"

import i18n from "i18next";

import {
  VideoData,
  DataToDBParams,
  PurchaseData,
  UserData,
} from "../interfaces/interfaces";

class DataToDB {
  setIsLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>
  setUserData?: React.Dispatch<React.SetStateAction<UserData>>
  setIsModalOpened?: React.Dispatch<React.SetStateAction<boolean>>
  setVideoData?: React.Dispatch<React.SetStateAction<VideoData>>;

  constructor(params: DataToDBParams = {}) {
    Object.assign(this, params);
  }

  makePurchaseForm = {
    uses: "",
    thumbnail: "",
    email: "",
    channelName: "",
  };

  async fetchData(
    endpoint: string,
    method: string,
    body: any = null,
    csrfToken: string = ""
  ) {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_API_KEY,
      "x-csrf-token" : ""
    };
    if (csrfToken) headers["x-csrf-token"] = csrfToken;

    const options: RequestInit = { method, headers, credentials: "include" };
    if (body) options.body = JSON.stringify(body);

    try {
      const response = await fetch(endpoint, options);

      if (!response.ok) {
        console.log(response);
        handleHttpError(response);
        return Promise.reject(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`Ошибка запроса (${method} ${endpoint}):`, error);
      return Promise.reject(error);
    }
  }

  deletePurchaseData(channelName: string, userId: number, csrfToken: string) {
    return this.fetchData(
      `${apiBaseUrl}/rmpurchase/${userId}`,
      "DELETE",
      { channelName },
      csrfToken
    );
  }

  async getEmail(csrfToken: string, channelId: string) {
    console.log("Поступившие данные : ", channelId, csrfToken);
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

      return response;
    } catch (error) {
      return { message: error, status: false };
    }
  }

  async validatePurchaseData(
    data: PurchaseData,
    userId: number,
    csrfToken: string
  ) {
    console.log("Дата в validatePurchaseData : ", data,csrfToken);
    if (!data.email) {
      return;
    }
    try {
      const result = await this.fetchData(
        `${apiBaseUrl}/purchase/${userId}`,
        "POST",
        data,
        csrfToken
      );
      this.setUserData?.((prevData: UserData) => ({
        ...prevData,
        channels: [...prevData.channels, result.purchase],
        userInformation: {
          ...prevData.userInformation,
          uses: prevData.userInformation.uses - 1,
        },
      }));
    } catch (error) {
      console.log("Ошибка : ", error);
    }
  }

  async validateSignIn(
    data: object,
  ): Promise<{ status: "ok" | "invalid" | "exists" | "wrong"  }> {
    try {
      const result = await this.fetchData(`${apiBaseUrl}/user`, "POST", {
        data,
      });
      console.log("ГОВНО")
      if (result.status === "ok") {
        this.setIsLoggedIn?.(true);
        this.setUserData?.(result);
        return { status: "ok" };
      } else if (result.status === "exists") {
        return { status: "exists" };
      } else if(result.status === "Wrong code") {
        console.log(result.status)
        return { status : "wrong"}
      } else {
        return { status : "exists"}
      }
    } catch {
      this.setIsLoggedIn?.(false);
      return { status: "invalid" };
    }
  }

  async validateLogIn(data: LogInData) {
    try {
      const result = await this.fetchData(`${apiBaseUrl}/login`, "POST", data);
      this.setIsLoggedIn?.(true);
      this.setUserData?.(result);
      return { message: true };
    } catch {
      this.setIsLoggedIn?.(false);
      return { message: false };
    }
  }

  async updateData(data : ChangedData) {
    try {
      const result = await this.fetchData(
        `${apiBaseUrl}/update/${data.user_id}`,
        "PUT",
        data
      );
      this.setUserData?.(result);
      return { message: true };
    } catch {
      console.log("Не удалось изменить данные аккаунта.");
      return { message: false };
    }
  }

  async deleteProfile(userId: number, csrfToken: string) {
    console.log("Токен в dataToDB:", csrfToken);
    console.log("ID пользователя в deleteProfile:", userId);

    return this.fetchData(
      `${apiBaseUrl}/user/${userId}`,
      "DELETE",
       {operationCode : 1},
       csrfToken
    )
      .then(() => {
        this.setIsLoggedIn?.(false);
        this.setUserData?.(defaultUserData);
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

  async makeFetchForCode (email : string) {
    try {
      const result = await fetch(`${apiBaseUrl}/verification`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ email }),
      });
      if (result.ok) {
        return Promise.resolve();
      } else {
        console.log(result);
      }
    } catch (error) {
      toast.error(i18n.t("There was an error during sending verification code"))
    }
  };


  isVerificationCodeCorrect(email: string, verificationCode: string) {
    return this.fetchData(`${apiBaseUrl}/checkCode`, "POST", {
      email,
      verification_code: verificationCode,
    })
      .then(() => ({ message: true }))
      .catch(() => ({ message: false }));
  }

  changePassword(newPassword: string, email: string) {
    if(newPassword.length < 0){
      Promise.reject("Password cannot be empty")
    }
    return this.fetchData(`${apiBaseUrl}/changePassword`, "PUT", {
      newPassword,
      email,
    })
      .then(() => ({ message: true }))
      .catch(() => ({ message: false }));
  }

  activatePromocode(promocode: string, email: string) {
    return this.fetchData(`${apiBaseUrl}/promocode`, "PUT", {
      promocode,
      email,
    }).then((response) => {
      return response;
    });
  }

  async payment(user_id: number, packageId: number, userEmail: string) {
    console.log(packageId, user_id, userEmail);
    return this.fetchData(`${apiBaseUrl}/payment`, "POST", {
      user_id,
      packageId,
      userEmail,
    }).then((response) => {
      console.log("респонс в payment методе :", response);
      return response;
    });
  }

  async makeVote(featureName: string, user_id: number) {
    return this.fetchData(`${apiBaseUrl}/vote`, "POST", {
      featureName,
      user_id,
    })
      .then(() => ({ message: true }))
      .catch(() => ({ message: false }));
  }

  async logOut() {
    await this.fetchData(`${apiBaseUrl}/logout`, "GET", null);
  }

  async addReview(reviewText: string, websiteMark: number) {
    return this.fetchData(`${apiBaseUrl}/review`, "POST", {
      reviewText,
      websiteMark,
    })
      .then(() => ({ message: true }))
      .catch(() => ({ message: false }));
  }

  async checkStatisticsOfVideo(
    type : string,
    channelName : string,
    inputValue : string,
    videoId : string | null
    ) {

    const bodyData = {
      channelName : channelName,
      inputValue : inputValue,
      videoId : videoId
    }

    try {
      const response = await this.fetchData(
        `${apiBaseUrl}/${type}`,
        "POST",
        bodyData
      );

      const finalVideoData = response?.finalVideoData;

      if (finalVideoData) {
        this.setVideoData?.(finalVideoData);
      } else {
        const analitics = response?.analitics;
        this.setVideoData?.((prevData) => ({
          ...prevData,
          analitics,
        }));
      }
    } catch (error) {
      console.log("Возникла ошибка при поиске аналитики : ", error);
    }
  }
}

export default DataToDB;
