# ⚙️ Render.com Build & Deploy Configuration

## Service Configuration

### Basic Settings
- **Service Name**: `ai-hr-backend`
- **Region**: Choose closest to your users (e.g., Frankfurt, Singapore)
- **Branch**: `main`
- **Root Directory**: `apps/api`
- **Runtime**: `Node`

### Build & Deploy

#### Build Command
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

**Explanation**:
- `npm install`: Install all dependencies
- `npx prisma generate`: Generate Prisma Client
- `npx prisma migrate deploy`: Run database migrations

#### Start Command
```bash
node src/server.js
```

### Instance Type
- **Free Tier**: 512 MB RAM, 0.1 CPU
- ⚠️ **Note**: Service spins down after 15 minutes of inactivity

---

## Environment Variables

Copy and paste these in Render Dashboard → Environment → Environment Variables:

```env
# Database (Aiven MySQL)
DATABASE_URL=mysql://avnadmin:YOUR_AIVEN_PASSWORD@your-aiven-host:port/defaultdb?ssl-mode=REQUIRED

# Redis (Upstash)
REDIS_URL=rediss://default:YOUR_UPSTASH_PASSWORD@your-upstash-host:6379

# JWT Configuration
JWT_SECRET=HR_PLATFORM_SECURE_JWT_SECRET_2026_X92KLP
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=dsygkkc2j
CLOUDINARY_API_KEY=718919776419434
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_SECRET
CLOUDINARY_URL=cloudinary://718919776419434:YOUR_SECRET@dsygkkc2j

# OpenAI (Optional)
OPENAI_API_KEY=YOUR_OPENAI_API_KEY

# API URL
API_URL=https://ai-hr-platform.onrender.com

# CORS - Add ALL your frontend URLs separated by commas
CORS_ORIGINS=https://ai-hr-owner-dashboard.vercel.app,https://ai-hr-manager-dashboard.vercel.app,https://ai-hr-employee-pwa.vercel.app,https://ai-hr-landing.vercel.app

# Node Environment
NODE_ENV=production
PORT=4000
```

---

## Health Check (Optional but Recommended)

- **Path**: `/api/health`
- **Expected Response**: `200 OK`

---

## Auto-Deploy Settings

✅ **Enable**: Auto-deploy from `main` branch
- Every push to `main` will trigger automatic deployment

---

## Troubleshooting

### Build Fails

**Error**: `Prisma Client not generated`
```bash
# Solution: Make sure build command includes:
npx prisma generate
```

**Error**: `Cannot find module '@prisma/client'`
```bash
# Solution: Run migrations before starting:
npx prisma migrate deploy
```

### Database Connection Issues

**Error**: `ENOTFOUND` or `Connection refused`
- ✅ Check `DATABASE_URL` is correct
- ✅ Ensure Aiven MySQL is running
- ✅ Check SSL mode: `?ssl-mode=REQUIRED`

### CORS Errors

**Error**: `Access-Control-Allow-Origin`
- ✅ Add ALL frontend URLs to `CORS_ORIGINS`
- ✅ Separate URLs with commas (no spaces)
- ✅ Include `https://` protocol

---

## Performance Tips

### Keep Service Awake (Free Tier)

Use [UptimeRobot](https://uptimerobot.com) to ping your service every 5 minutes:
- Monitor Type: `HTTP(s)`
- URL: `https://ai-hr-platform.onrender.com/health`
- Interval: `5 minutes`

This prevents the service from spinning down.

### Upgrade to Paid Plan

For production use, consider upgrading:
- **Starter Plan**: $7/month
  - Always-on (no spin down)
  - 512 MB RAM
  - Better performance
