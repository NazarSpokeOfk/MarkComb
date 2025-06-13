import React, { RefObject } from "react";

import {
  UserData,
  ChannelData,
  SignInData,
  LogInData,
  ChangedData,
} from "../interfaces/interfaces";

export type CommonTypes = {
  userData: UserData;
  isLoggedIn?: boolean;
};

export type TypesOfSets = {
  setEntryMethod: React.Dispatch<React.SetStateAction<string>>;
  setSimilarChannelData: React.Dispatch<
    React.SetStateAction<ChannelData | null>
  >;
  setIsFilterCTAActive: React.Dispatch<React.SetStateAction<boolean>>;
  setChannelData: React.Dispatch<React.SetStateAction<ChannelData | null>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDataFilledIn: React.Dispatch<React.SetStateAction<boolean>>;
  setLogInData: React.Dispatch<React.SetStateAction<LogInData>>;
  setSignInData: React.Dispatch<React.SetStateAction<SignInData>>;
  setIsPasswordWillBeReset: React.Dispatch<React.SetStateAction<boolean>>;
};

type SelectProps<T, K extends keyof T> = Pick<T, K>;

type PartialSelectProps<T, K extends keyof T> = Partial<Pick<T, K>>;

export type MainPageProps = SelectProps<CommonTypes, "userData"> &
  SelectProps<TypesOfSets, "setIsFilterCTAActive">;

export type HeaderFilterProps = SelectProps<
  TypesOfSets,
  | "setChannelData"
  | "setSimilarChannelData"
  | "setIsLoggedIn"
  | "setUserData"
  | "setSignInData"
  | "setLogInData"
  | "setEntryMethod"
  | "setIsModalOpened"
> &
  CommonTypes & {
    signInData: SignInData;
    logInData: LogInData;
    csrfToken: string;
    isFilterCTAActive: boolean;
    isModalOpened: boolean;
    entryMethod: string;
  };

export type ModalProps = SelectProps<
  TypesOfSets,
  | "setIsLoggedIn"
  | "setUserData"
  | "setIsModalOpened"
  | "setIsDataFilledIn"
  | "setLogInData"
  | "setSignInData"
  | "setIsPasswordWillBeReset"
> & {
  isModalOpened: boolean;
  entryMethod: string;
  logInData: LogInData;
  signInData: SignInData;
};

export type VerifLayoutProps = SelectProps<CommonTypes, "isLoggedIn"> &
  PartialSelectProps<
    TypesOfSets,
    "setSignInData" | "setIsLoggedIn" | "setUserData"
  > & {
    modalRef: RefObject<HTMLDivElement | null>;
    classExpression: string;
    titleText: string;
    onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClickAction: (e: React.MouseEvent<HTMLButtonElement>) => void;
    changedData?: ChangedData | null;
    setChangedData?: React.Dispatch<React.SetStateAction<ChangedData>>;
    csrfToken?: string | null;
    isDataFilledIn?: boolean | null;
    signInData?: SignInData | null;
    setIsAccountWillBeDeleted?: React.Dispatch<React.SetStateAction<boolean>>;
    isAccountWillBeDeleted?: boolean;
  };

export type VerifModalProps = SelectProps<CommonTypes, "isLoggedIn"> &
  SelectProps<
    TypesOfSets,
    "setIsLoggedIn" | "setUserData" | "setSignInData"
  > & {
    isDataFilledIn: boolean;
    signInData: SignInData;
    logInData: LogInData;
  };

export type VerifPasswordProps = SelectProps<
  TypesOfSets,
  "setUserData" | "setIsLoggedIn"
> & {
  setIsAccountWillBeDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  isAccountWillBeDeleted: boolean;
  setIsNameChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPasswordChanged: React.Dispatch<React.SetStateAction<boolean>>;
  changedData: ChangedData;
  setChangedData: React.Dispatch<React.SetStateAction<ChangedData>>;
  csrfToken: string;
};

export type VerifCodeProps = {
  email: string;
  isTriggered: boolean;
  setIsTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVerificationCodeCorrect: React.Dispatch<
    React.SetStateAction<boolean | null>
  >;
} & PartialSelectProps<TypesOfSets, "setIsLoggedIn" | "setUserData">;

export type PurchaseModalProps = {
  isModalOpened: boolean;
  setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
  packageName: string;
  usesQuantity: number;
  price: number;
  isBusiness: boolean;
  packageId: number;
  user_id: number;
  userEmail: string;
};

export type NewPasswordProps = {
  email: string;
  isVerificationCodeCorrect: boolean;
  setIsVerificationCodeCorrect: React.Dispatch<
    React.SetStateAction<boolean | null>
  >;
};

export type FeedbackFormProps = {
  setIsFeedbackWillBeWrited: React.Dispatch<React.SetStateAction<boolean>>;
  isFeedbackWillBeWrited: boolean;
};

export type ProfileProps = CommonTypes &
  SelectProps<TypesOfSets, "setUserData" | "setIsLoggedIn"> & {
    csrfToken: string;
  };

export type YouTuberBlockProps = CommonTypes &
  SelectProps<TypesOfSets, "setUserData" | "setChannelData"> & {
    channelData: ChannelData | null;
    csrfToken: string;
    isFilter: boolean;
    YoutuberImg: string;
    buttonId: number;
  };

export type YouTubersBlockProps = CommonTypes &
  SelectProps<TypesOfSets, "setSimilarChannelData" | "setUserData"> & {
    channelData: ChannelData | null;
    SimilarChannelData: ChannelData | null;
    csrfToken: string;
  };

export type PurchasesProps = SelectProps<CommonTypes, "userData"> &
  SelectProps<TypesOfSets, "setUserData"> & {
    csrfToken: string;
  };

export type CheckCookiesProps = {
  setIsCookieClosed: React.Dispatch<React.SetStateAction<boolean>>;
} & SelectProps<TypesOfSets, "setIsLoggedIn" | "setUserData">;

export type FilterFetchesProps = SelectProps<
  TypesOfSets,
  "setSimilarChannelData"
> & {
  content_type: string | null | number[];
  age_group: string | null | number[];
  minsubs: number | null;
  maxsubs: number | null;
  setIsFiltersFetching: React.Dispatch<React.SetStateAction<boolean>>;
};

export type HeaderProps = {
  hideLinks: boolean;
  isVoteEnabled: boolean;
};

export type ForbiddenThumbnailProps = SelectProps<
  TypesOfSets,
  "setIsModalOpened" | "setEntryMethod" | "setUserData"
>;

export type VotingPageProps = SelectProps<CommonTypes, "userData">;

export type ModalUtilitiesProps = {
  ref: React.RefObject<HTMLDivElement | null>;
};

export type CookiesWindowProps = {
  setIsCookieClosed: React.Dispatch<React.SetStateAction<boolean>>;
  isCookieClosed: boolean;
};

export const defaultUserData: UserData = {
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
};
