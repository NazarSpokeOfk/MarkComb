/// <reference types="vite/client" />

import { handleHttpError } from "../utilities/errorHandler";

const apiBaseUrl = import.meta.env.VITE_API_URL;

import {
  defaultUserData,
  FetchDataToDBProps,
  DeletePurchaseData,
  GetEmailProps,
  ValidatePurchaseDataProps,
  ValidateSignInProps,
  UpdateDataProps,
  MakeFetchForCodeDBProps,
  IsVerificationCodeCorrectProps,
  ChangePasswordProps,
  ActivatePromocodeProps,
  PaymentProps,
  MakeVoteProps,
  AddReviewProps,
  CheckStatisticsOfVideoProps,
} from "../types/types";

import { RegistrationStatusKey } from "../interfaces/interfaces";

import { toast } from "react-toastify";

import i18n from "i18next";

import { VideoData, DataToDBParams, UserData } from "../interfaces/interfaces";

import { ValidateLogInProps } from "../types/types";

class DataToDB {
  setIsLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData?: React.Dispatch<React.SetStateAction<UserData>>;
  setIsModalOpened?: React.Dispatch<React.SetStateAction<boolean>>;
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

  async fetchData({
    endpoint,
    method,
    body,
    csrfToken,
    withToast,
  }: FetchDataToDBProps) {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_API_KEY,
      "x-csrf-token": csrfToken || "",
    };

    const fetchPromise = (async () => {
      const response = await fetch(endpoint, {
        method,
        headers,
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        handleHttpError(response);
        throw response;
      }

      return await response.json();
    })();

    if (withToast) {
      return toast.promise(fetchPromise, {
        pending: i18n.t("Загрузка..."),
        success: i18n.t("Успешно!"),
        error: i18n.t("Ошибка запроса"),
      });
    } else {
      return fetchPromise;
    }
  }

  deletePurchaseData({ channelName, userId, csrfToken }: DeletePurchaseData) {
    return this.fetchData({
      endpoint: `${apiBaseUrl}/rmpurchase/${userId}`,
      method: "DELETE",
      body: { channelName },
      csrfToken,
      withToast: false,
    });
  }

  async getEmail({
    csrfToken,
    channelId,
    setContactDataStatus,
  }: GetEmailProps) {
    try {
      const result = await this.fetchData({
        endpoint: `${apiBaseUrl}/getemail`,
        method: "POST",
        body: { channelId },
        csrfToken,
        withToast: false,
      });
      return result.data;
    } catch (error) {
      return { message: error, status: false };
    }
  }

  async validatePurchaseData({
    data,
    userId,
    csrfToken,
    setError,
    setContactDataStatus,
  }: ValidatePurchaseDataProps) {
    if (!data.email) {
      return;
    }
    try {
      const result = await this.fetchData({
        endpoint: `${apiBaseUrl}/purchase/${userId}`,
        method: "POST",
        body: data,
        csrfToken,
      });
      if (result.success) {
        setContactDataStatus("success");
      }
      console.log(result);
      this.setUserData?.((prevData: UserData) => ({
        ...prevData,
        channels: [...prevData.channels, result.data.purchase],
        userInformation: {
          ...prevData.userInformation,
          uses: prevData.userInformation.uses - 1,
        },
      }));
    } catch (error) {
      setError("You already bought this data");
    }
  }

  async validateSignIn({ data }: ValidateSignInProps): Promise<{
    status: "ok" | "invalid" | "exists" | "wrong";
  }> {
    console.log("Дата в validateSignIn : ", data);
    try {
      const result = await this.fetchData({
        endpoint: `${apiBaseUrl}/user`,
        method: "POST",
        body: {
          data,
        },
      });
      console.log("Результат регистрации : ", result);
      if (result.success) {
        this.setIsLoggedIn?.(true);
        this.setUserData?.(result.data);
        return { status: "ok" };
      }
      return { status: "wrong" };
    } catch (error) {
      console.log(error);
      this.setIsLoggedIn?.(false);
      return { status: "invalid" };
    }
  }

  async validateLogIn({
    data,
    setUserData,
    setIsLoggedIn,
  }: ValidateLogInProps) {
    console.log(setIsLoggedIn);
    try {
      const request = await this.fetchData({
        endpoint: `${apiBaseUrl}/login`,
        method: "POST",
        body: data,
      });
      if(request.data){
        setIsLoggedIn(true);
        setUserData?.(request.data);
        return true
      } else {
        setIsLoggedIn(false);
        return false
      }
    } catch (error) {
      console.log(error);
      setIsLoggedIn?.(false);
      return false;
    }
  }

  async updateData({ data }: UpdateDataProps) {
    try {
      const result = await this.fetchData({
        endpoint: `${apiBaseUrl}/update/${data.user_id}`,
        method: "PUT",
        body: data,
        withToast: false,
      });
      //баг с csrfToken, с сервера он не приходит, и стейт перезаписывает его на null
      console.log("updateData result : ",result)
      this.setUserData?.(result.data);
      return { message: "Username was changed", status: true };
    } catch {
      console.log("Не удалось изменить данные аккаунта.");
      return { message: "Username wasn't changed", status: true };
    }
  }

  async deleteUser( token : string) {
    try {
      const response = await this.fetchData({
        endpoint : `${apiBaseUrl}/delete`,
        method : "DELETE",
        body : { token },
        withToast : false
      })
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async makeFetchForCode({
    email,
    isRegistration = false,
    setRegistrationStatus,
    setStep,
    operationCode,
    action,
    userId
  }: MakeFetchForCodeDBProps): Promise<void> {
    try {
      const response = await fetch(`${apiBaseUrl}/verification/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ email, userId }),
      });

      const data = await response.json();

      // Обработка ошибок
      if (isRegistration) {
        console.log(data)
        if (data.data.isUserExists) {
          setRegistrationStatus?.("exists");
          setStep?.(6);
          return;
        }
      }

    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      setRegistrationStatus?.("wrong");
    }
  }

  async changePassword({ newPassword, token }: ChangePasswordProps) {
    return this.fetchData({
      endpoint: `${apiBaseUrl}/reset`,
      method: "PUT",
      body: {
        newPassword,
        token,
      },
      withToast: false,
    })
  }

  async isVerificationCodeCorrect({
    email,
    verificationCode,
  }: IsVerificationCodeCorrectProps) {
    return this.fetchData({
      endpoint: `${apiBaseUrl}/checkCode`,
      method: "POST",
      body: {
        email,
        verification_code: verificationCode,
      },
      withToast: false,
    })
      .then(() => ({ message: true }))
      .catch(() => ({ message: false }));
  }

  async activatePromocode({ promocode, email }: ActivatePromocodeProps) {
    return this.fetchData({
      endpoint: `${apiBaseUrl}/promocode`,
      method: "PUT",
      body: {
        promocode,
        email,
      },
      withToast: false,
    }).then((response) => {
      return response;
    });
  }

  async payment({ user_id, packageId, userEmail }: PaymentProps) {
    return this.fetchData({
      endpoint: `${apiBaseUrl}/payment`,
      method: "POST",
      body: {
        user_id,
        packageId,
        userEmail,
      },
    }).then((response) => {
      console.log("респонс в payment методе :", response);
      return response;
    });
  }

  async makeVote({ featureName, user_id }: MakeVoteProps) {
    return this.fetchData({
      endpoint: `${apiBaseUrl}/vote`,
      method: "POST",
      body: {
        featureName,
        user_id,
      },
      withToast: true,
    })
      .then(() => ({ message: true }))
      .catch(() => ({ message: false }));
  }

  async logOut() {
    await this.fetchData({
      endpoint: `${apiBaseUrl}/logout`,
      method: "GET",
      body: null,
    });
  }

  async addReview({ reviewText, websiteMark }: AddReviewProps) {
    return this.fetchData({
      endpoint: `${apiBaseUrl}/review`,
      method: "POST",
      body: {
        reviewText,
        websiteMark,
      },
    })
      .then(() => ({ message: true }))
      .catch(() => ({ message: false }));
  }

  async checkStatisticsOfVideo({
    type,
    channelName,
    inputValue,
    videoId,
    setIsLoading,
  }: CheckStatisticsOfVideoProps) {
    console.log(`${apiBaseUrl}/${type}`);

    try {
      const response = await this.fetchData({
        endpoint: `${apiBaseUrl}/${type}`,
        method: "POST",
        body: { channel_name: channelName, videoName: inputValue },
        withToast: false,
      });

      console.log(response);

      setIsLoading(false);
      this.setVideoData?.(response.data.analiticsAndData);
    } catch (error) {
      console.log("Возникла ошибка при поиске аналитики : ", error);
    }
  }
}

export default DataToDB;
