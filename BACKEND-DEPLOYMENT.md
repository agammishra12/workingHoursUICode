# Backend Deployment Guide

This guide will help you deploy the backend server for the Working Hours Calculator.

## 🚀 Prerequisites

- Node.js backend code (server.js)
- A deployment platform account (Render, Railway, Heroku, etc.)

## 📋 Deployment Options

### Option 1: Render (Recommended)

1. **Sign up at [render.com](https://render.com)**

2. **Create a new Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure the service:**
   - **Name**: `working-hours-calculator-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or paid for better performance)

4. **Set Environment Variables:**
   - `JWT_SECRET`: `your-secret-key-here` (change this!)
   - `PORT`: `3001` (or let Render assign one)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

6. **Get your URL**
   - Copy the provided URL (e.g., `https://your-app.onrender.com`)
   - Use this as your `VITE_API_URL` in Netlify

### Option 2: Railway

1. **Sign up at [railway.app](https://railway.app)**

2. **Create a new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"

3. **Configure:**
   - Select your repository
   - Railway will auto-detect it's a Node.js app

4. **Set Environment Variables:**
   - `JWT_SECRET`: `your-secret-key-here`
   - `PORT`: `3001`

5. **Deploy**
   - Railway will automatically deploy
   - Get your URL from the dashboard

### Option 3: Heroku

1. **Sign up at [heroku.com](https://heroku.com)**

2. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

3. **Create a new app**
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key-here
   heroku config:set PORT=3001
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔧 Backend Configuration

### Required Files

Make sure your backend has these files:
- `server.js` - Main server file
- `package.json` - Dependencies
- `.gitignore` - Exclude node_modules

### Environment Variables

Set these in your deployment platform:

```bash
JWT_SECRET=your-secret-key-here
PORT=3001
```

### CORS Configuration

The backend is already configured with CORS for localhost. For production, you might want to update the CORS settings in `server.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.netlify.app', 'http://localhost:5173'],
  credentials: true
}));
```

## 🧪 Testing Your Backend

After deployment, test your backend:

```bash
# Test login endpoint
curl -X POST https://your-backend-url.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs

2. **App Crashes**
   - Check environment variables are set
   - Verify PORT is available
   - Check application logs

3. **CORS Errors**
   - Update CORS configuration
   - Verify frontend URL is allowed
   - Check browser console for errors

### Debugging

1. **Check Logs**
   - Most platforms provide log viewing
   - Look for error messages
   - Check startup logs

2. **Test Locally First**
   - Test with `node server.js`
   - Verify all endpoints work
   - Check environment variables

## 🔄 Continuous Deployment

Most platforms support automatic deployment:
- Push to main branch
- Platform automatically rebuilds and deploys
- No manual intervention needed

## 📞 Support

If you encounter issues:
1. Check platform documentation
2. Review application logs
3. Test endpoints manually
4. Verify environment variables 