import React, { RefObject, SetStateAction } from "react";
import { CredentialResponse } from "@react-oauth/google";
import {
  UserData,
  ChannelData,
  SignInData,
  LogInData,
  ChangedData,
  SelectedFilterLabels,
  VideoData,
  PurchaseData,
  dataGettingState,
  RegistrationStatusKey,
  verificationCode,
} from "../interfaces/interfaces";
import { NavigateFunction } from "react-router-dom";

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
  setVerificationCode : React.Dispatch<React.SetStateAction<verificationCode>>
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
    setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
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
  SelectProps<TypesOfSets, "setChannelData" | "setUserData"> & {
    channelData: ChannelData | null;
    SimilarChannelData: ChannelData | null;
    csrfToken: string;
    isFilter: boolean;
  };

export type PurchasesProps = SelectProps<CommonTypes, "userData"> &
  SelectProps<TypesOfSets, "setUserData"> & {
    csrfToken: string;
  };

export type CheckCookiesProps = {
  setIsCookieClosed: React.Dispatch<React.SetStateAction<boolean>>;
} & SelectProps<TypesOfSets, "setIsLoggedIn" | "setUserData">;

export type FilterFetchesProps = SelectProps<TypesOfSets, "setChannelData"> & {
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

export type GoogleLogInButtonProps = {
  response: CredentialResponse;
} & SelectProps<
  TypesOfSets,
  "setIsLoggedIn" | "setUserData" | "setIsModalOpened"
>;

export type GoogleLogInButtonPropsWithoutResponse = SelectProps<
  TypesOfSets,
  "setIsLoggedIn" | "setUserData" | "setIsModalOpened"
>;

export type SearchFetchProps = {
  e: React.FormEvent;
  mainInputValue: string;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  csrfToken: string;
} & SelectProps<TypesOfSets, "setChannelData">;

export type RemoveSelectedFilterProps = {
  index: number;
  setRemovingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedFilterLabels: React.Dispatch<
    React.SetStateAction<SelectedFilterLabels[]>
  >;
};

export type AddSelectedFilterProps = {
  label: string;
  type: string;
  min: number | null;
  max: number | null;
  setSelectedFilterLabels: React.Dispatch<
    React.SetStateAction<SelectedFilterLabels[]>
  >;
};

export type SearchWithMultiplyFiltersProps = {
  setIsFiltersFetching: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFilterLabels: SelectedFilterLabels[];
} & SelectProps<TypesOfSets, "setChannelData">;

export type ResetSelectedFiltersProps = {
  setSelectedFilterLabels: React.Dispatch<
    React.SetStateAction<SelectedFilterLabels[]>
  >;
};

export type ValidateAndSendReviewProps = {
  reviewText: string;
  websiteMark: number;
  setIsFeedbackWillBeWrited: React.Dispatch<React.SetStateAction<boolean>>;
};

export type HandleRecaptchaChangeProps = {
  value: string | null;
} & SelectProps<TypesOfSets, "setSignInData">;

export type HandleLogInProps = {
  e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>;
  logInData: LogInData;
  modalRef: RefObject<HTMLDivElement | null>;
  modalButtonRef: RefObject<HTMLButtonElement | null>;
  setIsUserMakeAMistake: React.Dispatch<React.SetStateAction<number>>;
} & SelectProps<TypesOfSets, "setIsLoggedIn" | "setUserData">;

export type HandleValidationErrorProps = {
  modalButtonRef: RefObject<HTMLButtonElement | null>;
} & SelectProps<TypesOfSets, "setIsLoggedIn">;

export type AnimateModalButtonShakeProps = {
  modalButtonRef: RefObject<HTMLButtonElement | null>;
};

export type HandleLogInErrorProps = {
  setIsUserMakeAMistake: React.Dispatch<React.SetStateAction<number>>;
};

export type ValidateFormData = {
  e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>;
  signInData: SignInData;
  isChecked: boolean;
  emailRegex: RegExp;
  modalRef: RefObject<HTMLDivElement | null>;
  modalButtonRef: RefObject<HTMLButtonElement | null>;
} & SelectProps<
  TypesOfSets,
  "setIsLoggedIn" | "setIsModalOpened" | "setIsDataFilledIn"
>;

export type MakeFetchForCodeProps = {
  signInData: SignInData;
};

export type FetchDataProps = {
  isDataFilledIn: boolean;
  modalRef: RefObject<HTMLDivElement | null>;
  signInData: SignInData;
};

export type HandleNameChangeProps = {
  e: React.ChangeEvent<HTMLInputElement>;
  setLocalName: React.Dispatch<React.SetStateAction<string>>;
  setChangedData: React.Dispatch<React.SetStateAction<ChangedData>>;
};

export type CheckWhatChangeProps = {
  changedData: ChangedData;
  setChangedData: React.Dispatch<React.SetStateAction<ChangedData>>;
};

export type HandleToggleProps = {
  secondYouTubersContainerRef: RefObject<HTMLDivElement | null>;
  triggerBtnRef: RefObject<HTMLButtonElement | null>;
};

export type ToggleMemberListStyleProps = {
  index: number;
  currentGroup: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export type ValidateVideoFindingProps = {
  channelName: string;
  inputValue: string;
  setVideoData: React.Dispatch<React.SetStateAction<VideoData | null>>;
};

export type RemovePurchaseProps = {
  index: number;
  user_id: number;
  channelName: string;
  csrfToken: string;
} & SelectProps<TypesOfSets, "setUserData">;

export type SelectFeatureProps = {
  selectedFeature: string;
  isVoted: boolean;
  setIsVoted: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  userData: UserData;
};

export type HandleButtonClickProps = {
  updatedData: ChannelData;
  buttonId: number;
  dataGettingState: dataGettingState;
  setDataGettingState: React.Dispatch<React.SetStateAction<dataGettingState>>;
  isProcessingRef: RefObject<Record<number, boolean>>;
  userData: UserData;
  csrfToken: string;
  channelData: ChannelData;
} & SelectProps<TypesOfSets, "setUserData" | "setChannelData">;

export type ValidateLogInProps = {
  data: LogInData;
} & SelectProps<TypesOfSets, "setUserData" | "setIsLoggedIn">;

export type FetchDataToDBProps = {
  endpoint: string;
  method: string;
  body?: any | null;
  csrfToken?: string | "";
  withToast?: boolean;
};

export type DeletePurchaseData = {
  channelName: string;
  userId: number;
  csrfToken: string;
};

export type GetEmailProps = {
  csrfToken: string;
  channelId: string;
  setDataGettingState: React.Dispatch<React.SetStateAction<dataGettingState>>;
};

export type ValidatePurchaseDataProps = {
  data: PurchaseData;
  userId: number;
  csrfToken: string;
};

export type ValidateSignInProps = {
  data: SignInData;
};

export type UpdateDataProps = {
  data: ChangedData;
};

export type DeleteProfileProps = {
  userId: number;
  csrfToken: string;
};

export type MakeFetchForCodeDBProps = {
  email: string;
  operationCode? : string;
  isRegistration : boolean;
  setRegistrationStatus? : React.Dispatch<React.SetStateAction<RegistrationStatusKey | null>>
  setStep? : React.Dispatch<React.SetStateAction<number>>;
};

export type IsVerificationCodeCorrectProps = {
  email: string;
  verificationCode: string;
};

export type ChangePasswordProps = {
  newPassword: string;
  email: string;
};

export type ActivatePromocodeProps = {
  promocode: string;
  email: string;
};

export type PaymentProps = {
  user_id: number;
  packageId: number;
  userEmail: string;
};

export type MakeVoteProps = {
  featureName: string;
  user_id: number;
};

export type AddReviewProps = {
  reviewText: string;
  websiteMark: number;
};

export type CheckStatisticsOfVideoProps = {
  type: string;
  channelName: string;
  inputValue: string;
  videoId: string | null;
};

export type SignUpPageProps = {
  signInData: SignInData;
} & SelectProps<TypesOfSets, "setSignInData">;

export type ValidateStepProps = {
  step : number;
  stepKeys : (keyof SignInData)[];
  inputValue : string;
  setError : React.Dispatch<React.SetStateAction<string | null>>
  signInData : SignInData
} & SelectProps<TypesOfSets,"setSignInData">

export type HandleContinueProps = {
  step : number;
  stepKeys : (keyof SignInData)[];
  inputValue : string;
  setError : React.Dispatch<React.SetStateAction<string | null>>
  setTriggerErase : React.Dispatch<React.SetStateAction<"forward" | "backward" | null>>,
  signInData : SignInData
} & SelectProps<TypesOfSets,"setSignInData">

export type Direction = "forward" | "backward" | null;

export type TypeWriterComponentProps = {
  words: string[];
  triggerErase?: Direction; // Управляемый режим
  onEraseComplete?: (direction: "forward" | "backward") => void;
  autoLoop?: boolean; // Автономный режим
  delayBetweenWords?: number;
}

export type SignInValidatorsProps = {
  string : string;
} & SelectProps<TypesOfSets,"setSignInData">

export type ValidateCaptchaAndAgreementProps = {
  signInData : SignInData
}

export type CheckIfReadyToContinueProps = {
  stepKeys : (keyof SignInData)[];
  step : number
  inputValue : string
  setError : React.Dispatch<React.SetStateAction<string | null>>
  setTriggerErase : React.Dispatch<React.SetStateAction<"forward" | "backward" | null>>,
} & SelectProps<TypesOfSets,"setSignInData">

export type HandleChangeCodeInputProps<T> = {
  index : number;
  code  : string;
  values : string[]
  setValues : React.Dispatch<React.SetStateAction<string[]>>
  onComplete: (code: string) => void
  inputsRef : RefObject<(HTMLInputElement | null)[]>
  setData : React.Dispatch<React.SetStateAction<T>>
} 

export type HandleKeyDownProps = {
  index : number;
  e: React.KeyboardEvent;
  values : string[];
  inputsRef : RefObject<(HTMLInputElement | null)[]>
}

export type HandlePasteProps = {
  e: React.ClipboardEvent;
  values : string[]
  setValues : React.Dispatch<React.SetStateAction<string[]>>
  onComplete: (code: string) => void
  inputsRef : RefObject<(HTMLInputElement | null)[]>
}

export type CodeInputProps<T> = {
  onComplete: (code: string) => void
  setData : React.Dispatch<React.SetStateAction<T>>
}

export type HandleRegisterProps = {
  updatedData : SignInData
  setRegistrationStatus : React.Dispatch<React.SetStateAction<RegistrationStatusKey | null>>
  setHide : React.Dispatch<React.SetStateAction<boolean>>
}

export type LogInPageProps = {
  logInData : LogInData;
} & SelectProps<TypesOfSets,"setLogInData" | "setUserData" | "setIsLoggedIn"> & SelectProps<CommonTypes,"userData">

export type LogInFunctionProps = {
    logInData : LogInData
    setLogInStatus : React.Dispatch<React.SetStateAction<string | "success" | "fail">>
    setIsLoading : React.Dispatch<React.SetStateAction<boolean>>
    setError : React.Dispatch<React.SetStateAction<string>>
    setHide : React.Dispatch<React.SetStateAction<boolean>>
} & SelectProps<TypesOfSets,"setUserData" | "setIsLoggedIn">


export type ForgotPasswordProps = {
  email : string;
  setHide : React.Dispatch<React.SetStateAction<boolean>>
}

export const defaultUserData: UserData = {
  channels: [],
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

