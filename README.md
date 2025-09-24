# WAY Esports - Complete Clone

Mini app for Telegram with professional esports functionality.

## 🚀 Quick Start

1. Clone and install dependencies:
```bash
git clone <repo_url>
cd way-esports
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start development server:
```bash
npm run dev
```

## 🎨 UI Enhancement Flag

The project includes `ENABLE_POLISHED_UI` functionality:

- **Original Mode** (`ENABLE_POLISHED_UI=false`): Exact 1:1 parity with original design
- **Polished Mode** (`ENABLE_POLISHED_UI=true`): Enhanced UI with improved animations, gradients, and interactions

Configure in `src/config/env.ts` or via environment variables.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (App, Auth, Notifications)
├── pages/             # Main application pages
│   ├── Home/          # Dashboard and live matches
│   ├── Teams/         # Team management and rankings
│   ├── Tournaments/   # Tournament system
│   ├── News/          # News and announcements
│   └── Profile/       # User profiles
├── styles/            # Theme and styling system
├── types/             # TypeScript definitions
├── config/            # Environment configuration
└── hooks/             # Custom React hooks
```

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Styled Components + Custom Theme System
- **Routing**: React Router v6
- **Icons**: React Feather
- **Platform**: Telegram Mini Apps

## 🎮 Features Implemented

### Core Pages
- ✅ **Home Dashboard** - Live matches, statistics, news feed
- ✅ **Teams System** - Team creation, member management, rankings
- ✅ **Tournaments** - Tournament listing, registration, brackets
- ✅ **News System** - Article creation, categorization, search
- ✅ **User Profiles** - Profile management and statistics

### Advanced Features
- ✅ **Notification System** - Toast notifications + browser notifications
- ✅ **Authentication** - Mock auth system with Telegram integration
- ✅ **Responsive Design** - Mobile-first design for Telegram WebApp
- ✅ **Theme System** - Professional ESL-style dark theme
- ✅ **State Management** - React Context + useReducer patterns

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 Environment Variables

See `.env.example` for all available configuration options.

## 📱 Telegram Integration

Fully integrated with Telegram WebApp API:
- Auto-initialization on app load
- User data extraction from Telegram
- Native Telegram UI integration

---

**Status**: ✅ Complete 1:1 functional parity with original + polished UI enhancements
