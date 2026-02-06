# Migration from Vite/React to Next.js 14

This document explains the migration from Vite + React Router to Next.js 14 with App Router.

## Why Next.js?

✅ **Benefits:**
- Server-side rendering (SSR) for better SEO
- Built-in routing (no react-router-dom needed)
- API routes support
- Automatic code splitting
- Image optimization
- Better production performance
- No nginx configuration needed
- Simpler deployment

## Key Changes

### 1. Routing

**Before (React Router):**
```typescript
// App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</BrowserRouter>
```

**After (Next.js App Router):**
```
src/app/
├── login/page.tsx
├── dashboard/page.tsx
└── layout.tsx
```

### 2. Environment Variables

**Before:**
```env
VITE_API_URL=http://localhost:8080
```

**After:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Access in code:
```typescript
// Before
const apiUrl = import.meta.env.VITE_API_URL;

// After
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### 3. Client Components

Next.js uses Server Components by default. Add `'use client'` for interactive components:

```typescript
'use client';

import { useState } from 'react';

export default function MyComponent() {
  const [state, setState] = useState();
  // ...
}
```

### 4. Navigation

**Before:**
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard');
```

**After:**
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard');
```

### 5. Links

**Before:**
```typescript
import { Link } from 'react-router-dom';

<Link to="/dashboard">Dashboard</Link>
```

**After:**
```typescript
import Link from 'next/link';

<Link href="/dashboard">Dashboard</Link>
```

### 6. No More index.html

Next.js generates HTML automatically. No need for `index.html` or `main.tsx`.

### 7. No More Vite Config

Replace `vite.config.ts` with `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### 8. No More Nginx

Next.js has its own server. No nginx configuration needed!

## File Structure Comparison

### Before (Vite)
```
herodotus-frontend/
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   └── components/
├── vite.config.ts
└── nginx.conf
```

### After (Next.js)
```
herodotus-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/page.tsx
│   │   └── dashboard/page.tsx
│   └── components/
└── next.config.js
```

## Deployment Changes

### Before (Vite + Nginx)
```dockerfile
FROM node:18-alpine AS builder
RUN npm run build

FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### After (Next.js)
```dockerfile
FROM node:18-alpine AS builder
RUN npm run build

FROM node:18-alpine AS runner
COPY --from=builder /app/.next/standalone ./
CMD ["node", "server.js"]
```

## Migration Checklist

- [x] Remove `index.html`
- [x] Remove `vite.config.ts`
- [x] Remove `nginx.conf`
- [x] Remove `react-router-dom`
- [x] Update `package.json` scripts
- [x] Update `tsconfig.json`
- [x] Convert pages to App Router structure
- [x] Add `'use client'` to interactive components
- [x] Update environment variables
- [x] Update navigation code
- [x] Update Dockerfile
- [x] Test all routes
- [x] Test authentication
- [x] Test API calls

## Performance Improvements

Next.js provides:
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Font optimization
- ✅ Server-side rendering
- ✅ Static generation
- ✅ Incremental static regeneration
- ✅ Better caching

## Breaking Changes

None! The API remains the same. Only internal routing changed.

## Testing

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Docker
docker build -t herodotus-frontend .
docker run -p 3000:3000 herodotus-frontend
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

---

**Migration completed successfully! 🎉**
