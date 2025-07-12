
export interface VideoData {
  title: string;
  thumbnail: string;
  videoId : string;
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
  channels: PurchasedChannelData[];
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
  email : string,
  password : string,
  username : string,
  recaptchaValue : string | null,
  verification_code : string,
  isAgreed : boolean
}

export interface LogInData {
  email : string,
  password : string
}

export interface ChannelData {
  updatedData : {
    channel_name : string,
    targetAudience : string,
    subsCount : number,
    contenttype : string,
    thumbnail : string,
    channelId : string,
    email : string
  }
}

export interface PurchasedChannelData {
  thumbnail : string
  email : string
  channel_name : string
}

export interface SelectedFilterLabels {
  type : string
  value : string | number[]
  min : number | null 
  max : number | null 
}

export interface FilterData {
  content_type : string | null | number[]
  age_group : string | null | number[]
  minsubs : number | null
  maxsubs : number | null
}

export interface ChangedData {
  username : string
  changeMethod : string
  oldPassword : string
  newPassword : string
  user_id : number
}

export interface SelectedPackage  {
    packageName: string
    usesQuantity: number
    price: number
    isBusiness: boolean
    packageId: number
}

export interface dataGettingState {
  state : "default" | "success" | "fail"
}

export const statusMessages = {
  ok: {
    title: "Alright, you all set!",
    emoji: "✅"
  },
  invalid: {
    title: "Sorry, an error occurred. Please check your email and come back later.",
    emoji: "❌"
  },
  exists: {
    title: "The email you want to use already has an account linked to it.",
    emoji: "🤔"
  },
  wrong: {
    title: "Something went wrong. Try again.",
    emoji: "🚫"
  }
} as const;

export interface verificationCode {
  verification_code : string
}

export type RegistrationStatusKey = keyof typeof statusMessages;

