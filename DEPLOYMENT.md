# Deployment Guide

## Environment Configuration

This project is configured to use environment variables for different deployment environments.

### Environment Files

- **`.env`** - Local development (localhost:5000)
- **`.env.production`** - Production deployment
- **`.env.staging`** - Staging deployment

### Environment Variables

- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_SOCKET_URL` - Socket.IO server URL

## Deployment Steps

### 1. Local Development
```bash
npm start
# Uses .env with localhost:5000
```

### 2. Production Build
```bash
# Option A: Build with production env
npm run build
# Uses .env.production

# Option B: Build with custom env
REACT_APP_API_URL=https://your-api.com npm run build
```

### 3. Popular Deployment Platforms

#### Vercel
1. Connect your GitHub repo
2. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL=https://your-backend-url.com`
   - `REACT_APP_SOCKET_URL=https://your-backend-url.com`
3. Deploy

#### Netlify
1. Connect your GitHub repo
2. Build command: `npm run build`
3. Publish directory: `build`
4. Set environment variables in Netlify dashboard

#### AWS/Heroku/DigitalOcean
1. Set environment variables in your hosting platform
2. Build and deploy using your platform's process

### 4. Backend Deployment

Your backend needs to be deployed first. Popular options:
- **Heroku**: Easy deployment with database
- **Railway**: Modern alternative to Heroku
- **AWS/DigitalOcean**: More control but complex
- **Render**: Good middle ground

### 5. Update Environment Variables

After deploying your backend, update the frontend environment variables:

```bash
# .env.production
REACT_APP_API_URL=https://your-deployed-backend.herokuapp.com
REACT_APP_SOCKET_URL=https://your-deployed-backend.herokuapp.com
```

## CORS Configuration

Make sure your backend allows requests from your frontend domain:

```javascript
// backend/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-domain.vercel.app'
  ]
}));
```

## Example Deployment URLs

### Frontend (Static Hosting)
- Vercel: `https://your-app.vercel.app`
- Netlify: `https://your-app.netlify.app`

### Backend (Server Hosting)
- Heroku: `https://your-backend.herokuapp.com`
- Railway: `https://your-backend.railway.app`
- Render: `https://your-backend.onrender.com`

## Testing Deployment

1. Deploy backend first
2. Test API endpoints: `https://your-backend.com/api/tasks`
3. Update frontend environment variables
4. Deploy frontend
5. Test complete application

## Environment Variable Priority

1. Environment-specific files (`.env.production`)
2. `.env.local` (ignored by git)
3. `.env`
4. Default values in `config/api.js`
