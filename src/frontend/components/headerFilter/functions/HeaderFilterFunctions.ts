/// <reference types="vite/client" />

import manageFiltersFetch from "../../../Client-ServerMethods/filterFetches";

const apiBaseUrl = import.meta.env.VITE_API_URL;

import { toast } from "react-toastify";

import { useState, useEffect } from "react";

import i18n from "i18next";

import {
  SearchFetchProps,
  SearchWithMultiplyFiltersProps,
  AddSelectedFilterProps,
  RemoveSelectedFilterProps,
  ModalUtilitiesProps,
  ResetSelectedFiltersProps,
} from "../../../types/types";

import { FilterData } from "../../../interfaces/interfaces";

class HeaderFilterFunctions {
  logInFirstly = () => {
    toast.warn(i18n.t("Log in firstly"));
  };

  async searchFetch({
    e,
    mainInputValue,
    setIsSearching,
    csrfToken,
    setChannelData,
  }: SearchFetchProps) {
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
        i18n.t(
          "There was an error during channel search. Please, try again later"
        )
      );
      console.log("Ошибка в searchFetch:", error);
    }
  }

  openFilters = ({ ref }: ModalUtilitiesProps) => {
    if (ref.current) {
      ref.current.classList.toggle("active");
    }
  };

  resetSelectedFilters = ({
    setSelectedFilterLabels,
  }: ResetSelectedFiltersProps) => {
    setSelectedFilterLabels([]);
  };

  removeSelectedFilter = ({
    index,
    setRemovingIndex,
    setSelectedFilterLabels,
  }: RemoveSelectedFilterProps) => {
    setRemovingIndex(index);
    setTimeout(() => {
      setSelectedFilterLabels((prev) => prev.filter((_, i) => i !== index));
      setRemovingIndex(null);
    }, 300);
  };

  addSelectedFilter({
    label,
    type,
    min,
    max,
    setSelectedFilterLabels,
  }: AddSelectedFilterProps) {
    setSelectedFilterLabels((prevState) => {
      const withoutSameType = prevState.filter((item) => item.type !== type);
      return [
        ...withoutSameType,
        { type: type, value: label, min: min, max: max },
      ];
    });
  }

  // async searchWithMultiplyFilters({
  //   setIsFiltersFetching,
  //   selectedFilterLabels,
  //   setChannelData,
  // }: SearchWithMultiplyFiltersProps) {
  //   setIsFiltersFetching(true);

  //   try {
  //     const filterData: FilterData = {
  //       content_type: null,
  //       age_group: null,
  //       minsubs: null,
  //       maxsubs: null,
  //     };

  //     if (Array.isArray(selectedFilterLabels))
  //       selectedFilterLabels.forEach(({ type, value, min, max }) => {
  //         switch (type) {
  //           case "contentType":
  //             filterData.content_type = value;
  //             break;

  //           case "audience":
  //             filterData.age_group = value;
  //             break;

  //           case "subscribers":
  //             filterData.minsubs = min;
  //             filterData.maxsubs = max;
  //             break;

  //           default:
  //             break;
  //         }
  //       });

  //     const response = await manageFiltersFetch({
  //       ...filterData,
  //       setChannelData,
  //       setIsFiltersFetching,
  //       ageGroup : ,
  //       minSubs,
  //       maxSubs,
  //       contentType
  //     });
  //     console.log("response :", response);
  //     if (response === false) {
  //       toast.error(i18n.t("Unfortunately, the filters don't match"), {
  //         autoClose: 3000,
  //       });
  //     }
  //   } catch (error) {
  //     console.log("Возникла ошибка в searchWithMultiplyFilters :", error);
  //   }
  // }
}

export default HeaderFilterFunctions;
