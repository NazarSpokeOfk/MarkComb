import { useEffect } from "react";

import { useTranslation } from "react-i18next";

import { ToastContainer } from "react-toastify";

import next from "../../icons/next.png";

const VerifLayout = ({
  modalRef,
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
  setUserData,
}) => {

  const { t } = useTranslation();

  console.log(modalRef);
  return (
    <div className="container">
      <div ref={modalRef} className={classExpression}>
        <div className="modal__block-verif">
          <h2 className="modal__title-verif">{titleText}</h2>
          <input
            required
            type="text"
            placeholder={t("verification code")}
            className="modal__input-verif"
            onChange={(e) => onChangeAction(e)}
          />
          <button
            onClick={onClickAction}
            type="submit"
            className="modal__verif-button"
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
