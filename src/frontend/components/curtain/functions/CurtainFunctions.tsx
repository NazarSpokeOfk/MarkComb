import dataToDB from "../../../Client-ServerMethods/dataToDB";
import { SaveChangesProps, ValidateUserName } from "../../../types/types";

class CurtainFunctions {
  validateUsername({ prevUsername, newUsername, setStatus, setIsLoading }: ValidateUserName) {
    const pureUsername = newUsername.trim();

    if (pureUsername.length <= 2) {
      setStatus((prev) => ({
        ...prev,
        message: "Username must be longer than 2 characters",
        status: false,
      }));
      setIsLoading(false)
      return "fail"
    }

    if (prevUsername === newUsername) {
      setStatus((prev) => ({
        ...prev,
        message: "You can't set the same username",
        status: false,
      }));
      setIsLoading(false)
      return "fail"
    }

    if (!/^[a-zA-Zа-яА-ЯёЁ0-9_]+$/.test(pureUsername)) {
      setStatus((prev) => ({
        ...prev,
        message: "Username can only contain letters, numbers, and underscores",
        status: false,
      }));
      setIsLoading(false)
      return "fail"
    }

    if (/^\d+$/.test(pureUsername)) {
      setStatus((prev) => ({
        ...prev,
        message: "Username cannot be only numbers",
        status: false,
      }));
      setIsLoading(false)
      return "fail"
    }

    return pureUsername;
  }

  async saveChanges({
    changeMethod,
    newValue,
    userData,
    setStatus,
    setUserData,
    setIsLoading,
    setIsDataChanged
  }: SaveChangesProps) {
    setIsLoading(true)
    const dataToDb = new dataToDB({ setUserData });

    let data = {
      changeMethod,
      newValue,
      user_id: userData.userInformation.user_id,
    };

    if (changeMethod === "username") {
      data.newValue = this.validateUsername({
        prevUsername: userData.userInformation.username,
        newUsername: newValue,
        setStatus,
        setIsLoading
      });

      if(data.newValue === "fail"){
        return;
      }

      try {
        const result = await dataToDb.updateData({ data });
        setIsLoading(false)
        setStatus(result);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
export default CurtainFunctions;
