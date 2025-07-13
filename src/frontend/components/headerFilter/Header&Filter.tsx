import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useMediaQuery } from "react-responsive";

import manageFiltersFetch from "../../Client-ServerMethods/filterFetches";

import { HeaderFilterProps } from "../../types/types";


import { SelectedFilterLabels } from "../../interfaces/interfaces";

import "./Header&Filter.css";
import "react-toastify/dist/ReactToastify.css";

import TypeWriterComponent from "./functions/TypeWriterComponent";

import Loading from "../../images/loading-gif.gif";
import FilterBtnImg from "../../icons/filterIcon.png";
import SearchBtn from "../../icons/searchIcon.png";
import ResetIcon from "../../icons/reseticon.png";
import CloseFilter from "../../icons/closefilter.png";
import HeaderFilterFunctions from "./functions/HeaderFilterFunctions";
import YtLogo from "../../icons/YTLogo.png";

const HeaderFilter = ({
  setChannelData,
  isLoggedIn,
  userData,
  csrfToken,
  isFilterCTAActive,
  setIsFilter,
}: HeaderFilterProps) => {
  const headerFilterFunctions = new HeaderFilterFunctions();


  const isLittleMobile = useMediaQuery({ maxWidth: 430 });

  const { t } = useTranslation();
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

  useEffect(() => {
    if (isFilterCTAActive) {
      headerFilterFunctions.openFilters({ ref: filterRef });
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

  useEffect(() => {
    console.log("userData in HeaderFilter : ", userData);
  }, [userData]);

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

        <section className="CTA">
          <h1 className="title__CTA">
            {t("Find a")}{" "}
            <TypeWriterComponent
              words={[
                "Familiar",
                "Niche",
                "Right",
                "Targeted",
                "Trusted",
                "Authentic",
              ]}
              autoLoop={true}
              delayBetweenWords={3000}
            />
          </h1>

          <img className="CTA__ytlogo" src={YtLogo} alt="" />

          <h1 className="title__CTA">{t("Channel")}</h1>
        </section>

        <section className="search">
          <div className="container">
            <form
              className="maininput"
              onSubmit={(e) => {
                e.preventDefault();
                if (isLoggedIn) {
                  headerFilterFunctions.searchFetch({
                    e,
                    mainInputValue,
                    setIsSearching,
                    csrfToken,
                    setChannelData,
                  });
                } else {
                  headerFilterFunctions.logInFirstly();
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
                />
                <div className="buttons">
                  <button
                    onClick={() => {
                      headerFilterFunctions.openFilters({ ref: filterRef });
                    }}
                    type="button"
                    className="search__filters"
                  >
                    <img
                      src={FilterBtnImg}
                      loading="lazy"
                      alt="search_filters"
                    />
                  </button>
                  {!isLittleMobile ? (
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
                          onClick={() =>
                            headerFilterFunctions.removeSelectedFilter({
                              index,
                              setRemovingIndex,
                              setSelectedFilterLabels,
                            })
                          }
                          className="close__filter"
                          aria-label="Закрыть фильтр"
                        >
                          <img src={CloseFilter} alt="closefilter" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        headerFilterFunctions.resetSelectedFilters({
                          setSelectedFilterLabels,
                        });
                      }}
                      className="reset__button"
                    >
                      <img src={ResetIcon} alt="reset filters" />
                    </button>

                    {Object.keys(selectedFilterLabels).length > 0 ? (
                      <button
                        onClick={() => {
                          headerFilterFunctions.searchWithMultiplyFilters({
                            setIsFiltersFetching,
                            selectedFilterLabels,
                            setChannelData,
                          });
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
                      setIsFilter(true);
                      const newFilter = {
                        type: "audience",
                        value: label,
                        min: null,
                        max: null,
                      };
                      if (isMultiFiltersEnabled && isLoggedIn) {
                        headerFilterFunctions.addSelectedFilter({
                          label,
                          type: "audience",
                          min: null,
                          max: null,
                          setSelectedFilterLabels,
                        });
                        setSelectedFilter(newFilter);
                        return;
                      }
                      setSelectedFilter(newFilter);
                      if (isLoggedIn) {
                        manageFiltersFetch({
                          content_type: null,
                          setChannelData,
                          age_group: label,
                          minsubs: null,
                          maxsubs: null,
                          setIsFiltersFetching,
                        });
                      } else {
                        headerFilterFunctions.logInFirstly();
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
                      setIsFilter(true);
                      const newFilter = {
                        type: "subscribers",
                        value: label[1],
                        min: null,
                        max: null,
                      };

                      if (isMultiFiltersEnabled && isLoggedIn) {
                        headerFilterFunctions.addSelectedFilter({
                          label: label[0],
                          type: "subscribers",
                          min: label?.[1]?.[0],
                          max: label?.[1]?.[1],
                          setSelectedFilterLabels,
                        });
                        setSelectedFilter(newFilter);
                        return;
                      }

                      setSelectedFilter(newFilter);
                      if (isLoggedIn) {
                        manageFiltersFetch({
                          content_type: null,
                          setChannelData,
                          age_group: null,
                          minsubs: label?.[1]?.[0],
                          maxsubs: label?.[1]?.[1],
                          setIsFiltersFetching,
                        });
                      } else {
                        headerFilterFunctions.logInFirstly();
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
                      setIsFilter(true);
                      const newFilter = {
                        type: "contentType",
                        value: label,
                        min: null,
                        max: null,
                      };
                      if (isMultiFiltersEnabled && isLoggedIn) {
                        headerFilterFunctions.addSelectedFilter({
                          label,
                          type: "contentType",
                          min: null,
                          max: null,
                          setSelectedFilterLabels,
                        });
                        setSelectedFilter(newFilter);
                        return;
                      }
                      setSelectedFilter(newFilter);
                      if (isLoggedIn) {
                        manageFiltersFetch({
                          content_type: label,
                          setChannelData,
                          age_group: null,
                          minsubs: null,
                          maxsubs: null,
                          setIsFiltersFetching,
                        });
                      } else {
                        headerFilterFunctions.logInFirstly();
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
      </HelmetProvider>
    </>
  );
};

export default HeaderFilter;
