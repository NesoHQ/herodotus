# Herodotus Analytics - Quick Start Guide

Get up and running in 5 minutes!

## 🚀 Prerequisites

- Go 1.22+
- Node.js 18+
- Docker & Docker Compose

## 📦 Installation

### 1. Start Backend Services

```bash
cd herodotus-backend

# Start MongoDB, Redis, and NATS
docker-compose up -d

# Wait a few seconds for services to start
sleep 5

# Run backend (in a new terminal)
make dev
# Or: go run ./cmd/main.go
```

Backend will be available at `http://localhost:8080`

### 2. Start Frontend

```bash
# In a new terminal
cd herodotus-frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 🎯 First Steps

### 1. Register Account
1. Open `http://localhost:3000`
2. Click "Sign up" or go to `/register`
3. Create account with email and password

### 2. Add Domain
1. Go to "Domains" page
2. Click "+ Add Domain"
3. Enter your domain (e.g., `example.com`)
4. Click "Add Domain"

### 3. Generate API Key
1. Go to "API Keys" page
2. Click "+ Generate API Key"
3. Select your domain
4. Click "Generate Key"
5. **Copy the key immediately** (you won't see it again!)

### 4. Install Tracking Code

Add this to your website's `<head>` section:

```html
<script src="http://localhost:3000/herodotus.js"></script>
<script>
  Herodotus.init('YOUR_API_KEY_HERE');
</script>
```

### 5. View Analytics
1. Visit your website
2. Go back to the Dashboard
3. See real-time analytics appear!

## 🧪 Testing Without a Website

You can test the tracking API directly:

```bash
# Use the test script
cd herodotus-backend
chmod +x test-api.sh
./test-api.sh
```

Or manually:

```bash
# Track a test event
curl -X POST http://localhost:8080/api/track \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "path": "/test-page",
    "referrer": "https://google.com",
    "visitor_id": "test_visitor_123"
  }'
```

## 🔍 Verify Everything is Working

### Check Backend Health
```bash
curl http://localhost:8080/health
# Should return: {"status":"ok"}
```

### Check Services
```bash
cd herodotus-backend
docker-compose ps
# All services should be "Up"
```

### Check Frontend
Open `http://localhost:3000` in your browser

## 📊 Understanding the Dashboard

### Key Metrics
- **Active Visitors**: People currently on your site
- **Total Hits**: All-time page views
- **Unique Visitors**: Distinct visitors (last 24h)
- **Bounce Rate**: % of single-page visits

### Charts & Data
- **Traffic Overview**: Page views per minute (last 60 minutes)
- **Top Pages**: Most visited pages
- **Top Referrers**: Where visitors come from
- **Devices**: Desktop, Mobile, Tablet breakdown
- **Browsers**: Chrome, Safari, Firefox, etc.
- **Countries**: Geographic distribution

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check if port 8080 is in use
lsof -i :8080

# Check Docker services
docker-compose ps

# View logs
docker-compose logs
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if port 3000 is in use
lsof -i :3000
```

### No data in dashboard
1. Make sure you've added a domain
2. Make sure you've generated an API key
3. Make sure tracking code is installed
4. Check browser console for errors
5. Try the test script: `./test-api.sh`

### CORS errors
Check `herodotus-backend/.env`:
```env
FRONTEND_URL=http://localhost:3000
```

## 📝 Environment Variables

### Backend (`.env`)
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=herodotus
REDIS_URL=redis://localhost:6379
NATS_URL=nats://localhost:4222
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:8080
```

## 🎨 UI Features

### Dashboard
- ✅ Real-time updates every 5 seconds
- ✅ Beautiful charts and visualizations
- ✅ Getting started guide for new users
- ✅ Empty states with helpful messages

### Domains
- ✅ Easy domain management
- ✅ Settings overview
- ✅ Verification status
- ✅ Helpful explanations

### API Keys
- ✅ One-click key generation
- ✅ Installation guide modal
- ✅ Copy to clipboard
- ✅ Ready-to-use code snippets

## 🚢 Production Deployment

### Using Docker Compose

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables for Production

Update `.env` with production values:
```env
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=https://yourdomain.com
MONGODB_URI=mongodb://mongodb:27017
```

## 📚 Next Steps

1. **Customize Settings**: Go to Domains and adjust rate limits, timezone, etc.
2. **Invite Team**: (Coming soon) Add team members
3. **Set Up Alerts**: (Coming soon) Get notified of traffic spikes
4. **Export Data**: (Coming soon) Download CSV reports

## 💡 Tips

- The tracking script is only 5KB and won't slow down your site
- IP addresses are anonymized by default for privacy
- Data updates in real-time (5-second refresh)
- Works with SPAs (React, Vue, Angular, etc.)
- GDPR compliant out of the box

## 🆘 Need Help?

- Check [TROUBLESHOOTING.md](herodotus-frontend/TROUBLESHOOTING.md)
- Check [USAGE_GUIDE.md](herodotus-frontend/USAGE_GUIDE.md)
- Check [API_COVERAGE.md](API_COVERAGE.md)
- Open an issue on GitHub

## 🎉 You're All Set!

Your analytics platform is ready to track website traffic. Visit the dashboard to see real-time data as visitors browse your site.

**Happy tracking! 📊**
