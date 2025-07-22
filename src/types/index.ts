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

export interface User {
  id: string;
  email: string;
  name: string;
}