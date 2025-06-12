import { Link } from "react-router-dom";

import { useEffect, useRef } from "react";

import "./CookiesWindow.css";

import cross from "../../icons/cross.png";
import cookie from "../../icons/cookieicon.svg";

const CookiesWindow = ({ setIsCookieClosed, isCookieClosed }) => {
  useEffect(() => {
    if (!isCookieClosed) {
      setTimeout(() => {
        cookieRef.current.classList.add("open");
      }, 500);
    } else {
      setTimeout(() => {
        cookieRef.current.classList.remove("open");
      }, 500);
    }
  }, []);

  const cookieRef = useRef();

  return (
    <>
      <div ref={cookieRef} className="cookie__agreement-block">
        <p className="cookie__agreement-text">
          We use cookies to improve website performance and convenience. By
          continuing to use the site, you agree to our use of cookies. For more
          details, please refer to the{" "}
          <Link to="/dataprocessing">personal data processing agreement</Link>.
        </p>
        <img
          src={cookie}
          alt="cookie img"
          className="cookie__agreement-cookie"
        />
        <button
          onClick={() => {
            cookieRef.current.classList.remove("open");
            setTimeout(() => {
              setIsCookieClosed(true);
            }, 600);
          }}
          className="cookie__agreement-block_closebtn"
        >
          <img className="closebtn__img" src={cross} alt="close window" />
        </button>
      </div>
    </>
  );
};
export default CookiesWindow;
