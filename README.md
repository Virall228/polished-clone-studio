# WAY Esports - Full Stack Esports Platform

Professional esports tournament platform with team management, internationalization, and subscription system.

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

✅ **Team Management**
- Create and manage teams
- Invite/remove members
- Team rankings and statistics
- Role-based permissions (Captain, Player)

✅ **Tournament System**
- Create and organize tournaments
- Multi-format support (Single/Double Elimination)
- **Team-based registration with mandatory Terms of Service acceptance**
- Tournament brackets and scheduling
- Prize pool management

✅ **Terms of Service (ToS)**
- Version-controlled ToS system
- Mandatory acceptance before tournament registration
- Tracks user consent (version, timestamp, user agent)
- Admin-configurable ToS versions

✅ **Internationalization (i18n)**
- **Automatic language detection** from browser
- **Manual language switching** (EN/RU)
- All interface text fully translated
- Persistent language preference

✅ **Subscription System**
- Free, Pro, and Premium tiers
- Feature-based access control
- Subscription management UI
- Stripe integration ready (or local model)

✅ **User Profiles & Authentication**
- Secure user registration and login
- Profile management
- Statistics and achievements
- Session persistence

✅ **News System**
- Create and publish articles
- Category-based organization
- View tracking
- Rich content support

✅ **Admin Panel**
- Manage teams, tournaments, and news
- User administration
- System configuration

### Technical Features

- **React 18** + TypeScript + Vite
- **Tailwind CSS** with shadcn/ui components
- **Supabase** for backend (Database, Auth, Edge Functions)
- **i18next** for internationalization
- **Dark mode** by default
- **Fully responsive** mobile-first design
- **Docker-ready** for instant deployment

---

## 📁 Project Structure

```
way-esports/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout/        # Header, Footer, Navigation
│   │   ├── ui/            # shadcn/ui components
│   │   ├── LanguageSwitcher.tsx
│   │   └── TournamentRegistration.tsx
│   ├── pages/             # Application pages
│   │   ├── Home/          # Dashboard
│   │   ├── Teams/         # Team management
│   │   ├── Tournaments/   # Tournament system
│   │   ├── News/          # News articles
│   │   ├── Profile/       # User profiles
│   │   ├── Subscription/  # Subscription management
│   │   ├── Admin/         # Admin panel
│   │   └── Auth/          # Authentication
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts     # Authentication hook
│   │   └── useSupabaseData.ts
│   ├── i18n/              # Internationalization
│   │   ├── config.ts      # i18n configuration
│   │   └── locales/       # Translation files (en.json, ru.json)
│   ├── integrations/      # External services
│   │   └── supabase/      # Supabase client & types
│   ├── types/             # TypeScript definitions
│   └── index.css          # Global styles
├── supabase/              # Supabase configuration
│   └── migrations/        # Database migrations
├── Dockerfile             # Docker configuration
├── docker-compose.prod.yml # Production deployment
├── DEPLOYMENT.md          # Detailed deployment guide
└── README.md             # This file
```

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions) |
| **i18n** | react-i18next, i18next-browser-languagedetector |
| **Deployment** | Docker, Docker Compose, PM2 |
| **Testing** | Vitest, React Testing Library |

---

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Supabase Configuration (Already configured)
VITE_SUPABASE_PROJECT_ID=kezbdbbeqocqtdxyhtqs
VITE_SUPABASE_URL=https://kezbdbbeqocqtdxyhtqs.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_key_here

# Terms of Service Version
VITE_TERMS_VERSION=1.0.0

# Environment
NODE_ENV=production
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | `kezbdbbeqocqtdxyhtqs` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public API key | `eyJhbG...` |
| `VITE_TERMS_VERSION` | Current ToS version | `1.0.0` |

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

# Setup environment
cp .env.example .env
# Edit .env with your values

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
npm run type-check   # TypeScript type checking
```

---

## 🐳 Production Deployment

### Option 1: Docker (Recommended)

**One-command deployment:**

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

**Manage deployment:**

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop services
docker compose -f docker-compose.prod.yml down

# Restart services
docker compose -f docker-compose.prod.yml restart
```

### Option 2: PM2 (Without Docker)

```bash
# Install dependencies
npm ci --omit=dev

# Build application
npm run build

# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name "way-esports" -- run preview

# View logs
pm2 logs way-esports

# Setup auto-start
pm2 startup
pm2 save
```

### Option 3: Manual Deployment

```bash
# Build
npm ci --omit=dev
npm run build

# Serve static files
npx serve -s dist -l 3000
```

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide**

---

## 🧪 Testing Critical Features

### 1. Team Creation & Registration Flow

```
✓ User signs up/logs in
✓ Creates a team with name and tag
✓ Team appears in teams list
✓ User can join/leave teams
```

### 2. Tournament Registration with ToS

```
✓ User has a team
✓ Opens tournament registration
✓ Selects team from dropdown
✓ Checks "I agree to Terms of Service" checkbox
✓ Cannot submit without checking ToS
✓ Registration succeeds with team and ToS version saved
```

### 3. Language Switching

```
✓ App detects browser language automatically
✓ User clicks language switcher (EN/RU)
✓ All interface text updates
✓ Language preference persists in localStorage
✓ Reload maintains language selection
```

### 4. Subscription Management

```
✓ User views current subscription plan
✓ Selects different plan tier
✓ Plan upgrade/downgrade works
✓ Subscription status displays correctly
✓ Feature access controlled by plan
```

---

## 📊 Database Schema

### Key Tables

**teams**
- id, name, tag, captain_id, game_id, logo_url, description
- Relations: team_members, team_stats

**tournaments**
- id, name, description, game_id, organizer_id, prize_pool
- status: upcoming, registration_open, ongoing, completed
- Relations: tournament_participants, matches

**tournament_participants**
- id, tournament_id, team_id, user_id
- **terms_agreed**: boolean (required for registration)
- **terms_version**: text (ToS version accepted)
- **terms_agreed_at**: timestamp

**terms_agreements**
- id, user_id, terms_version, agreed_at
- ip_address, user_agent
- Tracks all ToS acceptances

**subscriptions**
- id, user_id, plan_type (free/pro/premium)
- status: active, canceled, past_due, trialing
- stripe_subscription_id, current_period_start/end

**profiles**
- id, user_id, username, avatar_url
- first_name, last_name, role

---

## 🌐 Internationalization

### Supported Languages

- **English (en)** - Default
- **Russian (ru)**

### Adding New Languages

1. Create translation file: `src/i18n/locales/[lang].json`
2. Copy structure from `en.json`
3. Translate all keys
4. Import in `src/i18n/config.ts`:

```typescript
import newLang from './locales/newLang.json';

i18n.init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    newLang: { translation: newLang }, // Add here
  },
  // ...
});
```

### Using Translations in Code

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
- ✅ **Terms of Service** mandatory acceptance with audit trail
- ✅ **Secure authentication** with Supabase Auth
- ✅ **Protected routes** for authenticated users
- ✅ **Input validation** on forms
- ✅ **Environment variable** protection

---

## 📝 Terms of Service System

### How It Works

1. **Version Control**
   - ToS version stored in `VITE_TERMS_VERSION` env variable
   - Each version tracked separately in database

2. **Mandatory Acceptance**
   - Tournament registration requires ToS checkbox
   - Cannot proceed without acceptance
   - Prevents accidental registration

3. **Audit Trail**
   - Every acceptance recorded in `terms_agreements` table
   - Tracks: user_id, version, timestamp, user_agent
   - Complies with legal requirements

4. **Implementation**
   ```typescript
   // Tournament registration checks ToS
   const { terms_agreed, terms_version, terms_agreed_at } = formData;
   
   if (!terms_agreed) {
     throw new Error('Must agree to Terms of Service');
   }
   
   // Record in terms_agreements table
   await supabase.from('terms_agreements').insert({
     user_id,
     terms_version: VITE_TERMS_VERSION,
     agreed_at: new Date()
   });
   ```

### Updating Terms

1. Update `VITE_TERMS_VERSION` in `.env`
2. Users must re-accept for new registrations
3. Old acceptances remain valid for their version

---

## 🎯 Roadmap

- [ ] Real-time match updates
- [ ] Live tournament brackets
- [ ] In-app notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Stream integration (Twitch, YouTube)
- [ ] More payment providers
- [ ] Additional languages (ES, DE, FR)

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 🆘 Support

- **Documentation:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues:** Open an issue on GitHub
- **Email:** support@way-esports.com

---

## ✅ Deployment Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Supabase tables created
- [ ] RLS policies enabled
- [ ] Terms of Service version set
- [ ] Language files complete
- [ ] Docker build successful
- [ ] Health checks passing
- [ ] SSL certificate configured
- [ ] Domain DNS configured
- [ ] Backup strategy in place

---

**Built with ❤️ for the esports community**

WAY Esports - Where champions are made
