export interface Diary {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}

export interface NewDiary {
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}

export interface ErrMessage {
  errMessage: string;
}

export interface ErrMessageSetter {
  setErrMessage: React.Dispatch<React.SetStateAction<string>>;
}
