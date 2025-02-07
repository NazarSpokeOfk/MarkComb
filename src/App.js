import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NotFound from "./components/notFound/NotFound";
import Profile from "./components/profile/Profile";
import ErrorBoundary from "./errorBoundary/ErrorBoundary";
import HeaderFilter from "./components/headerFilter/Header&Filter";
import YoutuberBlock from "./components/youtuberBlock/YoutuberBlock";
import Purchases from "./components/purchases/Purchases";
import Promotion from "./components/promotion/Promotion";
import Purchase from "./components/purchase/Purchase";
import Terms from "./components/terms/Terms";
import Purpose from "./components/purpose/Purpose";

function App() {
  const [channelData, setChannelData] = useState(null);
  const [SimilarChannelData, setSimilarChannelData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [csrfToken, setCsrfToken] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [userLang, setUserLang] = useState("");
  const ipAPIToken = "df49f11220979b";

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    username: "",
    recaptchaValue: "",
  });
  const [logInData, setLogInData] = useState({
    email: "",
    password: "",
  });

  useEffect(()=>{
    console.log("userLang:",userLang)
  })

  useEffect(() => {
    fetch(`https://ipinfo.io/json?token=${ipAPIToken}`).then((response) => {
      response.json().then((data) => {
        setUserCountry(data.country);

        switch (data.country) {
          case "RU":
            setUserLang("ru");
            break;
          case "ES":
            setUserLang("es");
            break;
          default:
            setUserLang("en");
        }
      });
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/purchases"
          element={
            <ErrorBoundary>
              <Purchases
                userData={userData}
                setUserData={setUserData}
                csrfToken={csrfToken}
              />
              <ToastContainer />
            </ErrorBoundary>
          }
        />
        <Route
          path="/"
          element={
            <>
              <ErrorBoundary>
                <HeaderFilter
                  userLang = {userLang}
                  SimilarChannelData={SimilarChannelData}
                  setChannelData={setChannelData}
                  setSimilarChannelData={setSimilarChannelData}
                  setIsLoggedIn={setIsLoggedIn}
                  isLoggedIn={isLoggedIn}
                  setUserData={setUserData}
                  signInData={signInData}
                  setSignInData={setSignInData}
                  logInData={logInData}
                  setLogInData={setLogInData}
                  userData={userData}
                  setCsrfToken={setCsrfToken}
                  csrfToken = {csrfToken}
                />
              </ErrorBoundary>
              <ErrorBoundary>
                <YoutuberBlock
                  channelData={channelData}
                  SimilarChannelData={SimilarChannelData}
                  userData={userData}
                  setUserData={setUserData}
                  isLoggedIn={isLoggedIn}
                  csrfToken={csrfToken}
                />
              </ErrorBoundary>
            </>
          }
        />
        <Route
          path="/promotion"
          element={
            <ErrorBoundary>
              <Promotion userData={userData} isLoggedIn={isLoggedIn} />
              <ToastContainer />
            </ErrorBoundary>
          }
        />
        <Route
          path="/purchase"
          element={
            <ErrorBoundary>
              <Purchase isLoggedIn={isLoggedIn} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/terms"
          element={
            <ErrorBoundary>
              <Terms />
            </ErrorBoundary>
          }
        />
        <Route
          path="/purpose"
          element={
            <ErrorBoundary>
              <Purpose />
            </ErrorBoundary>
          }
        />
        <Route
          path="/profile"
          element={
            <ErrorBoundary>
              <Profile
                userData={userData}
                setUserData={setUserData}
                setIsLoggedIn={setIsLoggedIn}
                csrfToken={csrfToken}
              />
            </ErrorBoundary>
          }
        />
        <Route
          path="*"
          element={
            <ErrorBoundary>
              <NotFound />
            </ErrorBoundary>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
