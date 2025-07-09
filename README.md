# PROMPTTT - AI VideoHub

> The definitive gallery for AI-generated video art

## 🎯 Project Overview

PROMPTTT is a curated gallery and community platform for AI-generated video art, designed to be the "Dribbble for AI Videos." Our core differentiator is the "Creative DNA" - structured display of prompts, models, seeds, and metadata that reveals the source code of AI art.

## 🚀 Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Animation:** Framer Motion
- **UI Components:** shadcn/ui
- **Backend:** Supabase (PostgreSQL)
- **Storage:** Cloudflare R2
- **Deployment:** Vercel

## 🏗️ Development Setup

### Prerequisites

- Node.js 20.0.0 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # Base UI components
│   └── layout/         # Layout components
├── lib/                # Utility libraries
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── styles/             # Global styles
└── constants/          # Application constants
```

## 🎨 Design System

### Colors
- **Primary Background:** `#1A1D21` (Dark Slate Gray)
- **Secondary Surfaces:** `#2A2F35` (Lighter Slate)
- **Accent Color:** `#00A9FF` (Electric Blue)
- **Text:** `#F5F5F5`, `#B0B8C4`, `#737D8C`

### Typography
- **Headings:** Satoshi (Modern sans-serif)
- **Body Text:** Inter (Highly legible)
- **Code/Prompts:** JetBrains Mono (Clean monospace)

## 🗺️ Development Roadmap

This project follows a **30-milestone development strategy** focused on world-class quality with **dark/light modes** and **mobile-first responsive design**:

### Phase 1: Foundation Excellence (Milestones 1-6)
- ✅ **Milestone 1:** Project Architecture & Core Setup
- ✅ **Milestone 2:** Design System Core - Dark Mode
- 🔄 **Milestone 3:** Light Mode & Theme System
- ⏳ **Milestone 4:** Mobile-First Responsive Foundation
- ⏳ **Milestone 5:** Component Library Foundation
- ⏳ **Milestone 6:** Advanced Components & Patterns

### Key Enhancements Added
- **🌓 Dark/Light Mode Support:** Complete dual-theme system with smooth transitions
- **📱 Mobile-First Design:** 320px+ support with touch-friendly interactions
- **🎨 Responsive Everything:** Every component works perfectly on any screen size

[View complete 30-milestone roadmap in Roadmap-Enhanced.md](./Roadmap-Enhanced.md)

## 🔧 Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=prompttt-videos
R2_PUBLIC_URL=https://your-custom-domain.com
```

---

**Status:** 🏗️ Milestone 2 Complete - Enhanced Strategy with Dark/Light Modes & Mobile-First Design