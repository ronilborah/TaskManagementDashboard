# Deployment Guide

This guide explains how to deploy your Task Management Dashboard with MongoDB backend support.

## Quick Overview

Your app now supports two modes:
- **Local Development**: Uses localStorage (no backend needed)
- **Production Deployment**: Uses MongoDB backend (shared data, multi-user)

## Step 1: Backend Deployment

### Option A: Deploy to Render (Recommended)

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Set the **Root Directory** to `backend`
   - Set **Build Command**: `npm install`
   - Set **Start Command**: `npm start`
   - Set **Environment**: `Node`

3. **Add Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/taskmanager
   NODE_ENV=production
   PORT=8000
   ```

4. **Deploy** and note your backend URL (e.g., `https://your-app.onrender.com`)

### Option B: Deploy to Heroku

1. **Install Heroku CLI** and login
2. **Navigate to backend directory**:
   ```bash
   cd backend
   heroku create your-app-name
   heroku config:set MONGODB_URI="your-mongodb-uri"
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

### Option C: Deploy to Railway

1. **Create a Railway account** at [railway.app](https://railway.app)
2. **Connect your GitHub repository**
3. **Set the service directory** to `backend`
4. **Add environment variables** (MONGODB_URI, NODE_ENV, PORT)
5. **Deploy**

## Step 2: Frontend Configuration

1. **Create environment file** in the frontend directory:
   ```bash
   cd frontend
   cp env.example .env
   ```

2. **Update the backend URL** in `.env`:
   ```env
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

   Replace `your-backend-url.com` with your actual backend URL from Step 1.

## Step 3: Frontend Deployment

### Option A: Deploy to Vercel (Recommended)

1. **Create a Vercel account** at [vercel.com](https://vercel.com)
2. **Import your GitHub repository**
3. **Set the Root Directory** to `frontend`
4. **Set the Build Command** to `npm run build:prod`
5. **Add Environment Variable**:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.com/api`
6. **Deploy**

### Option B: Deploy to Netlify

1. **Create a Netlify account** at [netlify.com](https://netlify.com)
2. **Connect your GitHub repository**
3. **Set the Publish directory** to `frontend/build`
4. **Set the Build command** to `cd frontend && npm run build:prod`
5. **Add Environment Variable**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.com/api`
6. **Deploy**

### Option C: Manual Build and Deploy

1. **Build for production**:
   ```bash
   cd frontend
   npm run build:prod
   ```

2. **Deploy the `build` folder** to your hosting platform

## Step 4: MongoDB Setup

### Option A: MongoDB Atlas (Recommended)

1. **Create a MongoDB Atlas account** at [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create a new cluster** (free tier available)
3. **Create a database user** with read/write permissions
4. **Get your connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/taskmanager
   ```
5. **Add your IP address** to the IP whitelist (or use 0.0.0.0/0 for all IPs)

### Option B: Local MongoDB

1. **Install MongoDB** on your server
2. **Create a database** named `taskmanager`
3. **Use connection string**:
   ```
   mongodb://localhost:27017/taskmanager
   ```

## Step 5: Testing

1. **Test your backend** by visiting your backend URL + `/api/health`
2. **Test your frontend** by visiting your deployed frontend URL
3. **Verify data persistence** by creating projects and tasks

## Build Process

### Local Development
```bash
cd frontend
npm start  # Uses localStorage, no axios needed
```

### Production Build
```bash
cd frontend
npm run build:prod  # Installs axios and builds for production
```

The production build script automatically:
1. Installs axios for MongoDB API support
2. Builds the application with production optimizations
3. Creates a `build` directory ready for deployment

## Environment Variables Reference

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
NODE_ENV=production
PORT=8000
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend CORS settings allow your frontend domain
2. **MongoDB Connection**: Verify your MongoDB URI and network access
3. **Environment Variables**: Ensure they're set correctly in your deployment platform
4. **Build Errors**: Check that all dependencies are installed
5. **Axios Errors**: Ensure axios is installed for production builds

### Debug Mode

To debug deployment issues:

1. **Check backend logs** in your deployment platform
2. **Check frontend console** for API errors
3. **Verify environment variables** are loaded correctly
4. **Test API endpoints** directly with tools like Postman

## Security Considerations

1. **MongoDB Security**: Use strong passwords and restrict IP access
2. **Environment Variables**: Never commit sensitive data to version control
3. **CORS**: Configure CORS to only allow your frontend domain
4. **HTTPS**: Always use HTTPS in production

## Cost Considerations

### Free Tier Options
- **Render**: Free tier available for backend
- **Vercel**: Free tier available for frontend
- **MongoDB Atlas**: Free tier available (512MB storage)
- **Netlify**: Free tier available for frontend

### Paid Options
- **Heroku**: $7/month for backend
- **Railway**: Pay-as-you-go pricing
- **MongoDB Atlas**: Starts at $9/month for more storage

## Support

If you encounter issues:
1. Check the deployment platform's documentation
2. Verify all environment variables are set correctly
3. Check the browser console and server logs for errors
4. Ensure your MongoDB cluster is accessible from your backend 