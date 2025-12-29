# API Documentation

## Base URL
```
Development: http://localhost:3001/api
Production: https://api.brandscene.ai/api
```

## Authentication
Currently, the API uses a placeholder authentication system. Full JWT-based authentication will be implemented in a future update.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "uuid-v4"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "uuid-v4"
  }
}
```

## Endpoints

### Health Check
```http
GET /health
```

**Response**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Projects

### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "name": "string (required, max 255)",
  "description": "string (optional, max 1000)"
}
```

**Response**: Project object

### Get All Projects
```http
GET /api/projects
```

**Response**: Array of Project objects

### Get Project
```http
GET /api/projects/:id
```

**Response**: Project object with related campaigns

---

## Campaigns

### Create Campaign
```http
POST /api/projects/:projectId/campaigns
Content-Type: application/json

{
  "brandName": "string (required, max 255)",
  "productName": "string (required, max 255)",
  "productDescription": "string (required, min 10)",
  "targetAudience": "string (required, min 10)",
  "keyBenefits": ["string"] (optional),
  "brandVoice": "string (optional, max 100)",
  "tone": "string (optional, max 100)",
  "additionalContext": "string (optional)",
  "videoLength": "number (optional, 10-180, default 30)",
  "videoStyle": "string (optional, max 100)"
}
```

**Response**: Campaign object

### Get Campaign
```http
GET /api/projects/campaigns/:campaignId
```

**Response**: Campaign object with research and scripts

### Update Campaign
```http
PUT /api/projects/campaigns/:campaignId
Content-Type: application/json

{
  // Any campaign fields to update
}
```

**Response**: Updated Campaign object

---

## Research

### Conduct Research
```http
POST /api/projects/campaigns/:campaignId/research
```

Triggers AI-powered market research analysis.

**Response**: ResearchData object
```json
{
  "id": "uuid",
  "campaignId": "uuid",
  "researchType": "comprehensive",
  "query": "string",
  "results": {
    "insights": ["string"],
    "trends": ["string"],
    "competitorAnalysis": ["string"],
    "recommendations": ["string"],
    "sources": ["string"],
    "confidenceScore": 0.95
  },
  "confidenceScore": 0.95,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Scripts

### Generate Scripts
```http
POST /api/projects/campaigns/:campaignId/scripts
Content-Type: application/json

{
  "variantCount": "number (optional, 1-5, default 3)"
}
```

Generates multiple script variations using AI.

**Response**: Array of Script objects
```json
[
  {
    "id": "uuid",
    "campaignId": "uuid",
    "variantNumber": 1,
    "title": "string",
    "content": "string",
    "durationSeconds": 45,
    "tone": "string",
    "style": "string",
    "metadata": {
      "hooks": ["string"],
      "keyMessages": ["string"],
      "callToAction": "string"
    },
    "status": "generated",
    "approved": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Approve Script
```http
PUT /api/projects/scripts/:scriptId/approve
```

Approves a script and advances the project to Stage 2.

**Response**: Updated Script object with approved status

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Resource not found |
| `RESOURCE_ALREADY_EXISTS` | 409 | Duplicate resource |
| `AI_SERVICE_ERROR` | 503 | AI service unavailable |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Rate Limiting

Rate limiting is configured but not enforced in development. Production limits:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

---

## Data Models

### Project
```typescript
{
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  currentStage: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Campaign
```typescript
{
  id: string;
  projectId: string;
  brandName: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  keyBenefits?: string[];
  brandVoice?: string;
  tone?: string;
  additionalContext?: string;
  videoLength: number;
  videoStyle?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Script
```typescript
{
  id: string;
  campaignId: string;
  variantNumber: number;
  title: string;
  content: string;
  durationSeconds?: number;
  tone?: string;
  style?: string;
  metadata?: {
    hooks: string[];
    keyMessages: string[];
    callToAction: string;
  };
  status: 'pending' | 'generating' | 'generated' | 'approved' | 'rejected';
  approved: boolean;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Example Usage

### Complete Flow

```javascript
// 1. Create project
const project = await fetch('/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Summer Campaign 2024',
    description: 'Q3 product launch'
  })
}).then(r => r.json());

// 2. Create campaign
const campaign = await fetch(`/api/projects/${project.data.id}/campaigns`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brandName: 'TechFlow',
    productName: 'FlowBoard Pro',
    productDescription: 'Collaborative whiteboard...',
    targetAudience: 'Remote teams...',
    tone: 'Inspirational'
  })
}).then(r => r.json());

// 3. Conduct research
const research = await fetch(
  `/api/projects/campaigns/${campaign.data.id}/research`,
  { method: 'POST' }
).then(r => r.json());

// 4. Generate scripts
const scripts = await fetch(
  `/api/projects/campaigns/${campaign.data.id}/scripts`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variantCount: 3 })
  }
).then(r => r.json());

// 5. Approve script
const approved = await fetch(
  `/api/projects/scripts/${scripts.data[0].id}/approve`,
  { method: 'PUT' }
).then(r => r.json());
```

---

## Webhooks (Future Feature)

Webhook support for asynchronous operations will be added:
- Script generation completion
- Video rendering completion
- Processing errors

---

For questions or support: api@brandscene.ai
