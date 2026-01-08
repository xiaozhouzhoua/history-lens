export interface HistoryEvent {
  year: string;
  month: string;
  day: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  visualPrompt: string;
  themeColor: string; // Hex code for accent
  secondaryColor: string;
}

export interface CalendarData {
  year: number;
  month: number; // 0-11
  currentDay: number;
  daysInMonth: number;
  startDayOfWeek: number; // 0 (Sun) - 6 (Sat)
}

export enum FetchState {
  IDLE = 'IDLE',
  LOADING_TEXT = 'LOADING_TEXT',
  LOADING_IMAGE = 'LOADING_IMAGE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}