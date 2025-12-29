# Production Monitoring Guide

Complete observability setup for BrandScene AI platform.

---

## 📊 Overview

This guide covers monitoring, logging, error tracking, and performance monitoring for production deployments.

---

## 🔍 Health Checks

### **Application Health**

```bash
# Backend health check
curl https://api.yourdomain.com/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Database Health**

```bash
# Check database connection
curl https://api.yourdomain.com/api/health

# Monitor connection pool
# Add to backend health endpoint
```

---

## 📝 Logging

### **Structured Logging**

The platform uses structured JSON logging:

```typescript
// Example log entry
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "INFO",
  "message": "Script generation completed",
  "context": {
    "requestId": "uuid-v4",
    "userId": "user-id",
    "scriptId": "script-id",
    "duration": "2.5s"
  }
}
```

### **Log Levels**

- `DEBUG`: Detailed debugging information (development only)
- `INFO`: General informational messages
- `WARN`: Warning messages
- `ERROR`: Error messages with stack traces

### **Log Aggregation**

#### **Option 1: Papertrail**

```bash
# Install
npm install winston-papertrail

# Configure in backend/src/utils/logger.ts
import { Papertrail } from 'winston-papertrail';

const papertrail = new Papertrail({
  host: process.env.PAPERTRAIL_HOST,
  port: process.env.PAPERTRAIL_PORT,
});
```

#### **Option 2: LogRocket**

```bash
# Frontend installation
npm install logrocket

# Configure in frontend
import LogRocket from 'logrocket';
LogRocket.init('your-app-id');
```

#### **Option 3: DataDog**

```bash
# Install
npm install dd-trace

# Initialize in backend
require('dd-trace').init({
  service: 'brandscene-api',
  env: process.env.NODE_ENV,
});
```

---

## 🐛 Error Tracking

### **Sentry Integration**

#### **Backend Setup**

```bash
cd backend
npm install @sentry/node @sentry/tracing
```

```typescript
// backend/src/index.ts
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
});

// Add handlers
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
// ... routes ...
app.use(Sentry.Handlers.errorHandler());
```

#### **Frontend Setup**

```bash
cd frontend
npm install @sentry/react @sentry/tracing
```

```typescript
// frontend/src/app/layout.tsx
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 📈 Application Performance Monitoring (APM)

### **Option 1: New Relic**

```bash
# Install
npm install newrelic

# Create newrelic.js in backend root
exports.config = {
  app_name: ['BrandScene API'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
  },
};

// Require at app start
require('newrelic');
```

### **Option 2: DataDog APM**

```bash
# Install
npm install dd-trace

# Initialize
require('dd-trace').init({
  service: 'brandscene-api',
  analytics: true,
});
```

### **Option 3: Vercel Analytics (Frontend)**

```bash
# Install
npm install @vercel/analytics

// Add to layout
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## ⏱️ Uptime Monitoring

### **UptimeRobot Setup**

1. Sign up at https://uptimerobot.com
2. Create HTTP(s) monitors:
   - API Health: `https://api.yourdomain.com/health`
   - Frontend: `https://yourdomain.com`
   - Interval: 5 minutes
3. Configure alerts:
   - Email notifications
   - SMS (optional)
   - Slack integration
   - PagerDuty integration

### **Pingdom Setup**

1. Sign up at https://www.pingdom.com
2. Create uptime checks
3. Set up transaction monitoring for critical flows
4. Configure alert contacts

---

## 📊 Metrics & Dashboards

### **Key Metrics to Track**

#### **Application Metrics**
- Request rate (requests/minute)
- Response time (p50, p95, p99)
- Error rate (%)
- Success rate (%)

#### **Business Metrics**
- Projects created
- Scripts generated
- Videos rendered
- User sessions

#### **Resource Metrics**
- CPU usage
- Memory usage
- Database connections
- API rate limits

### **Custom Metrics**

```typescript
// Example: Track script generation time
import { performance } from 'perf_hooks';

const start = performance.now();
await AIService.generateScript(params);
const duration = performance.now() - start;

logger.info('Script generation completed', {
  duration: `${duration.toFixed(2)}ms`,
  scriptId,
});
```

---

## 🔔 Alerting

### **Alert Conditions**

#### **Critical**
- API downtime > 1 minute
- Error rate > 5%
- Database connection failures
- P95 response time > 5s

#### **Warning**
- Error rate > 2%
- P95 response time > 3s
- Memory usage > 80%
- CPU usage > 80%

### **Alert Channels**

1. **Email**: For all alerts
2. **SMS**: Critical only
3. **Slack**: Team channel
4. **PagerDuty**: On-call rotation

### **Slack Integration**

```typescript
// backend/src/utils/alerts.ts
import axios from 'axios';

export async function sendSlackAlert(message: string, severity: 'info' | 'warning' | 'error') {
  const color = severity === 'error' ? 'danger' : severity === 'warning' ? 'warning' : 'good';
  
  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    attachments: [{
      color,
      text: message,
      footer: 'BrandScene AI',
      ts: Math.floor(Date.now() / 1000),
    }],
  });
}
```

---

## 📉 Performance Optimization

### **Database Query Monitoring**

```typescript
// Enable Prisma query logging
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
  ],
});

prisma.$on('query', (e) => {
  if (e.duration > 1000) {
    logger.warn('Slow query detected', {
      query: e.query,
      duration: e.duration,
    });
  }
});
```

### **API Response Time Tracking**

```typescript
// middleware/performanceMonitor.ts
import { Request, Response, NextFunction } from 'express';

export function performanceMonitor(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    if (duration > 3000) {
      logger.warn('Slow API response', {
        method: req.method,
        path: req.path,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
      });
    }
  });
  
  next();
}
```

---

## 🔐 Security Monitoring

### **Rate Limiting**

```typescript
// Install
npm install express-rate-limit

// Configure
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({ error: 'Too many requests' });
  },
});

app.use('/api/', limiter);
```

### **Security Headers Monitoring**

```bash
# Test security headers
curl -I https://yourdomain.com

# Expected headers:
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## 📱 Real User Monitoring (RUM)

### **Google Analytics 4**

```typescript
// frontend/src/lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: any) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

### **Custom Events Tracking**

```typescript
// Track user actions
event({
  action: 'script_generated',
  category: 'engagement',
  label: 'stage_1',
});

event({
  action: 'video_rendered',
  category: 'conversion',
  label: 'stage_4',
});
```

---

## 🗂️ Log Retention

### **Retention Policy**

- **ERROR logs**: 90 days
- **WARN logs**: 60 days
- **INFO logs**: 30 days
- **DEBUG logs**: 7 days (development only)

### **Log Rotation**

```bash
# Install rotating file stream
npm install rotating-file-stream

# Configure
import rfs from 'rotating-file-stream';

const logStream = rfs.createStream('api.log', {
  interval: '1d', // rotate daily
  path: '/var/log/brandscene',
  size: '10M', // rotate at 10MB
  compress: 'gzip',
});
```

---

## 📊 Dashboard Examples

### **Grafana Dashboard**

Key panels:
1. Request Rate (req/min)
2. Error Rate (%)
3. Response Time (p50, p95, p99)
4. CPU & Memory Usage
5. Database Connections
6. AI API Calls
7. Video Renders

### **DataDog Dashboard**

Widgets:
- API endpoint performance
- Error tracking
- Database query performance
- User sessions
- Business metrics

---

## 🧪 Synthetic Monitoring

### **Endpoint Tests**

```typescript
// tests/smoke.test.ts
describe('Critical Endpoints', () => {
  it('should return healthy status', async () => {
    const response = await fetch('https://api.yourdomain.com/health');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('healthy');
  });

  it('should create project', async () => {
    const response = await fetch('https://api.yourdomain.com/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Project',
        description: 'Monitoring test',
      }),
    });
    expect(response.status).toBe(201);
  });
});
```

---

## 🆘 Incident Response

### **Runbook**

#### **API Down**
1. Check health endpoint
2. Verify database connectivity
3. Check application logs
4. Restart application if needed
5. Scale horizontally if load issue

#### **High Error Rate**
1. Check error logs for patterns
2. Identify failing endpoint
3. Check external service status (OpenAI, Pexels, etc.)
4. Roll back if recent deployment

#### **Slow Performance**
1. Check database query performance
2. Verify API rate limits not hit
3. Check external service latency
4. Scale resources if needed

---

## 📞 Support Contacts

- **On-Call**: Use PagerDuty rotation
- **Slack**: #brandscene-alerts
- **Email**: ops@brandscene.ai
- **Status Page**: https://status.yourdomain.com

---

For questions: monitoring@brandscene.ai
