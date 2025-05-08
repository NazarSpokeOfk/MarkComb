import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { toast } from "react-toastify";

import Modal from "../modal/Modal";
import VerifModal from "../modal/VerifModal";
import VerifCode from "../modal/verifCode";
import NewPassword from "../modal/newPassword";
import Header from "../header/Header";

import checkCookies from "../../checkCookies/checkCookies";
import manageFiltersFetch from "../../filtersRequests/filterFetches";

import "./Header&Filter.css";
import "react-toastify/dist/ReactToastify.css";

import Loading from "../../images/loading-gif.gif";
import FilterBtnImg from "../../icons/filters.png";
import SearchBtn from "../../icons/magnifing_glass.png";
import ResetIcon from "../../icons/reseticon.png";
import CloseFilter from "../../icons/closefilter.png";

const HeaderFilter = ({
  setChannelData,
  setSimilarChannelData,
  setIsLoggedIn,
  isLoggedIn,
  setUserData,
  signInData,
  setSignInData,
  logInData,
  setLogInData,
  userData,
  setCsrfToken,
  csrfToken,
  setUserCountry,
  setUserLang,
}) => {
  const { t } = useTranslation();

  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isDataFilledIn, setIsDataFilledIn] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltersFetching, setIsFiltersFetching] = useState(false);
  const [entryMethod, setEntryMethod] = useState("");
  const [isMultiFiltersEnabled, setIsMultiFiltersEnabled] = useState(false);
  const [activeAnimations, setActiveAnimations] = useState([]);
  const [removingIndex, setRemovingIndex] = useState(null);

  const [selectedFilter, setSelectedFilter] = useState({
    type: null,
    value: null,
  });

  const [mainInputValue, setMainInputValue] = useState("");
  const [isPasswordWillBeReset, setIsPasswordWillBeReset] = useState(false);
  const [isVerificationCodeCorrect, setIsVerificationCodeCorrect] =
    useState(null);
  const [selectedFilterLabels, setSelectedFilterLabels] = useState([]);

  const filterRef = useRef();

  const audienceButtonLabels = ["Kids", "Adults", "Teenagers", "OlderGen"];
  const contentButtonLabels = [
    "Comedy",
    "Vlogs",
    "Animation",
    "Education",
    "Entertaiment",
    "Fitness",
    "Health",
    "Music",
    "News",
    "Gaming",
    "Travel",
    "Fashion",
  ];
  const subscribersButtonLabels = {
    "0-1K": [0, 1000],
    "1-10K": [1000, 10000],
    "10-100K": [10000, 100000],
    "100-500K": [100000, 500000],
    "1-5M": [1000000, 5000000],
    "5-10M": [5000000, 10000000],
    "10-20M": [10000000, 20000000],
  };

  const logInFirstly = () => {
    toast.warn(t("Log in firstly"));
  };

  const searchFetch = async (e) => {
    e.preventDefault();
    if (!mainInputValue) {
      setIsSearching(false);
      return;
    }
    try {
      const response = await fetch("https://owa.markcomb.com/api/search", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          "X-CSRF-Token": csrfToken,
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ mainInputValue }),
      });
      const result = await response.json();
      setChannelData(result);
      setIsSearching(false);
    } catch (error) {
      toast.error(
        t("There was an error during channel search. Please, try again later")
      );
      console.log("Ошибка в searchFetch:", error);
    }
  };

  const openFilters = () => {
    filterRef.current.classList.toggle("active");
  };

  useEffect(() => {
    checkCookies(setIsLoggedIn, setUserData, setUserLang, setCsrfToken);
  }, []);

  useEffect(() => {
    const newAnimations = selectedFilterLabels.map((_, index) => false);
    setActiveAnimations(newAnimations);

    selectedFilterLabels.forEach((_, index) => {
      setTimeout(() => {
        setActiveAnimations((prev) => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });
      }, 50);
    });
  }, [selectedFilterLabels]);

  const resetSelectedFilters = () => {
    setSelectedFilterLabels([]);
  };

  const removeSelectedFilter = (index) => {
    setRemovingIndex(index);
    setTimeout(() => {
      setSelectedFilterLabels((prev) => prev.filter((_, i) => i !== index));
      setRemovingIndex(null);
    }, 300);
  };

  const addSelectedFilter = (label, type, min, max) => {
    setSelectedFilterLabels((prevState) => {
      const withoutSameType = prevState.filter((item) => item.type !== type);
      return [
        ...withoutSameType,
        { type: type, value: label, min: min, max: max },
      ];
    });
  };

  const searchWithMultiplyFilters = async () => {
    setIsFiltersFetching(true);

    try {
      const filterData = {
        content_type: false,
        age_group: false,
        minsubs: false,
        maxsubs: false,
      };

      selectedFilterLabels.forEach(({ type, value, min, max }) => {
        switch (type) {
          case "contentType":
            filterData.content_type = value;
            break;

          case "audience":
            filterData.age_group = value;
            break;

          case "subscribers":
            filterData.minsubs = min;
            filterData.maxsubs = max;
            break;

          default:
            break;
        }
      });

      const response = await manageFiltersFetch(
        filterData.content_type,
        setSimilarChannelData,
        filterData.age_group,
        filterData.minsubs,
        filterData.maxsubs,
        setIsFiltersFetching
      );
      console.log("response :", response);
      if (response === false) {
        toast.error(t("Unfortunately, the filters don't match"), {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log("Возникла ошибка в searchWithMultiplyFilters :", error);
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Main page</title>
          <meta name="description" content="Main page of the markcomb" />
        </Helmet>

        <Header hideLinks={false} isVoteEnabled={userData?.isVoteEnabled} />

        <section className="login">
          {isLoggedIn ? (
            <Link className="profile__name" to={"/profile"}>
              {userData?.user?.username}
            </Link>
          ) : null}{" "}
          {isLoggedIn ? (
            <Link
              onClick={() => {
                setUserData("");
                setIsLoggedIn(false);
              }}
              href="#"
              className="log__in"
            >
              {t("Log out")}
            </Link>
          ) : (
            <>
              <Link
                onClick={() => {
                  setEntryMethod("logIn");
                  setIsModalOpened(true);
                }}
                href="#"
                className="log__in"
              >
                {t("Log in")} /
              </Link>
              <Link
                onClick={() => {
                  setEntryMethod("SignIn");
                  setIsModalOpened(true);
                }}
                href="#"
                className="sign__in"
              >
                {t("Sign in")}
              </Link>
            </>
          )}
        </section>

        <section className="search">
          <div className="container">
            <form
              className="maininput"
              value={mainInputValue}
              onChange={(e) => {
                const { value } = e.target;
                setMainInputValue(value);
              }}
              onSubmit={(e) => {
                e.preventDefault();
                if (isLoggedIn) {
                  searchFetch(e);
                } else {
                  logInFirstly();
                  setIsSearching(false);
                }
              }}
            >
              <input
                className="search__main"
                type="text"
                placeholder={t("Search for any YouTuber")}
              />
              <div className="buttons">
                <button
                  onClick={openFilters}
                  type="button"
                  className="search__filters"
                >
                  <img src={FilterBtnImg} loading="lazy" alt="search_filters" />
                </button>
                <button
                  onClick={() => {
                    setIsSearching(true);
                  }}
                  type="submit"
                  className="search__glass"
                >
                  <img
                    src={isSearching ? Loading : SearchBtn}
                    alt="search_button"
                    loading="lazy"
                  />
                </button>
              </div>
            </form>
          </div>
        </section>

        <section ref={filterRef} className="filters">
          <div className="container">
            <hr className="filter__divider" />
            <div className="multifilter__block">
              <h2 className="multifilter__title">
                {t("Multi - ")}
                <span>{t("Filter")}</span>
              </h2>

              <label className="switch">
                <input
                  type="checkbox"
                  onClick={() => {
                    setIsMultiFiltersEnabled(!isMultiFiltersEnabled);
                    setSelectedFilterLabels([]);
                  }}
                />
                <span className="slider round"></span>
              </label>

              <h2
                className={`selectedfilters__title ${
                  isMultiFiltersEnabled ? "active" : ""
                }`}
              >
                {t("Selected filters")}
              </h2>

              {isMultiFiltersEnabled ? (
                <>
                  <div className="selectedfilters__blocks">
                    {selectedFilterLabels.map((filter, index) => (
                      <div
                        key={index}
                        className={`selectedfilter__block 
                          ${activeAnimations[index] ? "fade-in" : ""} 
                          ${removingIndex === index ? "fade-out" : ""}`}
                      >
                        <span>{filter.value}</span>
                        <button
                          onClick={() => removeSelectedFilter(index)}
                          className="close__filter"
                          aria-label="Закрыть фильтр"
                        >
                          <img src={CloseFilter} alt="closefilter" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        resetSelectedFilters(selectedFilterLabels);
                      }}
                      className="reset__button"
                    >
                      <img src={ResetIcon} alt="reset filters" />
                    </button>

                    {Object.keys(selectedFilterLabels).length > 0 ? (
                      <button
                        onClick={() => {
                          searchWithMultiplyFilters();
                        }}
                        className="search__multifilters-btn"
                      >
                        <img
                          src={isFiltersFetching ? Loading : SearchBtn}
                          alt="search with selected filters"
                        />
                      </button>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
            <div className="target__audence">
              <h2 className="target-audence__title text">
                {t("target")}
                <span> {t("audience")}</span>
              </h2>
              <div className="target-audence__blocks">
                {audienceButtonLabels.map((label, index) => (
                  <button
                    key={index}
                    className={`filter__block ${
                      selectedFilter.type === "audience" &&
                      selectedFilter.value === label
                        ? "filteractive"
                        : ""
                    }`}
                    onClick={() => {
                      const newFilter = {
                        type: "audience",
                        value: label,
                      };
                      if (isMultiFiltersEnabled && isLoggedIn) {
                        addSelectedFilter(label, "audience", null, null);
                        setSelectedFilter(newFilter);
                        return;
                      }
                      setSelectedFilter(newFilter);
                      if (isLoggedIn) {
                        manageFiltersFetch(
                          false,
                          setSimilarChannelData,
                          label,
                          false,
                          false,
                          setIsFiltersFetching
                        );
                      } else {
                        logInFirstly();
                      }
                    }}
                  >
                    {t(label)}
                  </button>
                ))}
              </div>
            </div>

            <div className="number__of__subs">
              <h2 className="target-audence__title">
                {t("number of")}
                <span> {t("subscribers")}</span>
              </h2>
              <div className="number__ofsubs__blocks">
                {Object.entries(subscribersButtonLabels).map((label, index) => (
                  <button
                    key={index}
                    className={`filter__block ${
                      selectedFilter.type === "subscribers" &&
                      selectedFilter.value &&
                      selectedFilter.value[0] === label[1][0] &&
                      selectedFilter.value[1] === label[1][1]
                        ? "filteractive"
                        : ""
                    }`}
                    onClick={() => {
                      const newFilter = {
                        type: "subscribers",
                        value: label[1],
                      };

                      if (isMultiFiltersEnabled && isLoggedIn) {
                        addSelectedFilter(
                          label[0],
                          "subscribers",
                          label?.[1]?.[0],
                          label?.[1]?.[1]
                        );
                        setSelectedFilter(newFilter);
                        return;
                      }

                      setSelectedFilter(newFilter);
                      if (isLoggedIn) {
                        manageFiltersFetch(
                          false,
                          setSimilarChannelData,
                          false,
                          label?.[1]?.[0],
                          label?.[1]?.[1],
                          setIsFiltersFetching
                        );
                      } else {
                        logInFirstly();
                      }
                    }}
                  >
                    {label[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="content__type">
              <h2 className="target-audence__title">
                {t("content")}
                <span> {t("type")}</span>
              </h2>
              <div className="content__type__blocks">
                {contentButtonLabels.map((label, index) => (
                  <button
                    key={index}
                    className={`filter__block ${
                      selectedFilter.type === "contentType" &&
                      selectedFilter.value === label
                        ? "filteractive"
                        : ""
                    }`}
                    onClick={() => {
                      const newFilter = {
                        type: "contentType",
                        value: label,
                      };
                      if (isMultiFiltersEnabled && isLoggedIn) {
                        addSelectedFilter(label, "contentType", null, null);
                        setSelectedFilter(newFilter);
                        return;
                      }
                      setSelectedFilter(newFilter);
                      if (isLoggedIn) {
                        manageFiltersFetch(
                          label,
                          setSimilarChannelData,
                          false,
                          false,
                          false,
                          setIsFiltersFetching
                        );
                      } else {
                        logInFirstly();
                      }
                    }}
                  >
                    {t(label)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {isModalOpened ? (
          <Modal
            isModalOpened={isModalOpened}
            setIsModalOpened={setIsModalOpened}
            entryMethod={entryMethod}
            setIsLoggedIn={setIsLoggedIn}
            setUserData={setUserData}
            setIsDataFilledIn={setIsDataFilledIn}
            logInData={logInData}
            setLogInData={setLogInData}
            signInData={signInData}
            setSignInData={setSignInData}
            setCsrfToken={setCsrfToken}
            setUserCountry={setUserCountry}
            setUserLang={setUserLang}
            setIsPasswordWillBeReset={setIsPasswordWillBeReset}
          />
        ) : null}
        {isDataFilledIn ? (
          <>
            <VerifModal
              logInData={logInData}
              isDataFilledIn={isDataFilledIn}
              setSignInData={setSignInData}
              signInData={signInData}
              setUserData={setUserData}
              setIsLoggedIn={setIsLoggedIn}
              isLoggedIn={isLoggedIn}
              setCsrfToken={setCsrfToken}
            />
          </>
        ) : null}

        {isPasswordWillBeReset ? (
          <VerifCode
            data={logInData}
            isTriggered={isPasswordWillBeReset}
            setIsTriggered={setIsPasswordWillBeReset}
            setIsVerificationCodeCorrect={setIsVerificationCodeCorrect}
          />
        ) : null}

        {isVerificationCodeCorrect ? (
          <NewPassword
            email={logInData.email}
            isVerificationCodeCorrect={isVerificationCodeCorrect}
            setIsVerificationCodeCorrect={setIsVerificationCodeCorrect}
          />
        ) : null}
      </HelmetProvider>
    </>
  );
};

export default HeaderFilter;
