# Working Hours Calculator

A professional web application for tracking and calculating working hours with both manual and automated calculation features.

## 🚀 Features

- **User Authentication**: Secure login system with JWT tokens
- **Zing Integration**: Connect to Zing HR system for automated data retrieval
- **Manual Calculation**: Calculate working hours from swipe details
- **Auto Calculation**: Automated calculation from Zing system data
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Authentication**: JWT, bcryptjs
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Servers

#### Option A: Using the convenience script (Recommended)
```bash
./start-dev.sh
```

#### Option B: Manual start
```bash
# Terminal 1: Start backend server
node server.js

# Terminal 2: Start frontend server
npx vite --port 5173
```

#### Option C: Using npm script (may have dependency issues)
```bash
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🌐 Deployment

### Netlify Deployment

This application is configured for easy deployment to Netlify. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy Steps:**
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set environment variable: `VITE_API_URL=https://your-backend-url.com`
4. Deploy!

### Backend Deployment

The backend needs to be deployed separately. Recommended platforms:
- **Render** (recommended for Node.js)
- **Railway**
- **Heroku**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for backend deployment instructions.

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - User login

### Zing Integration
- `POST /api/zing-credentials` - Validate Zing credentials

### Calculations
- `POST /api/calculate-manual` - Manual working hours calculation
- `POST /api/calculate-auto` - Automated calculation from Zing data

## 🧪 Testing the Application

### Demo Login
For testing purposes, you can use any username and password combination.

### Manual Calculation Example
```json
{
  "swipeDetails": "09:15, 12:30, 13:30, 18:30"
}
```

This will calculate:
- Total working hours
- Break time
- Hours needed to cover (if less than 9 hours)
- Total office time

## 📁 Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx
│   │   ├── ZingCredentialsPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ManualCalculation.tsx
│   │   └── AutoCalculation.tsx
│   ├── utils/
│   │   └── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server.js
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── netlify.toml
├── start-dev.sh
└── DEPLOYMENT.md
```

## 🔍 Troubleshooting

### Common Issues

1. **Rollup/Vite dependency issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port already in use**
   ```bash
   # Kill processes on ports 3001 and 5173
   lsof -ti:3001 | xargs kill -9
   lsof -ti:5173 | xargs kill -9
   ```

3. **Backend not responding**
   - Check if server.js is running
   - Verify port 3001 is available
   - Check console for error messages

## 🚀 Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📝 License

This project is for demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request 