# ANVA Platform — Complete Architecture & Feature Walkthrough

## 1. Executive Summary

**ANVA** is an all-in-one Career, Placement Preparation, and Collaborative Learning ecosystem. It equips students and job seekers with targeted company-specific hiring assessments, universal master technical practice decks, sandboxed multi-language coding environments, and social learning networks.

---

## 2. Core Modules & Feature Breakdown

### 🏢 1. Placement Hub (`/placement`)
A comprehensive placement readiness suite designed for both campus and off-campus recruitment:

- **Company-Specific Hiring Portals**:
  - Filter by Tier: *FAANG / Top Product*, *Product Giants*, *Fintech & Banking*, *IT & Consulting Leaders*.
  - Company-specific test patterns, syllabus weightage, and past hiring round breakdowns.
  - 1-click launch for company practice decks and mock tests.

- **Universal Master Practice Libraries**:
  - **Master Aptitude & Quant** (`/placement/all/aptitude`): Time & Work, Permutations, Probability, Syllogisms, Number Series, Cryptarithmetic, and Speed Math.
  - **Master Coding Practice** (`/placement/all/coding`): Algorithmic challenges across Arrays, Two Pointers, Sliding Window, Monotonic Stacks, DP, Trees, and Graphs.
  - **Master Core CS Technical** (`/placement/all/technical`): Deep Operating Systems, B+ Tree DBMS indexing, Computer Networks, and OOP MCQs with step-by-step reasoning.
  - **Master Verbal & English** (`/placement/all/english`): Reading Comprehension, Sentence Correction, Para Jumbles, Idioms, and Critical Reasoning.
  - **Master Interview Prep** (`/placement/all/interview`): STAR Behavioral framework, System Design masterclasses, and Resume defense strategies.

- **Company Mock Test Simulator** (`/placement/:companyId/mock-test`):
  - Timed examination interface simulating actual online assessment (OA) environments.
  - Real-time timer, question navigation grid, flag for review, and instant scorecard analytics.

- **Real-Time Progress & Analytics Telemetry**:
  - Dynamic question counts and category counters powered directly by MongoDB aggregation.
  - Solved vs. Attempted ratio, Easy/Medium/Hard difficulty breakdown, and accuracy metrics.

---

### 💻 2. Interactive Learning Studio

- **Code Compiler** (`/compiler`):
  - In-browser code editor supporting C, C++, Java, Python, and JavaScript.
  - Custom input standard input (stdin), execution console, and error highlighting.

- **Flashcards Studio** (`/flashcards`):
  - Create, organize, and flip revision flashcard decks.
  - Active recall system for quick retention of key algorithms, definitions, and formulas.

- **AI Assistant** (`/assistant`):
  - Academic AI tutor powered by intelligent prompts to explain code snippets, debug errors, and provide step-by-step logic derivations.

---

### 🌐 3. Social Learning & Community Network

- **Community Feed** (`/feed`):
  - Post updates, attach code snippets and images, engage with peers via comments, likes, and shares.
- **Peers & Network** (`/friends`):
  - Discover fellow aspirants, send connection requests, and build collaborative study circles.
- **Real-Time Chat** (`/chat`):
  - Direct messaging and group discussions.
- **Audio / Video Calling** (`/call/:id`):
  - Peer-to-peer audio and video calling popup window for mock interviews and study sessions.

---

### 🛡️ 4. Administration & Platform Security

- **Admin Portal** (`/admin`):
  - Role-based administration dashboard (`protectAdminRoute`).
  - Question management, user moderation, analytics, and platform content control.
- **Security & Rate Limiting**:
  - Global API rate limiter (`globalLimiter`) and strict authentication protection (`authLimiter`).
  - Clerk + JWT dual-layer authentication with secure cookie handling.
- **Personalization & Accessibility**:
  - 32-theme DaisyUI switcher with real-time DOM persistence.
  - Custom glassmorphic toast notification system.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, TailwindCSS, DaisyUI, TanStack Query (React Query), Framer Motion, Lucide Icons, Clerk React |
| **Backend** | Node.js, Express.js (ES Modules), Mongoose, MongoDB Atlas, Cookie Parser, CORS, Express Rate Limit |
| **Realtime & Media** | Stream Chat, WebRTC Calling, Cloudinary |
| **Build & Tooling** | Vite v6, PostCSS, ESLint |

---

## 4. Verification & Health Check

- **Frontend Production Build**: `vite build` completed cleanly with **0 errors (Exit code 0)**.
- **Backend Syntax & Routes**: `node --check src/server.js` verified with **0 syntax or import errors**.
- **Database & Services**: MongoDB Atlas connected and authenticated with live placement collections.
