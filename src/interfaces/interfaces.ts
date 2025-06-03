

export interface VideoData {
  title: string;
  thumbnail: string;
  analitics?: {
    views : number,
    likes : number
  };
}

export interface DataToDBParams {
  setIsLoggedIn?: (value: boolean) => void;
  setUserData?: (userData: any) => void;
  setIsModalOpened?: (isOpen: boolean) => void;
  setCsrfToken?: (token: string) => void;
  setVideoData?: (videoData: VideoData) => void;
}

export interface PurchaseData {
  email: string;
  thumbnail: string;
  channelName: string;
  uses: number;
}
