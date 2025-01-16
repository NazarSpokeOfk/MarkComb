import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState , useEffect} from "react";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
  const [isLoggedIn,setIsLoggedIn] = useState(false)
  const [userData,setUserData] = useState({})

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    username: "",
    recaptchaValue : ""
  });
  const [logInData, setLogInData] = useState({
    email: "",
    password: "",
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/purchases"
          element={
            <ErrorBoundary>
              <Purchases 
                userData = {userData}
                setUserData = {setUserData}
              />
              <ToastContainer/>
            </ErrorBoundary>
          }
        />
        <Route
          path="/"
          element={
            <>
              <ErrorBoundary>
                <HeaderFilter
                  SimilarChannelData={SimilarChannelData}
                  setChannelData={setChannelData}
                  setSimilarChannelData={setSimilarChannelData}
                  setIsLoggedIn={setIsLoggedIn}
                  isLoggedIn = {isLoggedIn}
                  setUserData = {setUserData}
                  signInData = {signInData}
                  setSignInData = {setSignInData}
                  logInData = {logInData}
                  setLogInData = {setLogInData}
                />
              </ErrorBoundary>
              <ErrorBoundary>
                <YoutuberBlock
                  channelData={channelData}
                  SimilarChannelData={SimilarChannelData}
                  userData = {userData}
                  setUserData = {setUserData}
                  isLoggedIn = {isLoggedIn}
                />
                ;
              </ErrorBoundary>
            </>
          }
        />
        <Route
          path="/promotion"
          element={
            <ErrorBoundary>
              <Promotion 
              userData = {userData}
              isLoggedIn = {isLoggedIn}
              />
              <ToastContainer/>
            </ErrorBoundary>
          }
        />
        <Route
          path="/purchase"
          element={
            <ErrorBoundary>
              <Purchase 
              isLoggedIn = {isLoggedIn}
              />
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
        element = {
          <ErrorBoundary>
            <Profile/>
          </ErrorBoundary>
        }
        />
      </Routes>
    </Router>
  );
}

export default App;
