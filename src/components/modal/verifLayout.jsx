import DataToDB from "../../dataToDB/dataToDB";
import { useRef } from "react";

import { ToastContainer  } from "react-toastify";

import next from "../../icons/next.png"

const VerifLayout = (
  {
  classExpression,
  titleText,
  onChangeAction,
  onClickAction,
  changedData,
  setChangedData,
  csrfToken,
  isDataFilledIn,
  isLoggedIn,
  setSignInData,
  signInData,
  setIsLoggedIn,
  setUserData
  }
) => {
  const modalRef = useRef();
  const dataToDB = new DataToDB(setIsLoggedIn, setUserData, true);

  return (
    <div className="container">
      <div ref={modalRef} className={classExpression}>
        <div className="modal__block-verif">
          <h2 className="modal__title-verif">{titleText}</h2>
          <input
            required
            type="text"
            placeholder="verification code"
            className="modal__input-verif"
            onChange={(e) => onChangeAction(e)}
          />
          <button
            onClick={onClickAction}
            type="submit"
            className="modal__verif-button"
            id="email"
          >
            <img className="next_btn-img" src={next} alt="click here" />
          </button>
        </div>
      </div>
      <ToastContainer autoClose={3000} />
    </div>
  );
};
export default VerifLayout;
