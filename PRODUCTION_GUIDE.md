# Production Deployment Guide

## Overview

This application is now production-ready with real-time features, API integration, and comprehensive error handling. This guide will help you deploy it to production.

## Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context + TanStack Query
- **Real-time**: WebSocket connections
- **Styling**: Tailwind CSS + shadcn/ui

### Backend Requirements
You'll need to implement a backend API with the following endpoints:

## API Endpoints

### Authentication
```
POST   /api/auth/signin          - Sign in user
POST   /api/auth/signup          - Register new user
POST   /api/auth/signout         - Sign out user
POST   /api/auth/refresh         - Refresh access token
GET    /api/auth/me              - Get current user
PATCH  /api/auth/profile         - Update user profile
POST   /api/auth/change-password - Change password
POST   /api/auth/reset-password  - Request password reset
```

### Posts
```
GET    /api/posts                - Get posts (with filters)
GET    /api/posts/:id            - Get single post
POST   /api/posts                - Create post
PATCH  /api/posts/:id            - Update post
DELETE /api/posts/:id            - Delete post
POST   /api/posts/:id/like       - Like post
DELETE /api/posts/:id/like       - Unlike post
POST   /api/posts/:id/upvote     - Upvote post
POST   /api/posts/:id/downvote   - Downvote post
POST   /api/posts/:id/repost     - Repost
```

### Comments
```
GET    /api/posts/:id/comments   - Get post comments
POST   /api/posts/:id/comments   - Create comment
PATCH  /api/comments/:id         - Update comment
DELETE /api/comments/:id         - Delete comment
POST   /api/comments/:id/upvote  - Upvote comment
POST   /api/comments/:id/downvote- Downvote comment
```

### Communities
```
GET    /api/communities          - Get all communities
GET    /api/communities/joined   - Get joined communities
GET    /api/communities/:id      - Get community details
POST   /api/communities          - Create community
PATCH  /api/communities/:id      - Update community
POST   /api/communities/:id/join - Join community
DELETE /api/communities/:id/join - Leave community
GET    /api/communities/:id/members - Get members
```

### Notifications
```
GET    /api/notifications        - Get notifications
GET    /api/notifications/unread-count - Get unread count
PATCH  /api/notifications/:id/read - Mark as read
POST   /api/notifications/read-all - Mark all as read
DELETE /api/notifications/:id    - Delete notification
```

## WebSocket Events

### Client → Server
```javascript
{
  type: 'heartbeat',
  timestamp: '2024-03-01T12:00:00Z'
}
```

### Server → Client
```javascript
{
  type: 'notification' | 'post_update' | 'comment_new' | 'like' | 'follow' | 'community_update' | 'online_status',
  data: { /* event-specific data */ },
  timestamp: '2024-03-01T12:00:00Z'
}
```

## Environment Variables

### Required
```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_WS_BASE_URL=wss://api.yourdomain.com
```

### Optional
```bash
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_ANALYTICS=false
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

## Deployment Steps

### 1. Frontend Deployment (Vercel/Netlify)

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### 2. Backend Deployment

#### Recommended Stack
- **Node.js**: Express.js or Fastify
- **Database**: PostgreSQL or MongoDB
- **Cache**: Redis
- **File Storage**: AWS S3 or Cloudinary
- **WebSocket**: Socket.io or native WebSocket

#### Example Backend Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── postController.ts
│   │   ├── commentController.ts
│   │   ├── communityController.ts
│   │   └── notificationController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Post.ts
│   │   ├── Comment.ts
│   │   ├── Community.ts
│   │   └── Notification.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   ├── comments.ts
│   │   ├── communities.ts
│   │   └── notifications.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── postService.ts
│   │   └── websocketService.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── validation.ts
│   │   └── upload.ts
│   └── server.ts
├── package.json
└── tsconfig.json
```

### 3. Database Setup

#### PostgreSQL Schema Example
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar TEXT,
  bio TEXT,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  reputation INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'post',
  community_id UUID REFERENCES communities(id),
  is_anonymous BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  reposts INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Communities table
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  color VARCHAR(20),
  category VARCHAR(50),
  members INTEGER DEFAULT 0,
  online_members INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_community_id ON posts(community_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

### 4. Security Considerations

#### Authentication
- Use JWT tokens with short expiration (15 minutes)
- Implement refresh tokens (7 days)
- Hash passwords with bcrypt (10+ rounds)
- Implement rate limiting on auth endpoints

#### API Security
- Enable CORS with specific origins
- Implement request validation
- Use helmet.js for security headers
- Sanitize user inputs
- Implement rate limiting (100 requests/15 minutes per IP)

#### WebSocket Security
- Authenticate WebSocket connections with JWT
- Implement heartbeat mechanism (30 seconds)
- Limit connections per user (3 max)
- Validate all incoming messages

### 5. Performance Optimization

#### Frontend
- Enable code splitting
- Lazy load routes
- Optimize images (WebP format)
- Use CDN for static assets
- Enable service worker for offline support

#### Backend
- Implement Redis caching
- Use database connection pooling
- Enable gzip compression
- Implement pagination (20 items per page)
- Use database indexes

#### CDN Configuration
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
});
```

### 6. Monitoring & Analytics

#### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics or Plausible
- **Performance**: Vercel Analytics or Lighthouse CI
- **Uptime**: UptimeRobot or Pingdom

#### Implementation
```typescript
// src/lib/monitoring.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### 7. CI/CD Pipeline

#### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

### Load Testing
Use tools like Apache JMeter or k6 to test:
- 1000 concurrent users
- 10,000 requests per minute
- WebSocket connection stability

## Backup & Recovery

### Database Backups
- Daily automated backups
- 30-day retention
- Point-in-time recovery enabled

### File Storage Backups
- Replicate across multiple regions
- Versioning enabled
- Lifecycle policies for old files

## Scaling Strategy

### Horizontal Scaling
- Use load balancer (AWS ALB, Nginx)
- Deploy multiple backend instances
- Use Redis for session storage
- Implement sticky sessions for WebSocket

### Database Scaling
- Read replicas for queries
- Write to primary database
- Connection pooling (max 100 connections)
- Query optimization

## Cost Estimation

### Small Scale (< 10K users)
- Frontend: $0 (Vercel/Netlify free tier)
- Backend: $20-50/month (DigitalOcean, Railway)
- Database: $15-25/month (Managed PostgreSQL)
- Storage: $5-10/month (AWS S3)
- **Total**: ~$40-85/month

### Medium Scale (10K-100K users)
- Frontend: $20/month (Vercel Pro)
- Backend: $100-200/month (Multiple instances)
- Database: $50-100/month (Larger instance)
- Storage: $20-50/month
- CDN: $20-40/month
- **Total**: ~$210-410/month

## Support & Maintenance

### Regular Tasks
- Monitor error rates daily
- Review performance metrics weekly
- Update dependencies monthly
- Security audits quarterly
- Database optimization quarterly

### Emergency Procedures
1. Check error tracking dashboard
2. Review server logs
3. Check database connections
4. Verify API endpoints
5. Test WebSocket connections
6. Roll back if necessary

## Conclusion

Your application is now production-ready with:
- ✅ Real-time features via WebSocket
- ✅ Comprehensive API integration
- ✅ Error handling and fallbacks
- ✅ Performance optimizations
- ✅ Security best practices
- ✅ Scalable architecture

For questions or issues, refer to the documentation or create an issue in the repository.
