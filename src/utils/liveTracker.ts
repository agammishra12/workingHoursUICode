import { WorkingHoursData } from '../types';

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

function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function addMinutesToTime(timeString: string, minutesToAdd: number): string {
  const [hours, minutes] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

export function calculateLiveHours(timeString: string): LiveTrackingData {
  // Parse the input string and create array of times
  const swipeTimes = timeString.split(',').map(time => convertTo24Hour(time.trim())).filter(time => time);
  
  if (swipeTimes.length === 0) {
    throw new Error('No time entries provided');
  }
  
  if (swipeTimes.length % 2 === 0) {
    throw new Error('Live tracker requires incomplete swipe data (odd number of entries). Use the Daily Calculator for complete data.');
  }

  // Validate time format
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  for (const time of swipeTimes) {
    if (!timeRegex.test(time)) {
      throw new Error(`Invalid time format: ${time}. Use HH:MM format (24-hour) or HH:MM AM/PM format (12-hour).`);
    }
  }

  // Remove duplicate consecutive times but keep the structure for live tracking
  const cleanedTimes = [];
  for (let i = 0; i < swipeTimes.length; i++) {
    // For live tracking, we need to be more careful about removing duplicates
    // Only remove if we have a pair of same times
    if (i < swipeTimes.length - 1 && swipeTimes[i] === swipeTimes[i + 1]) {
      i++; // Skip both times
      continue;
    }
    cleanedTimes.push(swipeTimes[i]);
  }

  // Ensure we still have odd number of entries for live tracking
  if (cleanedTimes.length === 0) {
    throw new Error('No valid swipe data found after cleaning.');
  }

  if (cleanedTimes.length % 2 === 0) {
    throw new Error('After cleaning, even number of entries found. Live tracker needs incomplete data.');
  }
  const currentTime = getCurrentTime();
  const currentTimeMinutes = parseTime(currentTime);
  
  // Determine if currently working (last entry should be a punch-in)
  const isCurrentlyWorking = cleanedTimes.length % 2 === 1;
  
  // Calculate working time so far
  let totalWorkingMinutes = 0;
  
  // Process complete pairs
  for (let i = 0; i < cleanedTimes.length - 1; i += 2) {
    const startTime = parseTime(cleanedTimes[i]);
    const endTime = parseTime(cleanedTimes[i + 1]);
    
    if (endTime <= startTime) {
      // Handle next day scenario or skip if same time
      if (endTime < startTime) {
        const nextDayEndTime = endTime + (24 * 60);
        const sessionMinutes = nextDayEndTime - startTime;
        if (sessionMinutes > 0 && sessionMinutes <= 16 * 60) {
          totalWorkingMinutes += sessionMinutes;
        }
      }
      continue;
    }
    
    const sessionMinutes = endTime - startTime;
    if (sessionMinutes >= 1) {
      totalWorkingMinutes += sessionMinutes;
    }
  }
  
  // Add current working session if currently working
  if (isCurrentlyWorking) {
    const lastPunchIn = parseTime(cleanedTimes[cleanedTimes.length - 1]);
    if (currentTimeMinutes < lastPunchIn) {
      throw new Error('Current time cannot be before the last punch-in time. Please check your data.');
    }
    totalWorkingMinutes += currentTimeMinutes - lastPunchIn;
  }

  // Calculate total office time
  const firstPunch = parseTime(cleanedTimes[0]);
  const totalOfficeMinutes = currentTimeMinutes - firstPunch;

  // Calculate total break time
  let totalBreakMinutes = 0;
  for (let i = 1; i < cleanedTimes.length - 1; i += 2) {
    const outTime = parseTime(cleanedTimes[i]);
    const inTime = parseTime(cleanedTimes[i + 1]);
    const breakDuration = inTime - outTime;
    if (breakDuration > 0) {
      totalBreakMinutes += breakDuration;
    }
  }
  
  // If currently on break, add current break time
  if (!isCurrentlyWorking && cleanedTimes.length > 1) {
    const lastPunchOut = parseTime(cleanedTimes[cleanedTimes.length - 1]);
    const currentBreakTime = currentTimeMinutes - lastPunchOut;
    if (currentBreakTime > 0) {
      totalBreakMinutes += currentBreakTime;
    }
  }

  // Calculate remaining time needed (8:30 target)
  const targetMinutes = 8 * 60 + 30; // 8:30 in minutes
  const remainingMinutes = Math.max(0, targetMinutes - totalWorkingMinutes);
  
  // Calculate completion time
  let completionTime = '';
  let completionMessage = '';
  if (remainingMinutes > 0) {
    if (isCurrentlyWorking) {
      // If currently working, add remaining time to current time
      completionTime = addMinutesToTime(currentTime, remainingMinutes);
      completionMessage = 'If you continue working without breaks';
    } else {
      // If on break, completion time is current time + remaining time (when they resume)
      completionTime = addMinutesToTime(currentTime, remainingMinutes);
      completionMessage = 'When you resume working (excluding current break time)';
    }
  } else {
    completionTime = 'Already completed!';
    const extraMinutes = totalWorkingMinutes - targetMinutes;
    const extraHours = Math.floor(extraMinutes / 60);
    const extraMins = extraMinutes % 60;
    completionMessage = `Completed ${extraHours}:${extraMins.toString().padStart(2, '0')} extra!`;
  }
  
  // Calculate progress percentage
  const progressPercentage = Math.min(Math.round((totalWorkingMinutes / targetMinutes) * 100), 100);
  
  // Determine emoji and achievement level based on progress
  let emoji = '😊';
  let achievementLevel = '';
  
  if (totalWorkingMinutes >= targetMinutes) {
    const extraMinutes = totalWorkingMinutes - targetMinutes;
    if (extraMinutes >= 150) { // 10:00+ hours
      emoji = '🏆';
      achievementLevel = 'Workaholic Champion';
    } else if (extraMinutes >= 90) { // 9:30+ hours  
      emoji = '🥇';
      achievementLevel = 'Gold Performer';
    } else if (extraMinutes >= 30) { // 9:00+ hours
      emoji = '🥈';
      achievementLevel = 'Silver Achiever';
    } else { // 8:30+ hours
      emoji = '🥉';
      achievementLevel = 'Bronze Finisher';
    }
  } else if (totalWorkingMinutes >= targetMinutes - 30) {
    emoji = '😐'; // Neutral if close
  } else if (totalWorkingMinutes >= targetMinutes - 120) {
    emoji = '😕'; // Slightly disappointed
  } else {
    emoji = '😞'; // Disappointed
  }
  
  // Add working status to emoji
  if (isCurrentlyWorking) {
    emoji = '💼 ' + emoji; // Add briefcase for working
  } else {
    emoji = '☕ ' + emoji; // Add coffee for break
  }

  return {
    currentTime,
    currentWorkingTime: formatTime(totalWorkingMinutes),
    currentWorkingHours: Math.floor(totalWorkingMinutes / 60),
    currentWorkingMinutes: totalWorkingMinutes % 60,
    totalOfficeTime: formatTime(totalOfficeMinutes),
    totalBreakTime: formatTime(totalBreakMinutes),
    remainingTime: formatTime(remainingMinutes),
    remainingHours: Math.floor(remainingMinutes / 60),
    remainingMinutes: remainingMinutes % 60,
    completionTime,
    completionMessage,
    achievementLevel,
    progressPercentage,
    isCurrentlyWorking,
    emoji,
  };
}