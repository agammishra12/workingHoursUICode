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
    const { companyCode, employeeCode, password, startDate, endDate } = JSON.parse(event.body);
    
    // Simulate validation
    if (!companyCode || !employeeCode || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'All Zing credentials are required' })
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Zing credentials validated successfully',
        data: { companyCode, employeeCode, startDate, endDate }
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