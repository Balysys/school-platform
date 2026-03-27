# Configuration pour School Platform

## Backend (.env)
```
DATABASE_URL="file:./prisma/dev.db"
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-key-change-in-production
CORS_ORIGIN=http://localhost:5173
```

## Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=School Platform
```

## Production (.env.production)

### Backend
```
DATABASE_URL="postgresql://user:pass@db.example.com:5432/school"
NODE_ENV=production
PORT=3001
JWT_SECRET=super-secret-key-from-environment
CORS_ORIGIN=https://app.example.com
```

### Frontend
```
VITE_API_URL=https://api.example.com
VITE_APP_NAME=School Platform
```

---

## Docker Setup (Optional)

### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: sqlite:./db.sqlite
    volumes:
      - ./backend/prisma:/app/prisma

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:3000"
    depends_on:
      - backend
```

---

## GitHub Actions (CI/CD)

### .github/workflows/test.yml
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Backend
        run: cd backend && npm ci
      
      - name: Install Frontend
        run: cd frontend && npm ci
      
      - name: Build Frontend
        run: cd frontend && npm run build
      
      - name: Test Backend
        run: cd backend && npm test
```

---

## Nginx Configuration (Production)

### nginx.conf
```nginx
upstream backend {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name app.example.com;
    
    # Frontend
    location / {
        root /var/www/school-platform/dist;
        try_files $uri /index.html;
        add_header Cache-Control "public, max-age=3600";
    }
    
    # API proxy
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## PM2 Configuration (Process Management)

### ecosystem.config.js
```javascript
module.exports = {
  apps: [{
    name: 'school-backend',
    script: './dist/app.js',
    cwd: './backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

---

## Database Migrations

```bash
# Prisma commands
npx prisma migrate dev --name init
npx prisma migrate deploy
npx prisma db seed
npx prisma prisma:reset
```

---

## Performance Optimization

### Frontend
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          ui: ['./src/components'],
        }
      }
    },
    minify: 'terser',
    sourcemap: false,
  }
}
```

### Backend
```javascript
// Use connection pooling
DATABASE_URL=postgresql://user:pass@host/db?schema=public&poolSize=20
```

---

## Monitoring & Logging

### Winston Logger (Backend)
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Sentry Error Tracking
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/project",
  environment: "production",
});
```

---

## Security Checklist

- [ ] Update JWT_SECRET to strong random value
- [ ] Enable HTTPS in production
- [ ] Use environment variables for secrets
- [ ] Set up rate limiting (express-ratelimit)
- [ ] Enable CORS only for production domain
- [ ] Add request logging (morgan)
- [ ] Set CSP headers (Content-Security-Policy)
- [ ] Use HSTS headers for HTTPS
- [ ] Regular dependency updates (npm audit)
- [ ] Database backups automated

---

## Monitoring Metrics

```javascript
// API Response Time
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});

// Memory usage
setInterval(() => {
  const mem = process.memoryUsage();
  console.log(`Memory: ${Math.round(mem.heapUsed / 1024 / 1024)} MB`);
}, 60000);
```

---

**Last Updated:** 27 Mars 2026
