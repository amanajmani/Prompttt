# PROMPTTT

> The definitive platform for AI-generated video art

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Overview

PROMPTTT is a curated gallery and community platform for AI-generated video art, designed to showcase the intersection of artificial intelligence and creative expression. Our platform provides creators with a professional space to display their work while offering viewers insight into the creative process through detailed metadata and prompts.

## Key Features

- **Curated Gallery**: High-quality AI-generated video content with professional presentation
- **Creative DNA**: Detailed metadata including prompts, models, seeds, and generation parameters
- **Creator Profiles**: Professional portfolios for AI video artists
- **Community Features**: Engagement tools including likes, comments, and collections
- **Responsive Design**: Optimized experience across all devices
- **Dark/Light Themes**: Adaptive interface with system preference detection

## Technology Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Storage**: Cloudflare R2 for video and image assets
- **Authentication**: OAuth integration (Google, GitHub)
- **Deployment**: Vercel with edge optimization

## Quick Start

### Prerequisites

- Node.js 20.0.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prompttt.git
cd prompttt

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Configuration

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudflare R2 Storage
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=prompttt-videos
R2_IMAGES_BUCKET_NAME=prompttt-images
```

## Development

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

### Project Structure

```
src/
├── app/                 # Next.js App Router pages and layouts
├── components/          # Reusable React components
│   ├── ui/             # Base UI components
│   └── layout/         # Layout-specific components
├── lib/                # Utility libraries and configurations
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── styles/             # Global styles and design tokens
└── constants/          # Application constants
```

## Design System

Our design system emphasizes sophisticated minimalism with cinematic focus, ensuring the content remains the primary focus while maintaining professional aesthetics.

### Typography

- **Headings**: Satoshi (Modern sans-serif)
- **Body Text**: Inter (Optimized for readability)
- **Code/Prompts**: JetBrains Mono (Clean monospace)

### Color Palette

**Dark Theme**
- Primary Background: `#1A1D21`
- Secondary Surface: `#2A2F35`
- Accent: `#00A9FF`

**Light Theme**
- Primary Background: `#FFFFFF`
- Secondary Surface: `#F8F9FA`
- Accent: `#0066CC`

## Contributing

We welcome contributions from the community. Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Performance

- **Core Web Vitals**: Optimized for excellent performance scores
- **Image Optimization**: Next.js Image component with Cloudflare R2 CDN
- **Code Splitting**: Automatic route-based code splitting
- **Edge Runtime**: Deployed on Vercel Edge Network

## Security

- **Authentication**: Secure OAuth implementation
- **Data Protection**: End-to-end encryption for sensitive data
- **Content Moderation**: Automated and manual content review processes
- **Privacy**: GDPR and CCPA compliant data handling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@prompttt.com or join our [Discord community](https://discord.gg/prompttt).

---

**Built with ❤️ for the AI creative community**