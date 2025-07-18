const jwt = require('jsonwebtoken');

// Auth middleware function
const authenticateToken = (event) => {
  const authHeader = event.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
  } catch (err) {
    return null;
  }
};

// Working hours calculation function (converted from Java)
function calculateWorkingHours(swipeDetailsString) {
  if (!swipeDetailsString || swipeDetailsString.trim() === '') {
    throw new Error('Swipe details cannot be empty');
  }

  const swipeTimes = swipeDetailsString.split(',').map(time => time.trim());
  
  // Remove duplicate consecutive times
  if (swipeTimes.length > 1 && swipeTimes[0] === swipeTimes[1]) {
    swipeTimes.splice(1, 1);
  }

  const isSwipeUneven = swipeTimes.length % 2 !== 0;
  
  if (isSwipeUneven) {
    return {
      status: 'error',
      message: 'Uneven swipe detected',
      swipeDetails: swipeDetailsString,
      totalWorkingHours: 'N/A',
      breakTime: 'N/A',
      needToCover: 'N/A',
      totalOfficeTime: 'N/A'
    };
  }

  let totalWorkingMinutes = 0;
  for (let i = 0; i < swipeTimes.length; i += 2) {
    const startTime = parseTime(swipeTimes[i]);
    const endTime = parseTime(swipeTimes[i + 1]);
    totalWorkingMinutes += (endTime - startTime);
  }

  const workedHours = Math.floor(totalWorkingMinutes / 60);
  const workedMinutes = totalWorkingMinutes % 60;
  const workedTime = `${workedHours.toString().padStart(2, '0')}:${workedMinutes.toString().padStart(2, '0')}`;

  const firstPunch = parseTime(swipeTimes[0]);
  const lastPunch = parseTime(swipeTimes[swipeTimes.length - 1]);
  const totalOfficeMinutes = lastPunch - firstPunch;
  const totalOfficeHours = Math.floor(totalOfficeMinutes / 60);
  const totalOfficeMins = totalOfficeMinutes % 60;
  const totalOfficeTime = `${totalOfficeHours.toString().padStart(2, '0')}:${totalOfficeMins.toString().padStart(2, '0')}`;

  let totalBreakMinutes = 0;
  for (let i = 1; i < swipeTimes.length; i += 2) {
    if (i + 1 < swipeTimes.length) {
      const outTime = parseTime(swipeTimes[i]);
      const inTime = parseTime(swipeTimes[i + 1]);
      totalBreakMinutes += (inTime - outTime);
    }
  }

  const breakHours = Math.floor(totalBreakMinutes / 60);
  const breakMins = totalBreakMinutes % 60;
  const breakTime = `${breakHours.toString().padStart(2, '0')}:${breakMins.toString().padStart(2, '0')}`;

  // Calculate difference from 9 hours
  const requiredMinutes = 9 * 60; // 9 hours in minutes
  let needToCover = 'No diff';
  if (totalWorkingMinutes < requiredMinutes) {
    const diffMinutes = requiredMinutes - totalWorkingMinutes;
    const diffHours = Math.floor(diffMinutes / 60);
    const diffMins = diffMinutes % 60;
    needToCover = `${diffHours.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}`;
  }

  return {
    status: 'success',
    swipeDetails: swipeDetailsString,
    totalWorkingHours: workedTime,
    breakTime: breakTime,
    needToCover: needToCover,
    totalOfficeTime: totalOfficeTime,
    firstIn: swipeTimes[0],
    lastOut: swipeTimes[swipeTimes.length - 1]
  };
}

function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  // Authenticate token
  const user = authenticateToken(event);
  if (!user) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ message: 'Unauthorized' })
    };
  }

  try {
    const { swipeDetails } = JSON.parse(event.body);
    
    const result = calculateWorkingHours(swipeDetails);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Error calculating working hours: ' + error.message
      })
    };
  }
}; 