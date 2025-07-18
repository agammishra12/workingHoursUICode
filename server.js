import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-here';

app.use(cors());
app.use(express.json());

// Mock user data
const users = [
  { id: 1, username: 'admin', email: 'admin@company.com', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' } // password: 'password'
];

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Allow any credentials for demo purposes
  if (username && password) {
    const user = { id: 1, username, email: `${username}@company.com` };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      message: 'Login successful',
      token,
      user
    });
  } else {
    res.status(400).json({ message: 'Username and password required' });
  }
});

// Zing credentials endpoint
app.post('/api/zing-credentials', authenticateToken, (req, res) => {
  const { companyCode, employeeCode, password, startDate, endDate } = req.body;
  
  // Simulate validation
  if (!companyCode || !employeeCode || !password) {
    return res.status(400).json({ message: 'All Zing credentials are required' });
  }
  
  res.json({
    message: 'Zing credentials validated successfully',
    data: { companyCode, employeeCode, startDate, endDate }
  });
});

// Manual calculation endpoint
app.post('/api/calculate-manual', authenticateToken, (req, res) => {
  const { swipeDetails } = req.body;
  
  try {
    const result = calculateWorkingHours(swipeDetails);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error calculating working hours: ' + error.message
    });
  }
});

// Auto calculation endpoint (simulated)
app.post('/api/calculate-auto', authenticateToken, (req, res) => {
  const { companyCode, employeeCode, startDate, endDate } = req.body;
  
  // Simulate employee data retrieval
  const mockEmployeeData = [
    {
      employeeCode: employeeCode,
      employeeName: 'John Doe',
      email: `${employeeCode}@company.com`,
      date: startDate,
      firstIn: '09:15',
      lastOut: '18:30',
      officeHours: '09:15',
      swipeDetails: '09:15, 12:30, 13:30, 18:30',
      totalWorkingHours: '07:15',
      breakTime: '01:00',
      needToCover: '00:00',
      totalHours: '09:15'
    }
  ];
  
  res.json({
    success: true,
    data: mockEmployeeData
  });
});

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});