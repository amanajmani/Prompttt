# Project Blueprint: PROMPTTT

- **Document Version:** 1.0
- **Date:** July 8, 2025
- **Status:** Final, Confidential

## Section 1: Executive Summary & Vision

### 1.1 Project Name

Internal Codename: **AI VideoHub**

### 1.2 Mission Statement

To build the definitive, curated gallery and community for the world's best AI-generated video art, celebrating both the final product and the creative process behind it.

### 1.3 The Core Problem

The field of generative AI video is exploding. Every day, thousands of creators are pushing the boundaries of art, storytelling, and technology. However, their work is scattered across platforms not built for them—YouTube, X, Instagram, and TikTok. These platforms are noisy, lack the essential metadata (prompt, model, seed), and fail to provide a focused environment for this new art form. There is no prestigious, dedicated home for the serious AI video artist.

### 1.4 Our Solution: The "Dribbble for AI Videos"

AI VideoHub will be a focused, premium, community-driven platform designed from the ground up for the AI video creator. It is not just a place to watch videos; it is a place to understand how they are made. Our core differentiator is the "Creative DNA"—the structured display of the prompt, model, and other metadata that is the source code of AI art. We will provide a beautiful, minimalist environment that honors the work and fosters a community of learning, inspiration, and professional opportunity.

### 1.5 Strategic Approach

We will execute a "Submarine Strategy." Development will occur in stealth mode to prevent premature exposure and idea dilution. The MVP will be built with extreme velocity over a one-month period, followed by a high-impact, coordinated launch targeting key online communities. Our focus is not on being first to have the idea, but on being first to market with a superior, perfectly executed product.

## Section 2: Target Audience

### Primary Audience: The Creators

- **Who they are:** AI Artists, Motion Designers, Prompt Engineers, VFX specialists, and creative technologists who are early adopters and power users of generative video models (Sora, Runway, Pika, etc.).
- **Their Needs:** A professional portfolio to showcase their work, recognition for their technical and artistic skill, a community of like-minded peers, and a way to deconstruct and learn from the work of others.

### Secondary Audience: The Enthusiasts & Professionals

- **Who they are:** Tech professionals, creative directors, recruiters, AI researchers, and general enthusiasts fascinated by the potential of generative AI.
- **Their Needs:** A curated place to discover the best AI-generated content, a way to understand emerging visual trends, and a talent pool to find and hire elite AI video creators.

## Section 3: Design Philosophy & Style Guide (Updated)

This is the soul of the application. The design must be world-class to attract world-class creators.

### 3.1 Core Philosophy: "Sophisticated Minimalism meets Cinematic Focus"

- **Sophisticated Minimalism:** The design is clean, professional, and functional. We use a refined, modern aesthetic that feels premium and intentional, without unnecessary decoration.
- **Cinematic Focus:** The UI is a supporting actor. When viewing a video, the interface fades into the background, creating an immersive, focused experience like a dark cinema.

### 3.2 Color Palette (Modern Slate)

- **Primary Background:** `#1A1D21` (Dark Slate Gray)
- **Secondary Surfaces:** `#2A2F35` (Lighter Slate for cards, modals)
- **Accent Color:** `#00A9FF` (Electric Blue for buttons, links, active states)
- **Text Palette:** `#F5F5F5` (High-emphasis), `#B0B8C4` (Medium-emphasis), `#737D8C` (Low-emphasis)
- **Borders & Dividers:** `#3A414A`

### 3.3 Typography & Scale

- **Headings/UI Font:** Satoshi (Modern, architectural sans-serif from Fontshare)
- **Body Text Font:** Inter (Highly legible UI font from Google Fonts)
- **Prompt Font:** JetBrains Mono (Clean, readable monospace font from Google Fonts)
- **Typographic Scale (Uniformity):**
  - **H1 (Video Title):** text-3xl (36px), font-bold
  - **H2 (Section Headers):** text-xl (20px), font-bold
  - **Body / Descriptions:** text-base (16px), font-normal
  - **UI Controls / Labels:** text-sm (14px), font-medium
  - **Helper Text / Timestamps:** text-xs (12px), font-normal

### 3.4 Motion & Transitions (The "Framer" Feel)

- **Library:** Framer Motion will be used for all UI animations.
- **Philosophy:** All animations will be fast (150-250ms), purposeful (communicating change or providing feedback), and interruptible.
- **Examples:** Subtle fade-and-slide-up page transitions; gentle scale-up on modals; staggered fade-in for grid items.

### 3.5 Layout & Iconography

- **Layout:** A strict 8px grid system for all spacing and padding.
- **Corner Radius:** A consistent 8px corner radius for all elements (cards, buttons, inputs).
- **Iconography:** Lucide Icons for their clean, lightweight, and consistent line-art style.

## Section 4: Core MVP Feature Set (The "What")

The MVP is defined by six core pages, each with a specific, detailed function.

### 4.1 Homepage (`/`): The Main Gallery

- A responsive, 3 or 4-column grid of video thumbnails.
- Thumbnails auto-play a short, muted loop on hover with a gentle cross-fade transition.
- Minimal UI: Only the video title and creator's username appear on hover.

### 4.2 Video Detail Page (`/v/[video_id]`): The Heart of the Platform

- A large, central, high-quality video player.
- **Creator Attribution Block:** Creator's avatar and username.
- **The "Creative DNA" Block:** A distinct section displaying Prompt, Model, Seed, and Tags, with a one-click "Copy Prompt" button.
- **Engagement Block:** "Like" button with a public counter and a total view counter.
- **Comments Section:** Simple, chronological comment thread.

### 4.3 Upload Page (`/upload`): The Creator's Gateway

- A clean, single-purpose page with a large drag-and-drop file uploader and progress bar.
- A simple form for Title, Prompt, Model (dropdown), Seed (optional), and Tags.
- A thumbnail selector allowing the creator to pick the best frame.

### 4.4 Creator Profile Page (`/[username]`): The Portfolio

- A professional header with user avatar, username, bio, and external links.
- A tabbed interface with a grid of the user's "Work" and "Likes."

### 4.5 Authentication Pages (`/login`, `/signup`): The Doorway

- Minimalist forms with a primary focus on frictionless social logins (Google, GitHub).

### 4.6 Settings Page (`/settings`): User Control

- Basic functionality for users to update their profile and manage their account.

## Section 5: The Architecture & Tech Stack (The "How")

The stack is chosen for solo-founder velocity, zero initial cost, and massive scalability.

- **Frontend Framework:** Next.js 14+ (App Router)
- **Animation Library:** Framer Motion
- **UI & Styling:** Tailwind CSS + shadcn/ui
- **Backend & Database:** Supabase leveraging PostgreSQL.
- **Video Storage & Serving:** Cloudflare R2 (via client-side pre-signed URL uploads).
- **Deployment:** Vercel.

## Section 6: Check the Roadmap.md
