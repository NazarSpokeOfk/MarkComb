import { useEffect , useRef } from "react";

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
  setIsNameChanged
}) => {

  const dataToDB = new DataToDB(setIsLoggedIn, setUserData, true);

  const modalRef = useRef();  

  useEffect(() => {
    if (changedData.changeMethod || isAccountWillBeDeleted) {
      setTimeout(() => {
        modalRef.current.classList.add("open");
        document.body.style.overflow = "hidden";
      }, 100);
    } else {
      modalRef.current.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => {
        modalRef.current.style.visibility = "hidden";
      }, 600);
    }
  }, [isAccountWillBeDeleted]);

  return (
    <VerifLayout
      modalRef = {modalRef}
      classExpression={`modal__overlay-verif`}
      titleText=" Enter your password to change/remove the data."
      onChangeAction={(e) => {
        const { value } = e.target;
        setChangedData((prevData) => ({
          ...prevData,
          oldPassword: value,
        }));
      }}
      onClickAction={() => {
        if (isAccountWillBeDeleted) {
          console.log("csrfToken  : " ,csrfToken)
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
                document.body.style.overflow = "";
              } else {
                setTimeout(() => {
                  toast.error("Wrong password");
                }, 100);
              }
            });
        } else {
          dataToDB.updateData(changedData).then((response) => {
            if (response.message === true) {
              setIsNameChanged(false)
              setChangedData((prevData) => ({
                ...prevData,
                changeMethod: false,
              }));
              document.body.style.overflow = "";
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
