import { WorkingHoursData } from '../types';

// Helper function to convert 12-hour format to 24-hour format
function convertTo24Hour(timeString: string): string {
  const time = timeString.trim().toLowerCase();
  
  // Check if it's already in 24-hour format
  if (!/am|pm/.test(time)) {
    return time;
  }
  
  const [timePart, period] = time.split(/\s*(am|pm)\s*/);
  const [hours, minutes] = timePart.split(':').map(num => parseInt(num, 10));
  
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid time format: ${timeString}`);
  }
  
  let hour24 = hours;
  
  if (period === 'am') {
    if (hours === 12) hour24 = 0;
  } else if (period === 'pm') {
    if (hours !== 12) hour24 = hours + 12;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export interface WeeklyData {
  day: string;
  workingTime: string;
  workingHours: number;
  workingMinutes: number;
  missedTime: string;
  missedHours: number;
  missedMinutes: number;
  emoji: string;
}

export interface WeeklyResults {
  dailyResults: WeeklyData[];
  averageWorkingTime: string;
  averageWorkingHours: number;
  averageWorkingMinutes: number;
  totalWeeklyHours: string;
  averageMissedTime: string;
  overallEmoji: string;
}

export function calculateWeeklyHours(weeklyEntries: string[]): WeeklyResults {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dailyResults: WeeklyData[] = [];
  let totalWorkingMinutes = 0;
  let validDays = 0;

  for (let i = 0; i < 7; i++) {
    const timeEntry = weeklyEntries[i]?.trim();
    
    if (!timeEntry) {
      dailyResults.push({
        day: days[i],
        workingTime: '00:00',
        workingHours: 0,
        workingMinutes: 0,
        missedTime: '08:30',
        missedHours: 8,
        missedMinutes: 30,
        emoji: '😴'
      });
      continue;
    }

    try {
      const dayData = calculateWorkingHours(timeEntry);
      const dayWorkingMinutes = dayData.totalWorkingHours * 60 + dayData.totalWorkingMinutes;
      totalWorkingMinutes += dayWorkingMinutes;
      validDays++;

      // Calculate missed time based on 8:30 target
      const targetMinutes = 8 * 60 + 30; // 8:30 in minutes
      const missedMinutes = Math.max(0, targetMinutes - dayWorkingMinutes);
      
      // Determine emoji based on performance
      let emoji = '😊'; // Default happy
      if (dayWorkingMinutes >= targetMinutes) {
        emoji = dayWorkingMinutes >= targetMinutes + 60 ? '🎉' : '😊'; // Celebration if over 9:30, happy if over 8:30
      } else if (dayWorkingMinutes >= targetMinutes - 30) {
        emoji = '😐'; // Neutral if close
      } else if (dayWorkingMinutes >= targetMinutes - 120) {
        emoji = '😕'; // Slightly disappointed
      } else {
        emoji = '😞'; // Disappointed
      }

      dailyResults.push({
        day: days[i],
        workingTime: dayData.totalWorkingTime,
        workingHours: dayData.totalWorkingHours,
        workingMinutes: dayData.totalWorkingMinutes,
        missedTime: formatTime(missedMinutes),
        missedHours: Math.floor(missedMinutes / 60),
        missedMinutes: missedMinutes % 60,
        emoji
      });
    } catch (error) {
      dailyResults.push({
        day: days[i],
        workingTime: '00:00',
        workingHours: 0,
        workingMinutes: 0,
        missedTime: '08:30',
        missedHours: 8,
        missedMinutes: 30,
        emoji: '❌'
      });
    }
  }

  // Calculate averages
  const averageMinutes = validDays > 0 ? Math.round(totalWorkingMinutes / validDays) : 0;
  const targetMinutes = 8 * 60 + 30;
  const averageMissedMinutes = Math.max(0, targetMinutes - averageMinutes);
  
  // Overall emoji based on average
  let overallEmoji = '😊';
  if (averageMinutes >= targetMinutes) {
    overallEmoji = averageMinutes >= targetMinutes + 60 ? '🎉' : '😊';
  } else if (averageMinutes >= targetMinutes - 30) {
    overallEmoji = '😐';
  } else if (averageMinutes >= targetMinutes - 120) {
    overallEmoji = '😕';
  } else {
    overallEmoji = '😞';
  }

  return {
    dailyResults,
    averageWorkingTime: formatTime(averageMinutes),
    averageWorkingHours: Math.floor(averageMinutes / 60),
    averageWorkingMinutes: averageMinutes % 60,
    totalWeeklyHours: formatTime(totalWorkingMinutes),
    averageMissedTime: formatTime(averageMissedMinutes),
    overallEmoji
  };
}

export function calculateWorkingHours(timeString: string): WorkingHoursData {
  // Parse the input string and create array of times
  let swipeTimes = timeString.split(',').map(time => convertTo24Hour(time.trim())).filter(time => time);
  
  if (swipeTimes.length === 0) {
    throw new Error('No time entries provided');
  }

  // Check for and remove duplicate consecutive times
  const originalLength = swipeTimes.length;
  const cleanedTimes = [];
  const duplicates = [];
  
  for (let i = 0; i < swipeTimes.length; i++) {
    if (i === 0 || swipeTimes[i] !== swipeTimes[i - 1]) {
      cleanedTimes.push(swipeTimes[i]);
    } else {
      duplicates.push(swipeTimes[i]);
    }
  }
  
  swipeTimes = cleanedTimes;
  
  // Warn about duplicates if any were found
  if (duplicates.length > 0) {
    console.warn(`⚠️ Removed ${duplicates.length} duplicate consecutive time(s): ${duplicates.join(', ')}`);
  }
  
  if (swipeTimes.length % 2 !== 0) {
    throw new Error('⚠️ Uneven swipes detected! Time entries must be in pairs (in/out). Please check your swipe data.');
  }

  // Validate time format
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  for (const time of swipeTimes) {
    if (!timeRegex.test(time)) {
      throw new Error(`Invalid time format: ${time}. Use HH:MM format (24-hour) or HH:MM AM/PM format (12-hour).`);
    }
  }

  // Calculate total working time
  let totalWorkingMinutes = 0;
  for (let i = 0; i < swipeTimes.length; i += 2) {
    const startTime = parseTime(swipeTimes[i]);
    const endTime = parseTime(swipeTimes[i + 1]);
    
    if (endTime <= startTime) {
      throw new Error(`End time must be after start time: ${swipeTimes[i]} -> ${swipeTimes[i + 1]}`);
    }
    
    totalWorkingMinutes += endTime - startTime;
  }

  // Calculate total office time
  const firstPunch = parseTime(swipeTimes[0]);
  const lastPunch = parseTime(swipeTimes[swipeTimes.length - 1]);
  const totalOfficeMinutes = lastPunch - firstPunch;

  // Calculate total break time
  let totalBreakMinutes = 0;
  for (let i = 1; i < swipeTimes.length - 1; i += 2) {
    const outTime = parseTime(swipeTimes[i]);
    const inTime = parseTime(swipeTimes[i + 1]);
    totalBreakMinutes += inTime - outTime;
  }

  // Calculate missed hours (assuming 9 hours expected)
  const expectedWorkMinutes = 8 * 60 + 30; // 8:30 hours in minutes
  const missedMinutes = Math.max(0, expectedWorkMinutes - totalWorkingMinutes);

  // Determine emoji based on performance
  let emoji = '😊'; // Default happy
  if (totalWorkingMinutes >= expectedWorkMinutes) {
    emoji = totalWorkingMinutes >= expectedWorkMinutes + 60 ? '🎉' : '😊'; // Celebration if over 9:30, happy if over 8:30
  } else if (totalWorkingMinutes >= expectedWorkMinutes - 30) {
    emoji = '😐'; // Neutral if close
  } else if (totalWorkingMinutes >= expectedWorkMinutes - 120) {
    emoji = '😕'; // Slightly disappointed
  } else {
    emoji = '😞'; // Disappointed
  }

  // Office time emoji (9 hours target)
  const expectedOfficeMinutes = 9 * 60; // 9 hours in minutes
  let officeEmoji = '😊'; // Default
  if (totalOfficeMinutes >= expectedOfficeMinutes) {
    officeEmoji = '👏'; // Clapping emoji for 9+ hours in office
  } else if (totalOfficeMinutes >= expectedOfficeMinutes - 30) {
    officeEmoji = '😐'; // Close to 9 hours
  } else {
    officeEmoji = '😕'; // Less than target
  }

  return {
    totalWorkingTime: formatTime(totalWorkingMinutes),
    totalWorkingHours: Math.floor(totalWorkingMinutes / 60),
    totalWorkingMinutes: totalWorkingMinutes % 60,
    totalOfficeTime: formatTime(totalOfficeMinutes),
    totalOfficeHours: Math.floor(totalOfficeMinutes / 60),
    totalOfficeMinutes: totalOfficeMinutes % 60,
    totalBreakTime: formatTime(totalBreakMinutes),
    totalBreakHours: Math.floor(totalBreakMinutes / 60),
    totalBreakMinutes: totalBreakMinutes % 60,
    missedHours: formatTime(missedMinutes),
    missedHoursNum: Math.floor(missedMinutes / 60),
    missedMinutesNum: missedMinutes % 60,
    emoji,
    officeEmoji,
  };
}

function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}