# WAY Esports - Production Deployment Guide

## 🚀 Quick Start

Deploy your application in seconds with Docker:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

That's it! Your application will be running on `http://localhost:3000`

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Docker & Docker Compose** installed
   - Docker 20.10+ recommended
   - Docker Compose 2.0+ recommended

2. **Supabase Project** (already configured)
   - Project ID: `kezbdbbeqocqtdxyhtqs`
   - Your project is already connected

3. **Environment Variables** configured (see below)

---

## 🔧 Environment Configuration

### Required Environment Variables

Create a `frontend.env` file in the root directory:

```bash
# Copy the example file
cp frontend.env.example frontend.env
```

Edit `frontend.env` with your values:

```env
# Supabase Configuration (Already set in .env)
VITE_SUPABASE_PROJECT_ID=kezbdbbeqocqtdxyhtqs
VITE_SUPABASE_URL=https://kezbdbbeqocqtdxyhtqs.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here

# Terms of Service Version
VITE_TERMS_VERSION=1.0.0

# Application Configuration
NODE_ENV=production
```

### Complete Environment Variables List

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project ID | Yes | - |
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes | - |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key | Yes | - |
| `VITE_TERMS_VERSION` | Current ToS version | Yes | `1.0.0` |
| `NODE_ENV` | Environment mode | Yes | `production` |

---

## 🐳 Docker Deployment

### Option 1: Docker Compose (Recommended)

The easiest way to deploy:

```bash
# Build and start all services
docker compose -f docker-compose.prod.yml up -d --build

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop services
docker compose -f docker-compose.prod.yml down

# Rebuild specific service
docker compose -f docker-compose.prod.yml up -d --build frontend
```

### Option 2: Manual Docker Build

If you prefer manual control:

```bash
# Build the image
docker build -t way-esports:latest .

# Run the container
docker run -d \
  --name way-esports \
  -p 3000:3000 \
  --env-file frontend.env \
  --restart unless-stopped \
  way-esports:latest

# View logs
docker logs -f way-esports

# Stop and remove
docker stop way-esports && docker rm way-esports
```

---

## 🔄 Alternative: PM2 Deployment (Without Docker)

If you prefer not to use Docker:

### Prerequisites

```bash
npm install -g pm2
```

### Deployment Steps

```bash
# Install dependencies
npm ci --omit=dev

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "way-esports" -- run preview

# View logs
pm2 logs way-esports

# Monitor
pm2 monit

# Stop
pm2 stop way-esports

# Restart
pm2 restart way-esports

# Setup auto-start on reboot
pm2 startup
pm2 save
```

### PM2 Configuration File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'way-esports',
    script: 'npm',
    args: 'run preview',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
```

Then deploy with:

```bash
pm2 start ecosystem.config.js
```

---

## 🏥 Health Checks & Monitoring

### Docker Health Check

The Docker container includes automatic health checks:

```bash
# Check container health
docker ps

# View health check logs
docker inspect way-esports --format='{{json .State.Health}}'
```

### Manual Health Check

```bash
# Check if app is running
curl http://localhost:3000

# Expected: HTML response with 200 OK
```

---

## 🔐 Security Checklist

Before going live, verify:

- [ ] All environment variables are set correctly
- [ ] Supabase RLS policies are configured
- [ ] Terms of Service version is current
- [ ] HTTPS is enabled (use reverse proxy like Nginx)
- [ ] Rate limiting is configured
- [ ] Firewall rules are in place
- [ ] Database backups are scheduled
- [ ] Error logging is configured

---

## 🧪 Testing Your Deployment

### Key Scenarios to Test

1. **Team Creation**
   ```
   1. Sign up/login
   2. Navigate to Teams
   3. Create a new team
   4. Verify team appears in list
   ```

2. **Tournament Registration**
   ```
   1. Ensure you have a team
   2. Navigate to Tournaments
   3. Click Register on a tournament
   4. Select your team
   5. Check "I agree to Terms of Service"
   6. Complete registration
   7. Verify registration success
   ```

3. **Language Switching**
   ```
   1. Click language switcher (EN/RU)
   2. Verify all text translates
   3. Check localStorage for language preference
   ```

4. **Subscription Management**
   ```
   1. Navigate to Subscription page
   2. View current plan
   3. Select a different plan
   4. Verify upgrade works
   ```

### Integration Test Commands

```bash
# Run basic integration tests
npm run test:integration

# Test specific scenarios
npm run test:teams
npm run test:tournaments
npm run test:auth
```

---

## 🌐 Production Server Setup

### With Nginx Reverse Proxy

1. Install Nginx:
```bash
sudo apt update
sudo apt install nginx
```

2. Create Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Enable SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📊 Monitoring & Logs

### View Application Logs

**Docker:**
```bash
docker compose -f docker-compose.prod.yml logs -f
```

**PM2:**
```bash
pm2 logs way-esports
```

### Log Locations

- Docker: `docker logs <container_id>`
- PM2: `~/.pm2/logs/`
- Nginx: `/var/log/nginx/`

---

## 🔄 Updates & Rollbacks

### Updating to New Version

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build

# Or with PM2
npm ci --omit=dev
npm run build
pm2 restart way-esports
```

### Rollback to Previous Version

```bash
# Docker
docker compose -f docker-compose.prod.yml down
git checkout <previous-commit>
docker compose -f docker-compose.prod.yml up -d --build

# PM2
git checkout <previous-commit>
npm ci --omit=dev
npm run build
pm2 restart way-esports
```

---

## 🆘 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Container Won't Start:**
```bash
# Check logs
docker logs way-esports
# Check container status
docker ps -a
# Remove and recreate
docker rm way-esports
docker compose -f docker-compose.prod.yml up -d
```

**Build Failures:**
```bash
# Clear Docker cache
docker system prune -a
# Rebuild from scratch
docker compose -f docker-compose.prod.yml build --no-cache
```

**Database Connection Issues:**
- Verify Supabase credentials in `frontend.env`
- Check Supabase project status
- Verify network connectivity

---

## 📞 Support

For issues or questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review application logs
3. Check Supabase dashboard for backend issues
4. Contact development team

---

## ✅ Deployment Verification Checklist

After deployment, verify:

- [ ] Application loads at configured URL
- [ ] User registration works
- [ ] User login works
- [ ] Team creation works
- [ ] Tournament registration works with ToS checkbox
- [ ] Language switching works (EN/RU)
- [ ] Subscription page accessible
- [ ] Database queries return data
- [ ] No console errors
- [ ] Mobile layout works
- [ ] All navigation links work

---

**🎉 Congratulations! Your WAY Esports platform is now live!**

For production support and monitoring, keep this guide handy and ensure your team is familiar with the deployment process.
