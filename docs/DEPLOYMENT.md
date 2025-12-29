# Deployment Guide

## Overview
This guide covers deploying the BrandScene AI platform to production.

## Architecture

### Frontend Deployment (Vercel)
The Next.js frontend is optimized for Vercel deployment.

### Backend Deployment (Railway/Render/AWS)
The Express.js backend can be deployed to various platforms.

### Database (Supabase/Railway/AWS RDS)
PostgreSQL database hosting options.

## Prerequisites

- Git repository
- Domain name (optional)
- OpenAI API key
- Database hosting account
- Deployment platform accounts

## Environment Variables

### Production Backend (.env)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/brandscene
OPENAI_API_KEY=sk-...
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your-secure-jwt-secret
```

### Production Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Deployment Steps

### 1. Database Setup

#### Option A: Railway
1. Create new PostgreSQL database
2. Copy connection string
3. Run migrations: `npx prisma migrate deploy`

#### Option B: Supabase
1. Create new project
2. Get connection string from Settings > Database
3. Run migrations

### 2. Backend Deployment

#### Vercel (Serverless)
```bash
cd backend
vercel --prod
```

#### Railway
1. Connect GitHub repository
2. Select backend directory
3. Add environment variables
4. Deploy

#### Render
1. Create new Web Service
2. Connect repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables

### 3. Frontend Deployment

#### Vercel (Recommended)
```bash
cd frontend
vercel --prod
```

#### Netlify
```bash
cd frontend
npm run build
netlify deploy --prod
```

### 4. Post-Deployment

1. Run database migrations
2. Verify API health endpoint
3. Test frontend connectivity
4. Set up monitoring
5. Configure CDN
6. Enable SSL

## Monitoring

### Recommended Tools
- Sentry for error tracking
- LogRocket for session replay
- Datadog for APM
- Uptime Robot for availability

## Performance Optimization

### Frontend
- Enable image optimization
- Use CDN for static assets
- Enable caching
- Compress assets

### Backend
- Enable response compression
- Implement Redis caching
- Use connection pooling
- Set up rate limiting

## Scaling

### Horizontal Scaling
- Use load balancer
- Deploy multiple backend instances
- Database read replicas

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Enable caching layers

## Backup Strategy

### Database
- Automated daily backups
- Point-in-time recovery
- Off-site backup storage

### Assets
- S3 or equivalent storage
- Versioning enabled
- Lifecycle policies

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] Database encrypted
- [ ] API keys rotated
- [ ] Security headers set
- [ ] Dependencies updated

## Rollback Procedure

1. Identify issue
2. Stop new deployments
3. Revert to previous version
4. Verify functionality
5. Investigate root cause
6. Plan fix deployment

## Support

For deployment issues, contact: devops@brandscene.ai
