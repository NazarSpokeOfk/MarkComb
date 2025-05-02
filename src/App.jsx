import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import "./i18";
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
import UserDataProcessing from "./components/userDataProccessing/userDataProcessing";
import SuccessThumbnail from "./components/purchasesTrumbnails/successThumbnail/SuccessThumbnail";
import FailThumbnail from "./components/purchasesTrumbnails/failThumbnail/FailThumbnail";
import SponsorsPage from "./components/sponsorsPage/sponsorsPage";
import VotingPage from "./components/votingPage/votingPage";

function App() {
  const [channelData, setChannelData] = useState(null);
  const [SimilarChannelData, setSimilarChannelData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [csrfToken, setCsrfToken] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [userLang, setUserLang] = useState("");

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

  useEffect(() => {
    console.log(userData)
  },[userData])

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
                  userLang={userLang}
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
                  csrfToken={csrfToken}
                  setUserCountry={setUserCountry}
                  setUserLang={setUserLang}
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
                  setSimilarChannelData={setSimilarChannelData}
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
              <Purchase isLoggedIn={isLoggedIn} userData={userData} />
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
          path="/dataprocessing"
          element={
            <ErrorBoundary>
              <UserDataProcessing />
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
                isLoggedIn={isLoggedIn}
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
        <Route
          path="/paymentsuccess"
          element={
            <ErrorBoundary>
              <SuccessThumbnail />
            </ErrorBoundary>
          }
        />
        <Route
          path="/paymenterror"
          element={
            <ErrorBoundary>
              <FailThumbnail />
            </ErrorBoundary>
          }
        />
        <Route
          path="/sponsors"
          element={
            <ErrorBoundary>
              <SponsorsPage />
            </ErrorBoundary>
          }
        />
        <Route
        path="/vote"
        element={
          <ErrorBoundary>
            <VotingPage userData={userData}/>
            <ToastContainer/>
          </ErrorBoundary>
        }
        />
      </Routes>
    </Router>
  );
}

export default App;
