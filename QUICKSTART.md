# 🚀 Quick Start Guide

Get BrandScene AI running in under 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 15+ running
- [ ] OpenAI API key ready

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <repository-url>
cd brandscene-ai-platform

# Install all dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ../database && npm install
cd ../shared && npm install && npm run build
```

## Step 2: Environment Setup (1 minute)

### Backend Environment
Create `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/brandscene
OPENAI_API_KEY=sk-your-key-here
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Step 3: Database Setup (1 minute)

```bash
cd database

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

## Step 4: Start Development (1 minute)

### Option A: All at Once
```bash
# From root directory
npm run dev
```

### Option B: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 5: Test the Application

1. **Open Frontend**: http://localhost:3000
2. **Click "Start Creating"**
3. **Fill in Brand Info**:
   - Brand: "TechFlow Solutions"
   - Product: "FlowBoard Pro"
   - Description: "A collaborative whiteboard tool for remote teams"
   - Audience: "Remote teams and creative professionals aged 25-45"
4. **Click "Continue to Research"**
5. **Click "Start Research"** - AI will analyze your market
6. **Click "Generate Scripts"** - AI creates 3 script variants
7. **Review and Approve** a script

## Troubleshooting

### Database Connection Error
```bash
# Ensure PostgreSQL is running
psql -U postgres -c "CREATE DATABASE brandscene;"

# Check connection string in backend/.env
```

### Port Already in Use
```bash
# Backend (3001)
lsof -ti:3001 | xargs kill -9

# Frontend (3000)
lsof -ti:3000 | xargs kill -9
```

### OpenAI API Errors
- Verify API key is correct
- Check you have credits available
- Ensure no rate limits are hit

### Module Not Found
```bash
# Rebuild shared package
cd shared
npm run build

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## What's Next?

- [ ] Read the [full README](./README.md)
- [ ] Explore the [API documentation](./docs/API.md)
- [ ] Check out the [deployment guide](./docs/DEPLOYMENT.md)
- [ ] Review [Stage 2-4 roadmap](./README.md#roadmap)

## Key Features to Try

### 1. Brand Information Form
- Beautiful glass morphism design
- Real-time validation
- Accessibility features

### 2. AI Research
- Comprehensive market analysis
- Audience insights
- Competitor analysis
- Actionable recommendations

### 3. Script Generation
- 3 unique variants
- Optimized for different approaches
- Full script previews
- Metadata with hooks and CTAs

### 4. Approval Workflow
- Compare variants side-by-side
- Expand to read full scripts
- One-click approval

## Architecture Overview

```
┌─────────────────┐
│   Frontend      │  Next.js 14 + TypeScript
│   localhost:3000│  Tailwind + Framer Motion
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │  Express + TypeScript
│   localhost:3001│  Prisma ORM
└────────┬────────┘
         │
         ├──────────┐
         │          │
┌────────▼────┐  ┌─▼──────────┐
│  PostgreSQL │  │  OpenAI    │
│  Database   │  │  GPT-4     │
└─────────────┘  └────────────┘
```

## Project Structure

```
brandscene-ai-platform/
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/# React components
│   │   ├── lib/       # Utilities
│   │   └── store/     # State management
│   └── package.json
│
├── backend/           # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── middleware/
│   └── package.json
│
├── database/          # Prisma schema
│   └── prisma/
│       └── schema.prisma
│
└── shared/            # Shared types
    └── src/
        ├── types/
        └── validators/
```

## Development Tips

### Hot Reload
Both frontend and backend support hot reload. Changes are reflected immediately.

### Database Changes
```bash
# After modifying schema.prisma
cd database
npx prisma migrate dev --name description_of_change
```

### Debugging
- Backend logs are structured JSON in development
- Frontend uses React DevTools
- Use Prisma Studio for database inspection

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npx tsc --noEmit
```

## Common Use Cases

### Creating Multiple Campaigns
1. Return to homepage
2. Click "View Projects"
3. Click "New Project"
4. Repeat the campaign creation flow

### Regenerating Scripts
Scripts are tied to campaigns. To regenerate:
1. Create a new campaign
2. Or modify the existing campaign details

### Viewing Past Research
Navigate to Projects page and click on any project to view its research and scripts.

## Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: Open a GitHub issue
- **API Reference**: See `docs/API.md`
- **Examples**: Check the codebase comments

## Success! 🎉

You now have a fully functional AI video content creation platform running locally!

**Next Steps:**
- Experiment with different brand inputs
- Compare script variants
- Explore the codebase
- Start implementing Stages 2-4

Happy creating! ✨
