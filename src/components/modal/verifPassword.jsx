import { useEffect, useRef } from "react";

import "react-toastify/dist/ReactToastify.css";

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
  setIsNameChanged,
  setIsPasswordChanged
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
    <>
      <VerifLayout
        modalRef={modalRef}
        classExpression={`modal__overlay-verif`}
        titleText="Enter your password to change/remove the data."
        onChangeAction={(e) => {
          const { value } = e.target;
          setChangedData((prevData) => ({
            ...prevData,
            oldPassword: value,
          }));
        }}
        onClickAction={() => {
          dataToDB.updateData(changedData).then((response) => {
            console.log("response.message:", response.message);
            if (response?.message === true) {
              console.log("Data changed, showing toast...");
              console.log(toast);
              toast.success("Data changed successfully.");
              setIsNameChanged(false);
              setIsPasswordChanged(false);
              setChangedData((prevData) => ({
                ...prevData,
                changeMethod: false,
              }));
              document.body.style.overflow = "";
            }
          });
        }}
        changedData={changedData}
        setIsAccountWillBeDeleted={setIsAccountWillBeDeleted}
        isAccountWillBeDeleted={isAccountWillBeDeleted}
        setChangedData={setChangedData}
        csrfToken={csrfToken}
        setIsLoggedIn={setIsLoggedIn}
        setUserData={setUserData}
      />
    </>
  );
};
export default VerifPassword;
