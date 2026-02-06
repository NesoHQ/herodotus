# Herodotus Analytics

> Named after the ancient Greek historian, the "Father of History" - a fitting name for an analytics platform that records web history.

Real-time web analytics platform built with Go and React. Track website visitors, page views, and user behavior with privacy-first analytics.

## 🚀 Features

### Core Features (Beta)
- ✅ Real-time visitor tracking
- ✅ Live dashboard with WebSocket updates
- ✅ Domain management & verification
- ✅ API key authentication
- ✅ Page view analytics
- ✅ Referrer tracking
- ✅ Device & browser detection
- ✅ Privacy-focused (IP anonymization)
- ✅ Lightweight tracking SDK (<5KB)

### Coming Soon
- 📊 Unique visitor tracking
- ⏱️ Session duration analytics
- 📈 Bounce rate calculation
- 🗺️ Geographic tracking
- 🔔 Traffic spike alerts
- 📤 Data export (CSV)
- 👥 Team collaboration

## 🏗️ Architecture

```
Client (Browser)
    ↓
Tracking SDK (herodotus.js)
    ↓
API Gateway (Gin)
    ↓
Event Collector
    ↓
NATS Queue
    ↓
Workers
    ↓
MongoDB + Redis
    ↓
WebSocket/SSE
    ↓
Dashboard (React)
```

## 📦 Tech Stack

### Backend
- **Language**: Go 1.22
- **Framework**: Gin
- **Database**: MongoDB
- **Cache**: Redis
- **Queue**: NATS
- **Auth**: JWT

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Charts**: Recharts
- **HTTP**: Axios

## 🚀 Quick Start

### Prerequisites
- Go 1.22+
- Node.js 18+
- MongoDB
- Redis
- NATS

### Backend Setup

```bash
cd herodotus-backend

# Copy environment file
cp .env.example .env

# Install dependencies
go mod download

# Run with Docker Compose
make docker-up

# Or run locally
make dev
```

### Frontend Setup

```bash
cd herodotus-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to access the dashboard.

## 📖 Usage

### 1. Register & Login
Create an account at `/register` and login.

### 2. Add Domain
Navigate to Domains and add your website domain.

### 3. Generate API Key
Go to API Keys and generate a key for your domain.

### 4. Install Tracking Script

Add this to your website's `<head>`:

```html
<script src="https://cdn.herodotus.io/herodotus.js"></script>
<script>
  Herodotus.init('YOUR_API_KEY');
</script>
```

### 5. View Analytics
Return to the dashboard to see real-time analytics!

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=herodotus
REDIS_URL=redis://localhost:6379
NATS_URL=nats://localhost:4222
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:8080
```

## 🐳 Docker Deployment

### Build Images

```bash
# Backend
cd herodotus-backend
docker build -t herodotus-backend .

# Frontend
cd herodotus-frontend
docker build -t herodotus-frontend .
```

### Run with Docker Compose

```bash
cd herodotus-backend
docker-compose up -d
```

## 📊 API Documentation

### Authentication

```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Tracking

```bash
# Track event
POST /api/track
Headers: X-API-Key: YOUR_API_KEY
{
  "path": "/page",
  "referrer": "https://google.com",
  "visitor_id": "v_abc123"
}
```

### Stats

```bash
# Real-time stats
GET /api/stats/realtime?domain_id=DOMAIN_ID
Headers: Authorization: Bearer TOKEN

# Overview stats
GET /api/stats/overview?domain_id=DOMAIN_ID
Headers: Authorization: Bearer TOKEN
```

## 🔐 Security

- JWT-based authentication
- API key validation
- Domain whitelisting
- Rate limiting
- IP anonymization
- CORS protection

## 📈 Scaling Strategy

### Phase 1: Single Server
- Monolithic Go service
- MongoDB + Redis
- Suitable for <100k events/day

### Phase 2: Distributed
- Separate collector service
- NATS message queue
- Multiple workers
- Suitable for <1M events/day

### Phase 3: High Scale
- ClickHouse for analytics
- Horizontal scaling
- Edge collectors
- CDN for SDK
- Suitable for 10M+ events/day

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Named after Herodotus, the ancient Greek historian
- Inspired by privacy-focused analytics tools
- Built with modern web technologies

## 📞 Support

- Documentation: [docs.herodotus.io](https://docs.herodotus.io)
- Issues: [GitHub Issues](https://github.com/nesohq/herodotus/issues)
- Email: support@herodotus.io

---

Built with ❤️ by the Herodotus team
