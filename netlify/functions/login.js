const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
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

  try {
    const { username, password } = JSON.parse(event.body);
    
    // Allow any credentials for demo purposes
    if (username && password) {
      const user = { id: 1, username, email: `${username}@company.com` };
      const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key-here', { expiresIn: '24h' });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Login successful',
          token,
          user
        })
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Username and password required' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 