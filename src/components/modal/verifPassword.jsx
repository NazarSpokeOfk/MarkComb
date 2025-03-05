import { useEffect } from "react";

import DataToDB from "../../dataToDB/dataToDB";
import { toast } from "react-toastify";

import VerifLayout from "./verifLayout";

const VerifPassword = ({
  changedData,
  setChangedData,
  setUserData,
  isAccountWillBeDeleted,
  setIsLoggedIn,
  setIsAccountWillBeDeleted,
  csrfToken,
}) => {
  const dataToDB = new DataToDB(setIsLoggedIn, setUserData, true);

  useEffect(() => {
    console.log("isAccountWillBeDeleted?", isAccountWillBeDeleted);
  }, [changedData]);

  return (
    <VerifLayout
      classExpression={`modal__overlay-verif ${
        changedData.changeMethod || isAccountWillBeDeleted ? "open" : ""
      }`}
      titleText=" Enter your password to change the data."
      onChangeAction={(e) => {
        const { value } = e.target;
        setChangedData((prevData) => ({
          ...prevData,
          oldPassword: value,
        }));
      }}
      onClickAction={() => {
        if (isAccountWillBeDeleted) {
          dataToDB
            .deleteProfile(
              changedData?.oldPassword,
              changedData?.user_id,
              csrfToken
            )
            .then((response) => {
              console.log(response);
              if (response.message === true) {
                setIsAccountWillBeDeleted(false);
                setTimeout(() => {
                  toast.success("Account deleted.");
                }, 100);
              } else {
                setTimeout(() => {
                  toast.error("Wrong password");
                }, 100);
              }
            });
        } else {
          dataToDB.updateData(changedData).then((response) => {
            console.log("Ну окей");
            if (response.message === true) {
              console.log("Успешно сменили пароль");
              setChangedData((prevData) => ({
                ...prevData,
                changeMethod: false,
              }));
            }
          });
        }
      }}
      changedData = {changedData}
      setIsAccountWillBeDeleted = {setIsAccountWillBeDeleted}
      isAccountWillBeDeleted = {isAccountWillBeDeleted}
      setChangedData = {setChangedData}
      csrfToken = {csrfToken}
      setIsLoggedIn ={setIsLoggedIn}
      setUserData = {setUserData}
    />
  );
};
export default VerifPassword;
