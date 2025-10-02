# WAY Esports Platform

A comprehensive esports tournament management platform with team management, user profiles, achievements, and subscription system.

## 🚀 Quick Start

```bash
# Development
npm install
npm run dev

# Production Deployment (One Command!)
docker compose -f docker-compose.prod.yml up -d --build
```

**Visit:** `http://localhost:3000`

---

## ✨ Features

### Core Functionality

✅ **Multi-language Support** (English & Russian)
- Automatic language detection from browser
- Manual language switcher
- Persistent language preference

✅ **User Authentication**
- 30-day session persistence ("Remember Me")
- Secure registration and login
- Email confirmation

✅ **Team Management**
- Create teams with unique names and tags
- Invite players via shareable links
- Team size validation for tournaments
- Leave/join teams

✅ **Tournament Registration**
- Team-based registration with size validation (2v2, 5v5, etc.)
- Mandatory Terms of Service acceptance
- Tournament invite system
- Multiple tournament formats

✅ **User Profiles**
- Avatar upload (5MB max, JPEG/PNG/WEBP/GIF)
- Statistics tracking (games, wins, losses, points)
- Achievement showcase
- Subscription status display
- Team membership history

✅ **Subscription System**
- Free, Pro, and Premium plans
- Feature-based access control
- Subscription management UI
- Status tracking

✅ **Admin Panel** (vb917185@gmail.com only)
- Create tournaments and news
- Manage content
- 403 Forbidden for non-admins

✅ **News System**
- Create and publish articles
- Category-based organization
- View tracking

### User Roles & Permissions

- **Admin** (`vb917185@gmail.com`) - Full access to admin panel, can create tournaments and news
- **Regular Users** - Can create and join teams, register for tournaments
- **Role-based UI** - Admin features hidden from non-admin users

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **i18n** | react-i18next |
| **Deployment** | Docker, Docker Compose, PM2 |

---

## 📁 Project Structure

```
way-esports/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout/        # Header, ProtectedRoute
│   │   ├── ui/            # shadcn/ui components
│   │   ├── LanguageSwitcher.tsx
│   │   ├── AvatarUpload.tsx
│   │   └── TournamentRegistration.tsx
│   ├── pages/             # Application pages
│   │   ├── Home/
│   │   ├── Teams/
│   │   │   ├── TeamsPage.tsx
│   │   │   ├── MyTeamsPage.tsx
│   │   │   └── JoinTeamPage.tsx
│   │   ├── Tournaments/
│   │   ├── News/
│   │   ├── Profile/
│   │   ├── Subscription/
│   │   ├── Admin/
│   │   └── Auth/
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTeams.ts
│   │   └── useSupabaseData.ts
│   ├── i18n/              # Internationalization
│   │   ├── config.ts
│   │   └── locales/       # en.json, ru.json
│   └── integrations/
│       └── supabase/      # Supabase client & types
├── supabase/
│   ├── config.toml
│   └── migrations/
├── Dockerfile
├── docker-compose.prod.yml
├── DEPLOYMENT.md
└── README.md
```

---

## 🔧 Environment Variables

### Frontend (`frontend.env`)

```bash
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=kezbdbbeqocqtdxyhtqs
VITE_SUPABASE_URL=https://kezbdbbeqocqtdxyhtqs.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your_key>

# Terms of Service
VITE_TERMS_VERSION=1.0.0

# Application
NODE_ENV=production
```

---

## 🚀 Development

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account (already configured)

### Setup

```bash
# Clone repository
git clone <repo_url>
cd way-esports

# Install dependencies
npm install

# Start development server
npm run dev
```

**Development server:** `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🐳 Production Deployment

### Option 1: Docker (Recommended)

```bash
# One-command deployment
docker compose -f docker-compose.prod.yml up -d --build

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop services
docker compose -f docker-compose.prod.yml down
```

### Option 2: PM2 (Without Docker)

```bash
# Build application
npm ci --omit=dev
npm run build

# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name "way-esports" -- run preview

# View logs
pm2 logs way-esports
```

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide**

---

## 📊 Database Schema

### Key Tables

**user_roles**
- Role-based access control (admin, moderator, user)
- Security definer functions for role checking

**profiles**
- User profile information
- Avatar URL, username, first/last name
- Online status, join date

**teams**
- Team information (name, tag, logo, description)
- Captain and game associations

**team_members**
- Team membership records
- Roles: captain, player

**team_invites**
- Invitation tokens for joining teams
- Expiration and usage tracking

**tournaments**
- Tournament details (name, description, format)
- Team size requirements
- Prize pool, max participants

**tournament_participants**
- Registration records
- Terms agreement tracking

**tournament_invites**
- Tournament invitation tokens

**user_stats**
- Player statistics (games, wins, losses)
- Win rate, points, rank

**achievements**
- Achievement definitions
- Rarity levels

**user_achievements**
- User achievement records

**subscriptions**
- Subscription plans (free, pro, premium)
- Status tracking (active, canceled, past_due)

**terms_agreements**
- Terms of Service acceptance records
- Version tracking

### Storage Buckets

**avatars**
- User profile pictures
- 5MB max, public access
- Supported: JPEG, PNG, WEBP, GIF

---

## 🧪 Testing Checklist

### Authentication
- [ ] User can sign up and receive confirmation email
- [ ] User stays logged in for 30+ days
- [ ] User can sign in and sign out

### Teams
- [ ] User can create a team
- [ ] Captain can generate invite link
- [ ] User can join team via invite link
- [ ] User can leave team
- [ ] Team member count displays correctly

### Tournaments
- [ ] User can view tournaments
- [ ] Team size validation works (e.g., 2v2 requires exactly 2 players)
- [ ] Terms of Service checkbox is required
- [ ] Registration succeeds with valid team
- [ ] Error shown for invalid team size

### i18n
- [ ] Language auto-detects on first visit
- [ ] Language switcher works
- [ ] All UI text translates correctly
- [ ] Language preference persists

### Profiles
- [ ] User can upload avatar
- [ ] Avatar persists until replaced
- [ ] Statistics display correctly
- [ ] Achievements display correctly
- [ ] Subscription status shows (if applicable)
- [ ] Public profiles viewable

### Admin
- [ ] Admin can access `/admin` panel
- [ ] Regular users see 403 on `/admin`
- [ ] Admin can create tournaments
- [ ] Admin can create news
- [ ] Non-admins don't see admin buttons in navigation

---

## 🌐 Internationalization

### Supported Languages

- **English (en)** - Default
- **Russian (ru)**

### Adding New Languages

1. Create translation file: `src/i18n/locales/[lang].json`
2. Copy structure from `en.json`
3. Translate all keys
4. Import in `src/i18n/config.ts`

### Using Translations

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('tournaments.register')}</p>
    </div>
  );
}
```

---

## 🔐 Security Features

- ✅ **Row Level Security (RLS)** on all Supabase tables
- ✅ **Role-based access control** with security definer functions
- ✅ **Terms of Service** mandatory acceptance with audit trail
- ✅ **Secure authentication** with 30-day sessions
- ✅ **Protected routes** for authenticated users
- ✅ **Admin-only routes** with 403 error handling
- ✅ **Secure file uploads** with type and size validation
- ✅ **Password strength** requirements

---

## 📝 Admin Access

Only the user with email **`vb917185@gmail.com`** has admin privileges.

Admin users can:
- Access `/admin` panel
- Create tournaments
- Create news articles
- See "Admin" link in navigation
- Manage content

Non-admin users:
- Do not see "Admin" in navigation
- Receive 403 Forbidden when accessing `/admin`
- Cannot see "Create Tournament" or "Create News" buttons

Admin privileges are enforced through:
- Database-level user_roles table
- Security definer functions
- Frontend role checking
- Protected routes with role validation

---

## 📄 License

MIT

---

## 🆘 Support

- **Documentation:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **React Docs:** [react.dev](https://react.dev)

---

## ✅ Deployment Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Supabase migrations run successfully
- [ ] RLS policies enabled and tested
- [ ] Admin user role assigned to vb917185@gmail.com
- [ ] Terms of Service version set
- [ ] Language files complete
- [ ] Docker build successful
- [ ] Health checks passing
- [ ] SSL certificate configured
- [ ] Domain DNS configured
- [ ] Backup strategy in place

---

**Built for the esports community** 🎮
