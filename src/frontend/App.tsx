import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import "./i18";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  UserData,
  SignInData,
  LogInData,
  ChannelData,
} from "./interfaces/interfaces";

import NotFound from "./components/notFound/NotFound";
import Profile from "./components/profile/Profile";
import ErrorBoundary from "./errorBoundary/ErrorBoundary";
import HeaderFilter from "./components/headerFilter/Header&Filter";
import YoutubersBlock from "./components/youtubersBlock/YoutubersBlock";
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
import MainPage from "./components/mainPage/MainPage";
import ScrollToTop from "./components/scrollToTop/scrollToTop";
import ForbiddenThumbnail from "./components/forbiddenThumbnail/ForbiddenThumbnail";
import TooManyRequestsThumbnail from "./components/tooManyRequestsThumbnail/tooManyRequestThumbnail";
import CookiesWindow from "./components/cookiesWindow/CookiesWindow";

import checkCookies from "./checkCookies/checkCookies";
import { setGlobalNavigate } from "./errorHandler/errorHandler";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

function App() {
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [SimilarChannelData, setSimilarChannelData] =
    useState<ChannelData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isCookieClosed, setIsCookieClosed] = useState<boolean>(() => {
    return localStorage.getItem('cookieConfirmed') === 'true';
  });
  const [userData, setUserData] = useState<UserData>({
    channels: [],
    lang: "",
    userInformation: {
      csrfToken: "",
      email: "",
      isSubscriber: false,
      isVoteEnabled: false,
      subscription_expiration: "",
      user_id: 0,
      username: "",
      uses: 0,
    },
  });

  const [isFilterCTAActive, setIsFilterCTAActive] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [entryMethod, setEntryMethod] = useState("");

  const [signInData, setSignInData] = useState<SignInData>({
    email: "",
    password: "",
    username: "",
    recaptchaValue: "",
    verification_code: "",
  });
  const [logInData, setLogInData] = useState<LogInData>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    checkCookies({ setIsLoggedIn, setUserData, setIsCookieClosed });
  }, []);

  useEffect(() => {
    setGlobalNavigate(navigate);
  }, [navigate]);

  useEffect(() => {
    if(isCookieClosed){
      localStorage.setItem('cookieConfirmed','true')
    }
  },[isCookieClosed])

  return (
    <>
      <ScrollToTop />
      <Header
        isVoteEnabled={userData.userInformation.isVoteEnabled}
        hideLinks={false}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <MainPage
                setIsFilterCTAActive={setIsFilterCTAActive}
                userData={userData}
              />
            </ErrorBoundary>
          }
        />
        <Route
          path="/purchases"
          element={
            <ErrorBoundary>
              <Purchases
                userData={userData}
                setUserData={setUserData}
                csrfToken={userData.userInformation.csrfToken}
              />
              <ToastContainer />
            </ErrorBoundary>
          }
        />
        <Route
          path="/search"
          element={
            <>
              <ErrorBoundary>
                <HeaderFilter
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
                  csrfToken={userData.userInformation.csrfToken}
                  isFilterCTAActive={isFilterCTAActive}
                  isModalOpened={isModalOpened}
                  setIsModalOpened={setIsModalOpened}
                  entryMethod={entryMethod}
                  setEntryMethod={setEntryMethod}
                />
              </ErrorBoundary>
              <ErrorBoundary>
                <YoutubersBlock
                  channelData={channelData}
                  SimilarChannelData={SimilarChannelData}
                  userData={userData}
                  setUserData={setUserData}
                  isLoggedIn={isLoggedIn}
                  csrfToken={userData.userInformation.csrfToken}
                  setSimilarChannelData={setSimilarChannelData}
                />
              </ErrorBoundary>
              <ToastContainer />
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
                csrfToken={userData.userInformation.csrfToken}
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
              <VotingPage userData={userData} />
              <ToastContainer />
            </ErrorBoundary>
          }
        />
        <Route
          path="/forbidden"
          element={
            <ErrorBoundary>
              <ForbiddenThumbnail
                setIsModalOpened={setIsModalOpened}
                setEntryMethod={setEntryMethod}
                setUserData={setUserData}
              />
            </ErrorBoundary>
          }
        />
        <Route
          path="/toomanyrequests"
          element={
            <ErrorBoundary>
              <TooManyRequestsThumbnail />
            </ErrorBoundary>
          }
        />
      </Routes>
      <CookiesWindow
        isCookieClosed={isCookieClosed}
        setIsCookieClosed={setIsCookieClosed}
      />
      <Footer />
    </>
  );
}

export default App;
