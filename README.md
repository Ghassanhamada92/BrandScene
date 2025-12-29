# BrandScene AI - AI-Powered Video Content Creation Platform

<div align="center">

![BrandScene AI](https://img.shields.io/badge/BrandScene-AI%20Platform-purple?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**Transform your brand story into engaging videos with AI-powered script generation, intelligent scene composition, and professional video stitching.**

[Features](#features) • [Architecture](#architecture) • [Installation](#installation) • [Usage](#usage) • [API Documentation](#api-documentation)

</div>

---

## 🎯 Overview

BrandScene AI is a comprehensive 4-stage video content creation platform that leverages artificial intelligence to automate and enhance the video production process. From initial brand research to final video rendering, the platform provides an end-to-end solution for creating professional marketing videos.

## ✨ Features

### 🎬 Stage 1: Script Generation (Fully Implemented)
- **AI-Powered Research**: Comprehensive market research using GPT-4
- **Target Audience Analysis**: Deep insights into demographics and psychographics
- **Competitor Analysis**: Automated competitive landscape evaluation
- **Multi-Variant Scripts**: Generate 3 optimized script variations
- **Approval Workflow**: Review and approve scripts before proceeding

### 🎨 Stage 2: Scene Composition (Infrastructure Ready)
- Intelligent script breakdown into logical scenes
- AI-generated visual descriptions for each scene
- Multiple image variations per scene
- Scene-by-scene editing and refinement

### 🎥 Stage 3: Video Synthesis (Infrastructure Ready)
- Stock video integration
- AI-powered video generation
- Professional voiceover synthesis
- Background music selection

### 🎞️ Stage 4: Intelligent Stitching (Infrastructure Ready)
- Automated video assembly
- Smart transition generation
- Audio-visual synchronization
- Music and narration mixing

## 🏗️ Architecture

### Monorepo Structure
```
brandscene-ai-platform/
├── frontend/          # Next.js 14 with App Router
├── backend/           # Express.js with TypeScript
├── database/          # Prisma schema and migrations
├── shared/            # Shared types and validators
└── docs/              # Documentation
```

### Tech Stack

#### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **UI Components**: Custom components with glass morphism

#### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI GPT-4 Turbo
- **Validation**: Zod schemas
- **Logging**: Custom structured logger
- **Error Handling**: Custom error classes with proper HTTP codes

#### Database
- **ORM**: Prisma
- **Database**: PostgreSQL 15+
- **Features**: Full-text search, JSONB columns, UUID primary keys

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 15+
- OpenAI API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd brandscene-ai-platform
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install workspace dependencies
npm run install:all
```

### 3. Environment Setup

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/brandscene

# API Keys
OPENAI_API_KEY=your_openai_api_key_here

# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# JWT (for future auth implementation)
JWT_SECRET=your_jwt_secret_here
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Database Setup
```bash
# Navigate to database directory
cd database

# Generate Prisma client
npm run generate

# Run migrations
npm run migrate

# (Optional) Seed database
npm run seed
```

### 5. Build Shared Package
```bash
cd shared
npm run build
```

## 💻 Development

### Start Development Servers

#### Option 1: Start All Services
```bash
# From root directory
npm run dev
```

#### Option 2: Start Individually
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## 📖 Usage

### Creating Your First Campaign

1. **Navigate to Create Page**
   - Click "Start Creating" from homepage
   - Or visit `/create` directly

2. **Enter Brand Information**
   - Brand name
   - Product name and description
   - Target audience details
   - Optional: brand voice, tone, additional context

3. **Conduct AI Research**
   - Click "Start Research"
   - AI analyzes market trends, audience, and competitors
   - Review comprehensive insights

4. **Generate Script Variants**
   - Click "Generate Scripts"
   - Receive 3 optimized script variations
   - Each with different styles and approaches

5. **Review and Approve**
   - Read full scripts
   - Compare variants
   - Approve your favorite to proceed

## 🎨 UI/UX Features

### Design System
- **Glass Morphism**: Modern frosted glass effect with backdrop blur
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Mobile-first approach, works on all devices
- **Accessibility**: WCAG AA compliant
  - Semantic HTML
  - ARIA labels and descriptions
  - Keyboard navigation
  - Screen reader support
  - Color contrast compliance

### Visual Feedback
- Loading states with skeleton screens
- Progress indicators for multi-step processes
- Toast notifications for actions
- Error boundaries for graceful error handling
- Optimistic UI updates

### Color Palette
- Primary: Purple gradient (500-600)
- Secondary: Pink gradient (500-600)
- Accents: Blue, Green, Yellow
- Background: Dark gradient (slate-900 to purple-900)

## 🔌 API Documentation

### Projects

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "name": "My Campaign",
  "description": "Campaign description"
}
```

#### Get All Projects
```http
GET /api/projects
```

#### Get Project by ID
```http
GET /api/projects/:id
```

### Campaigns

#### Create Campaign
```http
POST /api/projects/:projectId/campaigns
Content-Type: application/json

{
  "brandName": "TechFlow",
  "productName": "FlowBoard Pro",
  "productDescription": "A collaborative whiteboard tool...",
  "targetAudience": "Remote teams and creative professionals...",
  "keyBenefits": ["Real-time collaboration", "AI assistance"],
  "brandVoice": "Professional",
  "tone": "Inspirational"
}
```

#### Get Campaign
```http
GET /api/projects/campaigns/:campaignId
```

#### Update Campaign
```http
PUT /api/projects/campaigns/:campaignId
Content-Type: application/json

{
  "brandName": "Updated Name"
}
```

### Research

#### Conduct Research
```http
POST /api/projects/campaigns/:campaignId/research
```

### Scripts

#### Generate Scripts
```http
POST /api/projects/campaigns/:campaignId/scripts
Content-Type: application/json

{
  "variantCount": 3
}
```

#### Approve Script
```http
PUT /api/projects/scripts/:scriptId/approve
```

## 🛠️ Development Tools

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Zod**: Runtime validation

### Database Tools
```bash
# Prisma Studio (Database GUI)
cd database
npm run studio

# Create migration
npm run migrate

# Reset database
npx prisma migrate reset
```

### Build for Production
```bash
# Build all packages
npm run build

# Build individually
cd frontend && npm run build
cd backend && npm run build
cd shared && npm run build
```

## 🎯 Roadmap

### Stage 2: Scene Composition
- [ ] AI-powered scene breakdown
- [ ] DALL-E integration for image generation
- [ ] Scene editing interface
- [ ] Image variation selection

### Stage 3: Video Synthesis
- [ ] Stock video API integration (Pexels, Unsplash)
- [ ] ElevenLabs voice synthesis
- [ ] Background music library
- [ ] Audio-visual preview

### Stage 4: Intelligent Stitching
- [ ] FFmpeg video processing
- [ ] Transition algorithm
- [ ] Audio mixing and sync
- [ ] Final render queue
- [ ] Export options (MP4, WebM, etc.)

### Additional Features
- [ ] User authentication and authorization
- [ ] Team collaboration
- [ ] Template library
- [ ] Analytics and insights
- [ ] Video export presets
- [ ] Cloud storage integration

## 🔒 Security

- Input validation on all endpoints
- SQL injection prevention (Prisma ORM)
- XSS protection
- CORS configuration
- Rate limiting (ready to implement)
- Environment variable management
- Secure error messages (no data leakage)

## 🧪 Testing

```bash
# Run tests (to be implemented)
npm test

# Run tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 💬 Support

For support, email support@brandscene.ai or open an issue on GitHub.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Vercel for Next.js
- Prisma for the amazing ORM
- The open-source community

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and AI**

[Documentation](./docs) • [API Reference](./docs/api) • [Contributing](./CONTRIBUTING.md)

</div>
