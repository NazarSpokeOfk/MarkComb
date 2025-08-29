import {
  ChangePasswordWrapperProps,
} from "../../../types/types";
import DataToDB from "../../../Client-ServerMethods/dataToDB";

const dataToDb = new DataToDB();

class ResetPasswordFunctions {
  async changePassword({
    newPassword,
    token,
    setIsLoading,
    setShow,
    setIsReseted,
  }: ChangePasswordWrapperProps) {
    setShow(false);
    setIsLoading(true);
    const purePassword = newPassword.trim();

    if (purePassword.length < 5) {
      console.log("Залупа");
      setIsLoading(false);
      setShow(true);
      return "Short password";
    }

    try {
      const result = await dataToDb.changePassword({
        newPassword: purePassword,
        token,
      });

      if (result.success) {
        setIsLoading(false);
        setIsReseted(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
export default ResetPasswordFunctions;
