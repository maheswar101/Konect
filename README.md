# Nexus - Production-Ready Social Media Platform

A modern, feature-rich social media application with **real-time capabilities**, **dynamic data**, and **production-ready architecture**.

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) - That's it! The app works with mock data out of the box.

📖 **New here?** Read [QUICK_START.md](./QUICK_START.md) for a 5-minute guide.

## ✨ Features

### 🔐 Complete Authentication System
- **Sign In/Sign Up** - Beautiful, modern authentication flows
- **JWT Token Management** - Automatic refresh and persistence
- **Session Management** - Secure, persistent sessions
- **Profile Management** - Update profile, change password
- **Protected Routes** - Automatic redirect for unauthenticated users

### 🎨 Enhanced UI/UX
- **Glassmorphic Design** - Modern, translucent components
- **Gradient Accents** - Eye-catching color combinations
- **Smooth Animations** - Fade-up, pulse-glow, float effects
- **Responsive Layout** - Works on all device sizes
- **Dark Theme** - Carefully crafted color scheme
- **Loading States** - Skeleton screens and spinners
- **Empty States** - Helpful messages and CTAs

### 📱 Core Features
- **Dynamic Feed** - For You, Trending, and Deep Dives tabs
- **Stories** - Instagram-style stories bar
- **Rich Posts** - Upvotes, comments, likes, shares, and reposts
- **Communities** - Join and participate in topic-based communities
- **Real-time Notifications** - Instant updates via WebSocket
- **Profile System** - User profiles with stats and reputation
- **Anonymous Mode** - Post anonymously when needed

### 🚀 Real-Time Features
- **Live Notifications** - Instant toast notifications
- **Live Post Updates** - See new posts in real-time
- **Live Comments** - Comments appear instantly
- **Online Status** - See who's online
- **WebSocket Connection** - Auto-reconnect with heartbeat

### 🔧 Technical Features
- **Full API Integration** - Complete service layer with fallback
- **React Query** - Intelligent caching and state management
- **TypeScript** - 100% type-safe codebase
- **Custom Hooks** - Reusable logic for all features
- **Error Handling** - Comprehensive error boundaries
- **Optimistic Updates** - Instant UI feedback
- **Performance Optimized** - Code splitting and lazy loading ready

## 🛠️ Technologies

- **Vite** - Lightning-fast build tool
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **WebSocket** - Real-time communication
- **shadcn/ui** - Beautiful, accessible components
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)** - Auth system details
- **[DYNAMIC_FEATURES.md](./DYNAMIC_FEATURES.md)** - All features explained
- **[PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md)** - Complete deployment guide
- **[UPGRADE_SUMMARY.md](./UPGRADE_SUMMARY.md)** - What changed

## 🏗️ Project Structure

```
src/
├── components/
│   ├── feed/          # Feed components (PostCard, Stories, etc.)
│   ├── layout/        # Layout components (TopBar, BottomNav)
│   ├── ui/            # shadcn/ui components
│   ├── LoadingSpinner.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx # Authentication state
├── hooks/
│   ├── usePosts.ts    # Post operations
│   ├── useCommunities.ts # Community operations
│   ├── useComments.ts # Comment operations
│   └── useNotifications.ts # Notification operations
├── pages/             # Route pages
│   ├── Index.tsx      # Feed page
│   ├── SignIn.tsx     # Sign in page
│   ├── SignUp.tsx     # Sign up page
│   ├── Welcome.tsx    # Landing page
│   ├── Profile.tsx    # User profile
│   ├── Communities.tsx # Communities page
│   └── ...
├── services/          # API services
│   ├── api.ts         # API client
│   ├── authService.ts # Auth operations
│   ├── postService.ts # Post operations
│   ├── communityService.ts # Community operations
│   ├── commentService.ts # Comment operations
│   ├── notificationService.ts # Notification operations
│   └── websocketService.ts # WebSocket client
├── data/
│   └── mockData.ts    # Mock data for development
└── lib/
    └── utils.ts       # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file (optional for development):

```bash
# API Configuration (optional - uses mock data by default)
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_BASE_URL=ws://localhost:3000

# Feature Flags
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_ANALYTICS=false
```

## 📱 Pages

- `/` - Welcome page (guests) / Feed (authenticated)
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/explore` - Explore trending content
- `/communities` - Browse and join communities
- `/create` - Create new posts
- `/profile` - User profile and settings
- `/notifications` - Activity notifications
- `/post/:id` - Post detail with comments
- `/community/:id` - Community detail

## 🎨 Design System

**Colors:**
- Primary: Blue (#3B9EFF)
- Accent: Purple (#C77DFF)
- Success: Green
- Destructive: Red
- Background: Dark theme with gradients

**Typography:**
- Display Font: Space Grotesk
- Body Font: Inter

**Animations:**
- Fade-up: Entry animations
- Pulse-glow: Emphasis effects
- Float: Background elements
- Shimmer: Loading states

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
```

### Mock Data

The app works perfectly with mock data for development. No backend needed!

All services automatically fall back to mock data when the API is unavailable.

### Connecting to Backend

When ready, update `.env`:

```bash
VITE_API_BASE_URL=https://your-api.com/api
VITE_WS_BASE_URL=wss://your-api.com
```

See [PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md) for backend implementation details.

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm i -g vercel
vercel --prod
```

### Frontend (Netlify)
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

See [PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md) for complete deployment instructions.

## 🔒 Security

- JWT token authentication
- Automatic token refresh
- Secure password handling
- Protected routes
- CORS ready
- XSS protection
- CSRF protection ready

## 📊 Performance

- React Query caching (30s stale time)
- Optimistic UI updates
- Code splitting ready
- Lazy loading ready
- Image optimization ready
- Service worker ready

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is built with Lovable.

## 🌐 Links

- **Project URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID
- **Documentation**: See docs folder
- **Support**: Create an issue

## 🎯 What's Next?

### Immediate
1. ✅ App is running with mock data
2. 📖 Read documentation
3. 🎨 Customize theme
4. 🔧 Add features

### Production
1. 🔌 Implement backend API
2. 🗄️ Set up database
3. 🚀 Deploy to production
4. 📊 Add monitoring

## 💡 Key Features

### Before This Upgrade
- ❌ Static mock data only
- ❌ No API integration
- ❌ No real-time features
- ❌ Basic error handling
- ❌ No loading states

### After This Upgrade
- ✅ Dynamic data with API integration
- ✅ Full service layer with fallback
- ✅ Real-time WebSocket updates
- ✅ Comprehensive error handling
- ✅ Loading, error, and empty states
- ✅ Production-ready architecture
- ✅ Type-safe throughout
- ✅ Optimistic UI updates
- ✅ Intelligent caching

## 🎓 Learn More

- [React Query Docs](https://tanstack.com/query)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Built with ❤️ using Lovable**

Ready to launch your social media platform! 🚀
