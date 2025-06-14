import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useMediaQuery } from "react-responsive";

import { toast } from "react-toastify";

import Modal from "../modal/Modal";
import VerifModal from "../modal/VerifModal";
import VerifCode from "../modal/verifCode";
import NewPassword from "../modal/newPassword";

import manageFiltersFetch from "../../filtersRequests/filterFetches";

import { HeaderFilterProps } from "../../types/types";

import { defaultUserData } from "../../types/types";

import { SelectedFilterLabels, FilterData } from "../../interfaces/interfaces";

import "./Header&Filter.css";
import "react-toastify/dist/ReactToastify.css";

import Loading from "../../images/loading-gif.gif";
import FilterBtnImg from "../../icons/filters.png";
import SearchBtn from "../../icons/magnifing_glass.png";
import ResetIcon from "../../icons/reseticon.png";
import CloseFilter from "../../icons/closefilter.png";
import DataToDB from "../../dataToDB/dataToDB";

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
  csrfToken,
  isFilterCTAActive,
  isModalOpened,
  setIsModalOpened,
  entryMethod,
  setEntryMethod,
}: HeaderFilterProps) => {
  const dataToDB = new DataToDB();

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const isLittleMobile = useMediaQuery({ maxWidth: 409 });

  const { t } = useTranslation();
  const [isDataFilledIn, setIsDataFilledIn] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isFiltersFetching, setIsFiltersFetching] = useState<boolean>(false);
  const [isMultiFiltersEnabled, setIsMultiFiltersEnabled] =
    useState<boolean>(false);
  const [activeAnimations, setActiveAnimations] = useState<boolean[]>([]);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<SelectedFilterLabels>({
    type: "",
    value: "",
    min: null,
    max: null,
  });

  const [mainInputValue, setMainInputValue] = useState<string>("");
  const [isPasswordWillBeReset, setIsPasswordWillBeReset] =
    useState<boolean>(false);
  const [isVerificationCodeCorrect, setIsVerificationCodeCorrect] = useState<
    boolean | null
  >(null);
  const [selectedFilterLabels, setSelectedFilterLabels] = useState<
    SelectedFilterLabels[]
  >([]);

  const filterRef = useRef<HTMLDivElement | null>(null);

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

  const searchFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainInputValue) {
      setIsSearching(false);
      return;
    }
    try {
      const response = await fetch(`${apiBaseUrl}/search`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          "x-csrf-token": csrfToken,
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ mainInputValue }),
      });
      const result = await response.json();
      console.log(result);
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
    if (filterRef.current) {
      filterRef.current.classList.toggle("active");
    }
  };

  useEffect(() => {
    if (isFilterCTAActive) {
      openFilters();
    }
  }, [isFilterCTAActive]);

  useEffect(() => {
    const newAnimations = selectedFilterLabels.map(() => false);
    setActiveAnimations(newAnimations);

    selectedFilterLabels.forEach((_, index: number) => {
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

  const removeSelectedFilter = (index: number) => {
    setRemovingIndex(index);
    setTimeout(() => {
      setSelectedFilterLabels((prev) => prev.filter((_, i) => i !== index));
      setRemovingIndex(null);
    }, 300);
  };

  const addSelectedFilter = (
    label: string,
    type: string,
    min: number | null,
    max: number | null
  ) => {
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
      const filterData: FilterData = {
        content_type: null,
        age_group: null,
        minsubs: null,
        maxsubs: null,
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

      const response = await manageFiltersFetch({
        ...filterData,
        setSimilarChannelData,
        setIsFiltersFetching,
      });
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
          <title>{t("Filters and search")}</title>
          <meta
            name="description"
            content="Use filters and search to get accurate results."
          />
        </Helmet>

        <section className="login">
          {isLoggedIn ? (
            <Link className="profile__name" to={"/profile"}>
              {userData?.userInformation?.username}
            </Link>
          ) : null}{" "}
          {isLoggedIn ? (
            <Link
              onClick={() => {
                dataToDB.logOut();
                setUserData(defaultUserData);
                setIsLoggedIn(false);
              }}
              to="#"
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
                to="#"
                className="log__in"
              >
                {t("Log in")} /
              </Link>
              <Link
                onClick={() => {
                  setEntryMethod("SignIn");
                  setIsModalOpened(true);
                }}
                to="#"
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
              <div className="Header__input-flex">
                <input
                  value={mainInputValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setMainInputValue(e.target.value);
                  }}
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
                    <img
                      src={FilterBtnImg}
                      loading="lazy"
                      alt="search_filters"
                    />
                  </button>
                  {isLittleMobile ? (
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
                      />
                    </button>
                  ) : null}
                </div>
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
                        resetSelectedFilters();
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
                        min: null,
                        max: null,
                      };
                      if (isMultiFiltersEnabled && isLoggedIn) {
                        addSelectedFilter(label, "audience", null, null);
                        setSelectedFilter(newFilter);
                        return;
                      }
                      setSelectedFilter(newFilter);
                      if (isLoggedIn) {
                        manageFiltersFetch({
                          content_type: null,
                          setSimilarChannelData,
                          age_group: label,
                          minsubs: null,
                          maxsubs: null,
                          setIsFiltersFetching,
                        });
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
                        min: null,
                        max: null,
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
                        manageFiltersFetch({
                          content_type: null,
                          setSimilarChannelData,
                          age_group: null,
                          minsubs: label?.[1]?.[0],
                          maxsubs: label?.[1]?.[1],
                          setIsFiltersFetching,
                        });
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
                        min: null,
                        max: null,
                      };
                      if (isMultiFiltersEnabled && isLoggedIn) {
                        addSelectedFilter(label, "contentType", null, null);
                        setSelectedFilter(newFilter);
                        return;
                      }
                      setSelectedFilter(newFilter);
                      if (isLoggedIn) {
                        manageFiltersFetch({
                          content_type: label,
                          setSimilarChannelData,
                          age_group: null,
                          minsubs: null,
                          maxsubs: null,
                          setIsFiltersFetching,
                        });
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
            />
          </>
        ) : null}

        {isPasswordWillBeReset ? (
          <VerifCode
            email={logInData.email}
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
