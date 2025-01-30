import { useEffect } from "react";

import DataToDB from "../../dataToDB/dataToDB";
import next from "../../icons/next.png";
import { toast } from "react-toastify";
const VerifPassword = ({
  changedData,
  setChangedData,
  setUserData,
  isAccountWillBeDeleted,
  setIsLoggedIn,
  setIsAccountWillBeDeleted,
  csrfToken
}) => {
  const dataToDB = new DataToDB(setIsLoggedIn, setUserData, true);

  useEffect(() => {
    console.log("isAccountWillBeDeleted?", isAccountWillBeDeleted);
  }, [changedData]);

  return (
    <div className="container">
      <div
        className={`modal__overlay-verif ${
          changedData.changeMethod || isAccountWillBeDeleted ? "open" : ""
        }`}
      >
        <div className="modal__block-verif">
          <h2 className="modal__title-verif">
            Enter your password to change the data.
          </h2>
          <input
            required
            type="text"
            placeholder="Your old password"
            className="modal__input-verif"
            onChange={(e) => {
              const { value } = e.target;
              setChangedData((prevData) => ({
                ...prevData,
                oldPassword: value,
              }));
            }}
          />
          <button
            onClick={() => {
              if (isAccountWillBeDeleted) {
                dataToDB.deleteProfile(
                  changedData?.oldPassword,
                  changedData?.user_id,
                  csrfToken
                ).then((response)=>{
                  console.log(response)
                  if(response.message === true){
                    setIsAccountWillBeDeleted(false) 
                  } else {
                    setTimeout(() => {
                      toast.error("Wrong password");
                    }, 100);
                  }
                });
              } else {
                dataToDB.updateData(changedData);
                console.log("Ну окей");
                if (
                  dataToDB.updateData.message ===
                  "Данные пользователя успешно обновлены"
                ) {
                  console.log("Успешно смели пароль");
                  setChangedData((prevData) => ({
                    ...prevData,
                    changeMethod: false,
                  }));
                }
              }
            }}
            type="submit"
            className="modal__verif-button"
          >
            <img className="next_btn-img" src={next} alt="click here" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default VerifPassword;
