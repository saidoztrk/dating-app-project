# 🚀 Deployment Guide

Complete guide to deploy your Dating App to production.

---

## 📋 Pre-Deployment Checklist

### Security
- [ ] Change all default passwords
- [ ] Update JWT secrets with strong random strings
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting
- [ ] Review and update security headers

### Environment
- [ ] Create production .env files
- [ ] Set NODE_ENV=production
- [ ] Update API URLs
- [ ] Configure database connection strings
- [ ] Set up Cloudinary production account

### Testing
- [ ] Test all features in staging
- [ ] Load testing
- [ ] Security audit
- [ ] Browser compatibility check
- [ ] Mobile responsiveness check

---

## 🗄️ Database Deployment (Azure SQL)

### 1. Create Azure SQL Database

```bash
# Using Azure CLI
az sql server create \
  --name dating-app-server \
  --resource-group dating-app-rg \
  --location eastus \
  --admin-user sqladmin \
  --admin-password <YourSecurePassword>

az sql db create \
  --resource-group dating-app-rg \
  --server dating-app-server \
  --name DatingAppDB \
  --service-objective S0
```

### 2. Configure Firewall

```bash
# Allow Azure services
az sql server firewall-rule create \
  --resource-group dating-app-rg \
  --server dating-app-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow your IP for management
az sql server firewall-rule create \
  --resource-group dating-app-rg \
  --server dating-app-server \
  --name AllowMyIP \
  --start-ip-address <YourIP> \
  --end-ip-address <YourIP>
```

### 3. Run Migrations

Connect using SQL Server Management Studio or Azure Data Studio:

**Connection String:**
```
Server: dating-app-server.database.windows.net
Database: DatingAppDB
User: sqladmin
Password: <YourPassword>
```

Run all migration scripts from `backend/migrations/` folder.

---

## 🖥️ Backend Deployment (Railway)

### Option 1: Railway (Recommended)

1. **Sign up at** [railway.app](https://railway.app)

2. **Install Railway CLI:**
```bash
npm install -g @railway/cli
railway login
```

3. **Initialize Project:**
```bash
cd backend
railway init
```

4. **Set Environment Variables:**
```bash
railway variables set PORT=5000
railway variables set NODE_ENV=production
railway variables set DATABASE_SERVER=dating-app-server.database.windows.net
railway variables set DATABASE_NAME=DatingAppDB
railway variables set DATABASE_USER=sqladmin
railway variables set DATABASE_PASSWORD=<YourPassword>
railway variables set JWT_SECRET=<GenerateStrongSecret>
railway variables set CLOUDINARY_CLOUD_NAME=<YourCloudName>
railway variables set CLOUDINARY_API_KEY=<YourApiKey>
railway variables set CLOUDINARY_API_SECRET=<YourApiSecret>
railway variables set CLIENT_URL=https://yourdomain.com
```

5. **Deploy:**
```bash
railway up
```

6. **Get URL:**
```bash
railway domain
# Output: https://dating-app-backend-production.up.railway.app
```

### Option 2: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd backend
heroku create dating-app-backend

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set DATABASE_SERVER=<AzureSQLServer>
heroku config:set DATABASE_NAME=DatingAppDB
heroku config:set JWT_SECRET=<StrongSecret>
# ... set all other env vars

# Deploy
git push heroku main

# Open app
heroku open
```

---

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare for Deployment

Update API URL in your code or use environment variable:

**web-app/.env.production:**
```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_SOCKET_URL=https://your-backend-url.railway.app
```

### 2. Build Locally (Test)

```bash
cd web-app
npm run build
npm run preview
```

### 3. Deploy to Vercel

**Option A: Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd web-app
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? dating-app
# - Directory? ./
# - Build command? npm run build
# - Output directory? dist
```

**Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `web-app`
5. Add environment variables
6. Deploy!

### 4. Configure Environment Variables in Vercel

Go to Project Settings → Environment Variables:

```
VITE_API_URL = https://your-backend.railway.app/api
VITE_SOCKET_URL = https://your-backend.railway.app
```

### 5. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

---

## 🔧 Backend Configuration Updates

### Update CORS

**backend/src/app.ts:**
```typescript
app.use(cors({
    origin: [
        'https://yourdomain.com',
        'https://www.yourdomain.com'
    ],
    credentials: true
}));
```

### Update Socket.io

**backend/src/server.ts:**
```typescript
const io = new Server(server, {
    cors: {
        origin: 'https://yourdomain.com',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
```

---

## 📊 Monitoring & Logging

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/node @sentry/tracing
```

**backend/src/app.ts:**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### 2. Uptime Monitoring

Use services like:
- **UptimeRobot** - Free tier available
- **Pingdom**
- **StatusCake**

### 3. Analytics

- **Google Analytics** - Frontend analytics
- **Mixpanel** - User behavior tracking
- **Hotjar** - Heatmaps and recordings

---

## 🔐 Security Best Practices

### 1. Environment Variables

Never commit .env files! Use:
```bash
# .gitignore
.env
.env.local
.env.production
```

### 2. Rate Limiting

**backend/src/middleware/rateLimiter.ts:**
```typescript
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Apply to routes
app.use('/api/', apiLimiter);
```

### 3. Helmet.js

Already configured in `app.ts`:
```typescript
import helmet from 'helmet';
app.use(helmet());
```

### 4. SQL Injection Protection

Always use parameterized queries (already implemented):
```typescript
await db.request()
    .input('userId', userId)
    .query('SELECT * FROM Users WHERE UserID = @userId');
```

---

## 🚦 Health Checks

### Backend Health Endpoint

**Already exists:**
```
GET /health
Response: { success: true, message: "Server is running" }
```

### Database Health Check

```typescript
app.get('/health/db', async (req, res) => {
    try {
        await db.request().query('SELECT 1');
        res.json({ database: 'healthy' });
    } catch (error) {
        res.status(500).json({ database: 'unhealthy' });
    }
});
```

---

## 📈 Performance Optimization

### 1. Enable Gzip Compression

```bash
npm install compression
```

```typescript
import compression from 'compression';
app.use(compression());
```

### 2. CDN for Static Assets

Use Cloudflare or AWS CloudFront

### 3. Database Indexing

Ensure indexes on:
- Users: Email, UserID
- Matches: User1ID, User2ID
- Messages: MatchID, SenderID
- Swipes: UserID, SwipedUserID

### 4. Caching (Redis)

```bash
npm install redis
```

```typescript
import { createClient } from 'redis';

const redis = createClient({
    url: process.env.REDIS_URL
});

// Cache user data
await redis.set(`user:${userId}`, JSON.stringify(userData), {
    EX: 3600 // 1 hour
});
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: cd backend && npm run build
      - run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd web-app && npm install
      - run: cd web-app && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🎉 Post-Deployment

### 1. Test Everything

- [ ] User registration and login
- [ ] Profile updates
- [ ] Photo uploads
- [ ] Swiping functionality
- [ ] Matching system
- [ ] Real-time chat
- [ ] Notifications
- [ ] Premium subscriptions
- [ ] Admin panel access
- [ ] Analytics dashboard

### 2. Monitor Logs

```bash
# Railway logs
railway logs

# Heroku logs
heroku logs --tail

# Vercel logs
vercel logs
```

### 3. Set Up Alerts

Configure alerts for:
- Server errors (5xx)
- High response times
- Database connection failures
- Failed authentications

---

## 📞 Support & Troubleshooting

### Common Issues

**1. CORS Errors**
- Check backend CORS configuration
- Verify frontend API URL

**2. Database Connection Fails**
- Check firewall rules
- Verify connection string
- Test with SQL Management Studio

**3. Socket.io Not Working**
- Check CORS settings
- Verify WebSocket support
- Check firewall/proxy settings

**4. Images Not Loading**
- Verify Cloudinary credentials
- Check CORS on Cloudinary
- Test upload endpoint

---

## ✅ Deployment Checklist

- [ ] Database created and migrated
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Environment variables set
- [ ] CORS configured
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured
- [ ] Monitoring set up
- [ ] Error tracking enabled
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team notified
- [ ] Launch announced! 🎉

---

**Your app is now live! 🚀**

Monitor, iterate, and enjoy your success!
