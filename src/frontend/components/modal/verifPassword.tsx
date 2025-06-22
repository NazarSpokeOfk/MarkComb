import { useEffect, useRef } from "react";

import "react-toastify/dist/ReactToastify.css";

import DataToDB from "../../Client-ServerMethods/dataToDB";

import { VerifPasswordProps } from "../../types/types";

import { toast } from "react-toastify";

import VerifLayout from "./verifLayout";

import closeModal from "../../utilities/closeModal";
import openModal from "../../utilities/openModal";

const VerifPassword = ({
  changedData,
  setChangedData,
  setUserData,
  isAccountWillBeDeleted,
  setIsLoggedIn,
  setIsAccountWillBeDeleted,
  csrfToken,
  setIsNameChanged,
  setIsPasswordChanged,
}: VerifPasswordProps) => {

  const dataToDB = new DataToDB({
    setIsLoggedIn,
    setUserData,
  });

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (changedData.changeMethod || isAccountWillBeDeleted) {
      setTimeout(() => {
        openModal({ref : modalRef})
      }, 100);
    } else {
      closeModal({ref : modalRef})
      setTimeout(() => {
        modalRef.current!.style.visibility = "hidden";
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
          console.log(changedData);
          dataToDB.updateData({ data : changedData}).then((response) => {
            console.log("response.message:", response.message);
            if (response?.message === true) {
              console.log("Data changed, showing toast...");
              console.log(toast);
              toast.success("Data changed successfully.");
              setIsNameChanged(false);
              setIsPasswordChanged(false);
              setChangedData((prevData) => ({
                ...prevData,
                changeMethod: "",
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
