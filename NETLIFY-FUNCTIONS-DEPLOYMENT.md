# Netlify Functions Deployment Guide

This guide will help you deploy your Working Hours Calculator using Netlify Functions instead of a separate backend server.

## 🎯 **Why Netlify Functions?**

- ✅ **No separate backend needed** - Everything runs on Netlify
- ✅ **Serverless** - Pay only for what you use
- ✅ **Easy deployment** - One platform for frontend and backend
- ✅ **Automatic scaling** - Handles traffic spikes automatically

## 📋 **What We've Created**

### **Netlify Functions:**
- `login.js` - Handles user authentication
- `zing-credentials.js` - Validates Zing HR credentials
- `calculate-manual.js` - Manual working hours calculation
- `calculate-auto.js` - Automated calculation from Zing data

### **Updated Configuration:**
- `netlify.toml` - Includes functions configuration
- `src/utils/api.ts` - Updated to use Netlify Functions
- `netlify/functions/package.json` - Dependencies for functions

## 🚀 **Deployment Steps**

### **Step 1: Install Function Dependencies**

```bash
cd netlify/functions
npm install
cd ../..
```

### **Step 2: Test Locally (Optional)**

Install Netlify CLI:
```bash
npm install -g netlify-cli
```

Test functions locally:
```bash
netlify dev
```

### **Step 3: Deploy to Netlify**

1. **Push your code to GitHub**

2. **Go to Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"

3. **Connect your repository**

4. **Configure Build Settings:**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

5. **Set Environment Variables:**
   - `JWT_SECRET`: `your-secret-key-here` (change this!)

6. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

## 🔧 **Environment Variables**

### **Required:**
```bash
JWT_SECRET=your-secret-key-here
```

### **Optional:**
```bash
VITE_API_URL=/.netlify/functions
```

## 🧪 **Testing Your Deployment**

### **Test Login Function:**
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### **Test Manual Calculation:**
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/calculate-manual \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"swipeDetails":"09:15, 12:30, 13:30, 18:30"}'
```

## 🔍 **Function URLs**

After deployment, your functions will be available at:
- `https://your-site.netlify.app/.netlify/functions/login`
- `https://your-site.netlify.app/.netlify/functions/zing-credentials`
- `https://your-site.netlify.app/.netlify/functions/calculate-manual`
- `https://your-site.netlify.app/.netlify/functions/calculate-auto`

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Functions Not Found (404)**
   - Check `netlify.toml` has `functions = "netlify/functions"`
   - Verify function files are in the correct directory
   - Check build logs for errors

2. **CORS Errors**
   - Functions include CORS headers automatically
   - Check browser console for specific errors

3. **JWT Errors**
   - Verify `JWT_SECRET` environment variable is set
   - Check token format in Authorization header

4. **Build Failures**
   - Check function dependencies are installed
   - Verify Node.js version compatibility
   - Review build logs

### **Debugging:**

1. **Check Function Logs**
   - Go to Netlify Dashboard → Functions
   - Click on function name to see logs

2. **Test Functions Individually**
   - Use curl or Postman to test each function
   - Check response status and body

3. **Check Environment Variables**
   - Verify in Netlify Dashboard → Environment variables
   - Redeploy after changing variables

## 📊 **Performance & Limits**

### **Netlify Functions Limits:**
- **Execution time**: 10 seconds (free), 15 seconds (paid)
- **Memory**: 1024 MB
- **Request size**: 6 MB
- **Concurrent executions**: 100 (free), 1000+ (paid)

### **Optimization Tips:**
- Keep functions lightweight
- Use efficient algorithms
- Minimize dependencies
- Cache results when possible

## 🔄 **Continuous Deployment**

Once deployed:
- Every push to main branch triggers rebuild
- Functions are automatically updated
- No manual intervention needed

## 📞 **Support**

If you encounter issues:
1. Check Netlify Functions documentation
2. Review function logs in Netlify dashboard
3. Test functions locally first
4. Verify environment variables

## 🎉 **Benefits of This Approach**

- ✅ **Single deployment** - No separate backend needed
- ✅ **Cost effective** - Pay only for function executions
- ✅ **Scalable** - Automatic scaling with traffic
- ✅ **Maintainable** - All code in one repository
- ✅ **Secure** - Environment variables for secrets 