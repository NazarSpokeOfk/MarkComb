import React, { ImgHTMLAttributes, RefObject } from "react";
import { CredentialResponse } from "@react-oauth/google";
import { IconProps } from "react-toastify";
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
  statusMessages,
  NewUserData,
  IsDataChanged,
  Status,
  CodeStatus,
  PurchasedChannelData,
  CurrentAnalytics,
  InformationBlock,
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
  setIsDataFilledIn: React.Dispatch<React.SetStateAction<boolean>>;
  setLogInData: React.Dispatch<React.SetStateAction<LogInData>>;
  setSignInData: React.Dispatch<React.SetStateAction<SignInData>>;
  setIsPasswordWillBeReset: React.Dispatch<React.SetStateAction<boolean>>;
  setVerificationCode: React.Dispatch<React.SetStateAction<verificationCode>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setHide: React.Dispatch<React.SetStateAction<boolean>>;
  setRegistrationStatus: React.Dispatch<
    React.SetStateAction<RegistrationStatusKey | null>
  >;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentAnalytics : React.Dispatch<React.SetStateAction<CurrentAnalytics | null>>
  setHasOldAnalytics : React.Dispatch<React.SetStateAction<boolean>>
};

type SelectProps<T, K extends keyof T> = Pick<T, K>;

type PartialSelectProps<T, K extends keyof T> = Partial<Pick<T, K>>;

export type MainPageProps = SelectProps<TypesOfSets, "setIsFilterCTAActive">;

export type HeaderFilterProps = SelectProps<
  TypesOfSets,
  | "setChannelData"
  | "setSimilarChannelData"
  | "setIsLoggedIn"
  | "setUserData"
  | "setSignInData"
  | "setLogInData"
  | "setEntryMethod"
> &
  CommonTypes & {
    signInData: SignInData;
    logInData: LogInData;
    csrfToken: string;
    isFilterCTAActive: boolean;
    entryMethod: string;
    setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
  };

export type ModalProps = SelectProps<
  TypesOfSets,
  | "setIsLoggedIn"
  | "setUserData"
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
  ageGroup: string | null | number[];
  minSubs: number | null;
  maxSubs: number | null;
  setIsFiltersFetching: React.Dispatch<React.SetStateAction<boolean>>;
};

export type HeaderProps = {
  userData: UserData;
  isLoggedIn: boolean;
};

export type ForbiddenThumbnailProps = SelectProps<
  TypesOfSets,
  "setUserData" | "setIsLoggedIn"
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
} & SelectProps<TypesOfSets, "setIsLoggedIn" | "setUserData">;

export type GoogleLogInButtonPropsWithoutResponse = {
  setLogInStatus: React.Dispatch<
    React.SetStateAction<string | "success" | "fail">
  >;
} & SelectProps<TypesOfSets, "setIsLoggedIn" | "setUserData">;

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
} & SelectProps<TypesOfSets, "setIsLoading" | "setCurrentAnalytics" | "setHasOldAnalytics">;

export type RemovePurchaseProps = {
  user_id: number;
  channelName: string;
  csrfToken: string;
  contentRefs: RefObject<HTMLDivElement[]>;
  transaction_id: number;
} & SelectProps<TypesOfSets, "setUserData">;

export type SelectFeatureProps = {
  selectedFeature: string;
  isVoted: boolean;
  setIsVoted: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  userData: UserData;
};

export type HandleButtonClickProps = {
  updatedData: ChannelData | null;
  isProcessingRef: RefObject<Record<number, boolean>>;
  userData: UserData;
  csrfToken: string;
  channelData: ChannelData | null;
  setContactDataStatus: React.Dispatch<
    React.SetStateAction<"default" | "fail" | "success">
  >;
} & SelectProps<TypesOfSets, "setUserData" | "setChannelData" | "setError">;

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
  setContactDataStatus: React.Dispatch<
    React.SetStateAction<"default" | "fail" | "success">
  >;
};

export type ValidatePurchaseDataProps = {
  data: PurchaseData;
  userId: number;
  csrfToken: string;
  setContactDataStatus: React.Dispatch<
    React.SetStateAction<"default" | "fail" | "success">
  >;
} & SelectProps<TypesOfSets, "setError">;

export type ValidateSignInProps = {
  data: SignInData;
};

export type UpdateDataProps = {
  data: ChangedData;
};

export type DeletingAccountProps = {
  email: string;
};

export type MakeFetchForCodeDBProps = {
  email: string;
  isRegistration: boolean;
  setStep?: React.Dispatch<React.SetStateAction<number>>;
  action: "signIn" | "delete" | "reset";
} & PartialSelectProps<TypesOfSets, "setRegistrationStatus">;

export type IsVerificationCodeCorrectProps = {
  email: string;
  verificationCode: string;
};

export type ChangePasswordProps = {
  newPassword: string;
  token : string
};

export type ChangePasswordWrapperProps = {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReseted : React.Dispatch<React.SetStateAction<boolean>>
} & SelectProps<TypesOfSets, "setIsLoading"> & ChangePasswordProps;

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
  channelName: string;
  inputValue: string;
} & SelectProps<TypesOfSets, "setIsLoading" | "setCurrentAnalytics" | "setHasOldAnalytics">;

export type SignUpPageProps = {
  signInData: SignInData;
} & SelectProps<TypesOfSets, "setSignInData" | "setIsLoggedIn" | "setUserData">;

export type ValidateStepProps = {
  step: number;
  stepKeys: (keyof SignInData)[];
  inputValue: string;
  signInData: SignInData;
} & SelectProps<TypesOfSets, "setSignInData" | "setError">;

export type HandleContinueProps = {
  step: number;
  stepKeys: (keyof SignInData)[];
  inputValue: string;
  setTriggerErase: React.Dispatch<
    React.SetStateAction<"forward" | "backward" | null>
  >;
  signInData: SignInData;
} & SelectProps<TypesOfSets, "setSignInData" | "setError">;

export type Direction = "forward" | "backward" | null;

export type TypeWriterComponentProps = {
  words: string[];
  triggerErase?: Direction; // Управляемый режим
  onEraseComplete?: (direction: "forward" | "backward") => void;
  autoLoop?: boolean; // Автономный режим
  delayBetweenWords?: number;
};

export type SignInValidatorsProps = {
  string: string;
} & SelectProps<TypesOfSets, "setSignInData">;

export type ValidateCaptchaAndAgreementProps = {
  signInData: SignInData;
};

export type CheckIfReadyToContinueProps = {
  stepKeys: (keyof SignInData)[];
  step: number;
  inputValue: string;
  setTriggerErase: React.Dispatch<
    React.SetStateAction<"forward" | "backward" | null>
  >;
} & SelectProps<TypesOfSets, "setSignInData" | "setError">;

export type HandleChangeCodeInputProps<T> = {
  index: number;
  code: string;
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  onComplete: (code: string) => void;
  inputsRef: RefObject<(HTMLInputElement | null)[]>;
  setData: React.Dispatch<React.SetStateAction<T>>;
};

export type HandleKeyDownProps = {
  index: number;
  e: React.KeyboardEvent;
  values: string[];
  inputsRef: RefObject<(HTMLInputElement | null)[]>;
};

export type HandlePasteProps = {
  e: React.ClipboardEvent;
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  onComplete: (code: string) => void;
  inputsRef: RefObject<(HTMLInputElement | null)[]>;
};

export type CodeInputProps<T> = {
  onComplete: (code: string) => void;
  setData: React.Dispatch<React.SetStateAction<T>>;
};

export type HandleRegisterProps = {
  updatedData: SignInData;
} & SelectProps<
  TypesOfSets,
  "setHide" | "setRegistrationStatus" | "setIsLoggedIn" | "setUserData"
>;

export type LogInPageProps = {
  logInData: LogInData;
} & SelectProps<TypesOfSets, "setLogInData" | "setUserData" | "setIsLoggedIn"> &
  SelectProps<CommonTypes, "userData">;

export type LogInFunctionProps = {
  logInData: LogInData;
  setLogInStatus: React.Dispatch<
    React.SetStateAction<string | "success" | "fail">
  >;
} & SelectProps<
  TypesOfSets,
  "setUserData" | "setIsLoggedIn" | "setError" | "setIsLoading"
>;

export type ForgotPasswordProps = {
  email: string;
  setIsPasswordWillBeReset: React.Dispatch<React.SetStateAction<boolean>>;
} & SelectProps<TypesOfSets, "setError">;

export type IsVerificationCodeCorrectLogInPageProps = {
  email: string;
  verificationCode: string;
  setIsVerificationCodeCorrect: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPasswordWillBeReset: React.Dispatch<React.SetStateAction<boolean>>;
} & SelectProps<TypesOfSets, "setError">;

export type SetNewPasswordProps = {
  email: string;
  newPassword: string;
  setIsPasswordChangedSuccessfully: React.Dispatch<
    React.SetStateAction<RegistrationStatusKey | null>
  >;
  setIsVerificationCodeCorrect: React.Dispatch<React.SetStateAction<boolean>>;
} & SelectProps<TypesOfSets, "setError">;

export type AuthorizationThumbnailProps = {
  thumbnailRef: RefObject<HTMLDivElement | null>;
  statusMessages: typeof statusMessages;
  status: RegistrationStatusKey;
};

export type ShowInputOrNotProps = {
  step: number;
} & SelectProps<TypesOfSets, "setHide">;

export type CheckIsCaptchaAndTermsPassedProps = {
  signInData: SignInData;
  step: number;
  stepKeys: (keyof SignInData)[];
  setStep: React.Dispatch<React.SetStateAction<number>>;
  inputValue: string;
  setTriggerErase: React.Dispatch<
    React.SetStateAction<"forward" | "backward" | null>
  >;
} & SelectProps<
  TypesOfSets,
  "setSignInData" | "setError" | "setRegistrationStatus" | "setIsLoggedIn"
>;

export type ThrowToastOrThumbnailProps = {
  registrationStatus: RegistrationStatusKey;
  statusMessages: typeof statusMessages;
  thumbnailRef: RefObject<HTMLDivElement | null>;
};

export type RedirectToMainPageProps = {
  logInStatus: string | "success" | "fail";
  navigate: NavigateFunction;
};

export type SuccessfullLogInThumbnailProps = {
  thumbnailRef: RefObject<HTMLDivElement | null>;
  userName: string;
  text: string;
};

export type MainFormProps = {
  logInData: LogInData;
  userData: UserData;
  setLogInStatus: React.Dispatch<
    React.SetStateAction<string | "success" | "fail">
  >;
  isLoading: boolean;
  loading: string;
} & SelectProps<
  TypesOfSets,
  | "setLogInData"
  | "setUserData"
  | "setIsLoggedIn"
  | "setIsPasswordWillBeReset"
  | "setError"
  | "setIsLoading"
>;

export type InputProps = {
  whatToChange: React.Dispatch<React.SetStateAction<NewUserData>>;
  whatToWatchFor: keyof NewUserData;
  value: string;
};

export type CurtainProps = {
  action: "password" | "username" | "promocode" | null;
  isCurtainOpen: boolean;
  setIsCurtainOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserData;
} & SelectProps<TypesOfSets, "setUserData">;

export type SaveChangesProps = {
  changeMethod: "password" | "username" | "promocode" | null;
  newValue: string;
  userData: UserData;
  setStatus: React.Dispatch<React.SetStateAction<Status | null>>;
  setIsCurtainOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & SelectProps<TypesOfSets, "setUserData"> &
  SelectProps<TypesOfSets, "setIsLoading">;

export type ValidateUserName = {
  prevUsername: string;
  newUsername: string;
  setStatus: React.Dispatch<React.SetStateAction<Status | null>>;
} & SelectProps<TypesOfSets, "setIsLoading">;

export type SendVerificationCodeProps = {
  email: string;
  setIsCodeSent: React.Dispatch<React.SetStateAction<boolean>>;
};

export type SmoothScrollProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  contentRefs: RefObject<HTMLDivElement[]>;
};

export type HandleDeleteProps = {
  purchaseId: string;
  contentRefs: RefObject<HTMLDivElement[]>;
};

export type OnCardClickActionsProps = {
  resultBlockRef: RefObject<HTMLDivElement | null>;
  setVideoData: React.Dispatch<React.SetStateAction<VideoData | null>>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setChannelName: React.Dispatch<React.SetStateAction<string>>;
  channel: PurchasedChannelData;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  contentRefs: RefObject<HTMLDivElement[]>;
  index: number;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ExpandedPackageInfoProps = {
  name: string;
  textRefs: RefObject<HTMLHeadingElement[]>;
  isPackageExpanded: boolean;
  data: {
    price: number;
    information: string;
    packageId: number;
  };
  userData: UserData;
};

export type ValidatePaymentProps = {
  user_id: number;
  packageId: number;
  userEmail: string;
} & SelectProps<TypesOfSets, "setError" | "setIsLoading">;

export type ClickAnimationProps = {
  contactDataStatus: "default" | "success" | "fail";
  setButtonText: React.Dispatch<React.SetStateAction<"get data" | "✅" | "❌">>;
  buttonRef: RefObject<HTMLButtonElement | null>;
  setContactDataStatus: React.Dispatch<
    React.SetStateAction<"default" | "success" | "fail">
  >;
};

export type MobileMenuProps = {
  dinamicLink: "Authorization" | "Profile";
};

export type ScrollLineProps = {
  stringArray: string[];
  toRight: boolean;
} & SelectProps<TypesOfSets, "setIsFilterCTAActive">;

export type DeletingAccountThumbnailProps = {
  userData: UserData;
};

export type DeleteUserPropsWrapper = {
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
} & DeleteUserProps;

export type DeleteUserProps = {
  token: string;
}

export type InformationBlockProps = {
  differencesInNumbers : number
  differencesInPercents : number
  isBlack : "black" | "" 
}

export type TopPartProps = {
  thumbnail : string
  title : string
  videoId : string
}

export type DividerProps = {
  text : string
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
