# Quick Start Guide - Herodotus Frontend (Next.js)

Get up and running in 5 minutes!

## 🚀 Installation

```bash
cd herodotus-frontend
npm install
```

## ⚙️ Configuration

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🏃 Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
npm run build
npm run start
```

## 🐳 Docker

```bash
docker build -t herodotus-frontend .
docker run -p 3000:3000 herodotus-frontend
```

## ✅ Verify Installation

1. Open http://localhost:3000
2. You should see login page
3. Register a new account
4. Access dashboard

## 🔧 Troubleshooting

### Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### API connection errors

1. Check backend is running on port 8080
2. Verify `.env.local` has correct API_URL
3. Check browser console for errors

### Build errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Next Steps

- Read [USAGE_GUIDE.md](./USAGE_GUIDE.md) for detailed usage
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- See [MIGRATION_TO_NEXTJS.md](./MIGRATION_TO_NEXTJS.md) for migration details

---

**You're all set! 🎉**
