export interface WorkingHoursData {
  totalWorkingTime: string;
  totalWorkingHours: number;
  totalWorkingMinutes: number;
  totalOfficeTime: string;
  totalOfficeHours: number;
  totalOfficeMinutes: number;
  totalBreakTime: string;
  totalBreakHours: number;
  totalBreakMinutes: number;
  missedHours: string;
  missedHoursNum: number;
  missedMinutesNum: number;
  officeEmoji: string;
}

export interface LiveTrackingData {
  currentTime: string;
  currentWorkingTime: string;
  currentWorkingHours: number;
  currentWorkingMinutes: number;
  totalOfficeTime: string;
  totalBreakTime: string;
  remainingTime: string;
  remainingHours: number;
  remainingMinutes: number;
  completionTime: string;
  completionMessage: string;
  achievementLevel: string;
  progressPercentage: number;
  isCurrentlyWorking: boolean;
  emoji: string;
}
export interface User {
  id: string;
  email: string;
  name: string;
}