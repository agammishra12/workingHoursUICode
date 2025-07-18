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
    const { companyCode, employeeCode, startDate, endDate } = JSON.parse(event.body);
    
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
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: mockEmployeeData
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 