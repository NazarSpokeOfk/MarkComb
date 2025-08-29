export interface VideoData {
  title: string;
  thumbnail: string;
  videoId: string;
  analitics?: {
    views: number;
    likes: number;
  };
}

export interface DataToDBParams {
  setIsLoggedIn?: (value: boolean) => void;
  setUserData?: (userData: any) => void;
  setIsModalOpened?: (isOpen: boolean) => void;
  setVideoData?: (videoData: VideoData) => void;
}

export interface PurchaseData {
  email: string;
  thumbnail: string;
  channelName: string;
}

export interface UserData {
  channels: PurchasedChannelData[] | [];
  userInformation: {
    csrfToken: string;
    email: string;
    isSubscriber: boolean;
    isVoteEnabled: boolean;
    subscription_expiration: Date | string;
    user_id: number;
    username: string;
    uses: number;
  };
}

export interface SignInData {
  email: string;
  password: string;
  username: string;
  recaptchaValue: string | null;
  verification_code: string;
  isAgreed: boolean;
}

export interface LogInData {
  email: string;
  password: string;
}

export interface ChannelData {
  channel_name: string;
  targetAudience: string;
  subsCount: number;
  content_type: string;
  thumbnail: string;
  channelId: string;
  email: string;
}

export interface PurchasedChannelData {
  thumbnail: string;
  email: string;
  channel_name: string;
  transaction_id: number;
}

export interface SelectedFilterLabels {
  type: string;
  value: string | number[];
  min: number | null;
  max: number | null;
}

export interface FilterData {
  content_type: string | null | number[];
  age_group: string | null | number[];
  minsubs: number | null;
  maxsubs: number | null;
}

export interface ChangedData {
  changeMethod: string;
  newValue: string;
  user_id: number;
}

export interface SelectedPackage {
  name: string;
  price: number;
  packageId: number;
}

export interface dataGettingState {
  state: "default" | "success" | "fail";
}

export interface PressedButton {
  first: boolean;
  second: boolean;
  third: boolean;
}

export const statusMessages = {
  ok: {
    title: "Alright, you all set!",
    emoji: "✅",
  },
  invalid: {
    title: "Apparently, you have entered the wrong code. Try again",
    emoji: "❌",
  },
  exists: {
    title: "The email you want to use already has an account linked to it.",
    emoji: "🤔",
  },
  wrong: {
    title: "Something went wrong. Try again.",
    emoji: "🚫",
  },
  changed: {
    title: "Password was changed.",
    emoji: "✅",
  },
  successfullPurchase: {
    title: "Thank you for your purchase.",
    emoji: "✅",
  },
  successfullDeleting : {
    title : "We have deleted your account.",
    emoji : "👨‍💻"
  }
} as const;

export interface verificationCode {
  verification_code: string;
}

export interface NewUserData {
  password: string;
  username: string;
}

export interface IsDataChanged {
  isDataChanged: boolean;
  whatChanged: keyof NewUserData | null;
}

export interface Status {
  status: boolean;
  message: string;
}

export interface CodeStatus {
  isCodeCorrect: boolean | null;
  code: string | null;
  isCodeSent: boolean | null;
}
export type RegistrationStatusKey = keyof typeof statusMessages;
