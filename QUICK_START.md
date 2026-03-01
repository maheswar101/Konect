# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings (optional for development)
# The app works with mock data by default!
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Browser
```
http://localhost:5173
```

## ✨ That's It!

The app is now running with:
- ✅ Mock data (no backend needed)
- ✅ Full authentication flow
- ✅ All features working
- ✅ Real-time simulation

## 🎯 Try These Features

### 1. Sign Up
1. Click "Sign Up" button
2. Enter any email/username/password
3. You're in! (using mock auth)

### 2. Create a Post
1. Click the "+" button in bottom nav
2. Write something
3. Post it!

### 3. Explore Communities
1. Go to Communities tab
2. Browse available communities
3. Join one
4. See community posts

### 4. Check Your Profile
1. Click your avatar (top right)
2. See your stats
3. Toggle anonymous mode
4. View your posts

## 🔌 Connect to Real Backend

### Option 1: Use Your Own Backend
```bash
# Update .env
VITE_API_BASE_URL=https://your-api.com/api
VITE_WS_BASE_URL=wss://your-api.com
```

### Option 2: Build Backend (Recommended)
See `PRODUCTION_GUIDE.md` for complete backend setup.

Quick backend with Express.js:
```bash
# In a new terminal
mkdir backend && cd backend
npm init -y
npm install express cors jsonwebtoken bcrypt
```

Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Auth endpoint
app.post('/api/auth/signin', (req, res) => {
  res.json({
    user: { id: '1', email: req.body.email, username: 'user' },
    token: 'mock-token',
    refreshToken: 'mock-refresh'
  });
});

// Posts endpoint
app.get('/api/posts', (req, res) => {
  res.json([
    { id: '1', content: 'Hello from backend!', /* ... */ }
  ]);
});

app.listen(3000, () => console.log('Backend running on :3000'));
```

Run it:
```bash
node server.js
```

Update frontend `.env`:
```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📱 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode

# Code Quality
npm run lint             # Lint code
npm run type-check       # Check TypeScript types
```

## 🎨 Customize

### Change Theme Colors
Edit `src/index.css`:
```css
:root {
  --primary: 205 100% 55%;    /* Blue */
  --accent: 280 80% 60%;      /* Purple */
  /* Change these to your brand colors! */
}
```

### Add Your Logo
Replace in `src/components/layout/TopBar.tsx`:
```typescript
<div className="w-8 h-8 ...">
  <img src="/your-logo.svg" alt="Logo" />
</div>
```

### Modify Mock Data
Edit `src/data/mockData.ts` to change:
- Posts
- Communities
- Users
- Notifications

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Build Errors
```bash
# Clear cache
rm -rf node_modules .vite
npm install
npm run dev
```

### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

## 📚 Learn More

### Documentation
- `README.md` - Project overview
- `AUTHENTICATION_GUIDE.md` - Auth system
- `DYNAMIC_FEATURES.md` - All features
- `PRODUCTION_GUIDE.md` - Deployment
- `UPGRADE_SUMMARY.md` - What changed

### Code Structure
```
src/
├── components/     # UI components
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── pages/          # Route pages
├── services/       # API services
├── data/           # Mock data
└── lib/            # Utilities
```

### Key Files
- `src/App.tsx` - Main app & routing
- `src/contexts/AuthContext.tsx` - Auth state
- `src/services/api.ts` - API client
- `src/hooks/usePosts.ts` - Post operations

## 🎓 Next Steps

### For Development
1. ✅ App is running
2. 📖 Read `DYNAMIC_FEATURES.md`
3. 🎨 Customize theme
4. 🔧 Add features

### For Production
1. 🔌 Build backend (see `PRODUCTION_GUIDE.md`)
2. 🗄️ Set up database
3. 🚀 Deploy frontend
4. 📊 Add monitoring

## 💬 Need Help?

### Check These First
1. Is the dev server running?
2. Is the port available?
3. Are dependencies installed?
4. Is `.env` configured?

### Still Stuck?
1. Check browser console for errors
2. Check terminal for errors
3. Review documentation
4. Check TypeScript types

## 🎉 You're Ready!

Start building your social media platform!

**Happy coding!** 🚀

---

**Pro Tips:**
- Use React DevTools for debugging
- Use Network tab to see API calls
- Use Redux DevTools for state inspection
- Hot reload works automatically
- TypeScript will catch errors early

**Remember:**
- The app works offline with mock data
- No backend needed for development
- All features are functional
- Production-ready when you are!
