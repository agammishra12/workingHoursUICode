# Deployment Guide - Netlify

This guide will help you deploy your Working Hours Calculator to Netlify.

## 🚀 Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Backend Deployment**: Your backend needs to be deployed separately (see Backend Deployment section)

## 📋 Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub with the following files:
- `netlify.toml` (already created)
- `package.json` with build script
- `vite.config.ts` (already configured)
- `src/utils/api.ts` (already created)

### 2. Deploy to Netlify

#### Option A: Deploy via Netlify UI (Recommended)

1. **Go to Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Sign in to your account

2. **Connect Your Repository**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18` (or higher)

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com`
   - Replace `your-backend-url.com` with your actual backend URL

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete

#### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### 3. Configure Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add your custom domain
3. Follow the DNS configuration instructions

## 🔧 Backend Deployment

Since your frontend needs a backend API, you'll need to deploy the backend separately. Here are some options:

### Option 1: Render (Recommended for Node.js)

1. **Sign up at [render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your repository**
4. **Configure:**
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node
5. **Set Environment Variables:**
   - `JWT_SECRET`: Your secret key
   - `PORT`: `3001` (or let Render assign one)

### Option 2: Railway

1. **Sign up at [railway.app](https://railway.app)**
2. **Connect your repository**
3. **Deploy automatically**

### Option 3: Heroku

1. **Sign up at [heroku.com](https://heroku.com)**
2. **Create a new app**
3. **Deploy using Heroku CLI**

## 🌐 Environment Configuration

### Frontend Environment Variables

In Netlify, set these environment variables:

```bash
VITE_API_URL=https://your-backend-url.com
```

### Backend Environment Variables

In your backend deployment platform, set:

```bash
JWT_SECRET=your-secret-key-here
PORT=3001
```

## 🔍 Testing Your Deployment

1. **Test Frontend**: Visit your Netlify URL
2. **Test API**: Try logging in with any credentials
3. **Test Features**: Use manual calculation and auto calculation

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are in package.json
   - Check build logs in Netlify

2. **API Calls Fail**
   - Verify VITE_API_URL is set correctly
   - Check CORS settings in your backend
   - Ensure backend is deployed and accessible

3. **Environment Variables Not Working**
   - Rebuild after setting environment variables
   - Check variable names (must start with VITE_)
   - Verify in Netlify dashboard

### Debugging

1. **Check Netlify Build Logs**
   - Go to your site → Deploys → Click on deploy
   - Review build output for errors

2. **Check Browser Console**
   - Open developer tools
   - Look for network errors
   - Check for JavaScript errors

## 📱 Post-Deployment

### Performance Optimization

1. **Enable Netlify Analytics** (optional)
2. **Set up CDN caching**
3. **Enable compression**

### Monitoring

1. **Set up uptime monitoring**
2. **Configure error tracking**
3. **Monitor API performance**

## 🔄 Continuous Deployment

Once deployed, every push to your main branch will automatically trigger a new deployment.

## 📞 Support

If you encounter issues:
1. Check Netlify documentation
2. Review build logs
3. Test locally first
4. Check environment variables 