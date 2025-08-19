# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kids Drawing App - A mobile-first browser native drawing app with AI-generated stencils and local storage for kids' artwork, eventually migrating to cloud storage.

## Tech Stack & Architecture

**Core Technologies:**
- Frontend: React 18 + TypeScript
- Build: Vite  
- Styling: Tailwind CSS
- Hosting: GitHub Pages
- Storage: localStorage (Phases 1-3) → Firebase (Phase 5+)
- AI: OpenAI API for stencil generation
- PWA: Workbox for offline support
- CI/CD: GitHub Actions

**Key Architectural Decisions:**
- Mobile-first design with touch/stylus drawing
- Offline-first storage strategy (localStorage as primary, cloud as backup)
- Progressive enhancement from basic drawing to AI-powered stencils
- Phase-based implementation from MVP to full PWA

## Development Commands

**Based on the planned package.json scripts:**

```bash
# Development
npm run dev              # Start Vite dev server
npm run build           # TypeScript compile + Vite build
npm run preview         # Preview production build

# Testing & Quality
npm run test            # Run Vitest tests
npm run test:touch      # Run mobile touch event tests
npm run lint            # ESLint with TypeScript
npm run type-check      # TypeScript type checking (no emit)

# Performance
npm run lighthouse:mobile  # Mobile-first Lighthouse audit
```

## Code Architecture

**Component Structure (Planned):**
```
src/
├── components/
│   ├── Canvas/          # DrawingCanvas, TouchHandler, CanvasUtils
│   ├── Tools/           # ColorPicker, BrushControls, ToolPanel  
│   ├── Stencils/        # StencilLibrary, AIStencilGenerator
│   ├── Gallery/         # DrawingGallery, StorageManager
│   └── UI/              # Header, Modal, LoadingSpinner
├── hooks/               # useCanvas, useDrawing, useLocalStorage, useTouch
├── services/            # StorageService, FirebaseService, AIService
├── utils/               # CanvasUtils, ImageUtils, TouchUtils
└── types/               # Drawing, Stencil, Storage interfaces
```

**Storage Strategy Evolution:**
- **Phase 1-3:** Pure localStorage for drawings, stencils, preferences  
- **Phase 4:** Add AI-generated stencil caching
- **Phase 5:** Hybrid localStorage + Firebase with conflict resolution
- **Phase 6:** Full PWA with background sync via Service Worker

**Key Interfaces:**
```typescript
interface SavedDrawing {
  id: string;
  name: string; 
  dataURL: string;
  createdAt: string;
  thumbnail: string;
}

interface StencilData {
  id: string;
  name: string;
  category: string;
  svgData: string;
  isFavorite: boolean;
}
```

## Development Guidelines

**Mobile-First Approach:**
- All drawing interactions must work with touch/stylus
- Prevent page scrolling during drawing
- Large touch targets for kid-friendly UI
- Canvas scaling for different screen sizes
- Touch event testing is critical

**Performance Requirements:**
- Lighthouse mobile score >90
- App loads under 3 seconds on 3G
- Touch drawing latency under 50ms
- Bundle size <500KB initial load
- Works offline after first visit

**Storage Management:**
- Maximum 50 drawings in localStorage
- Auto-cleanup of old drawings by creation date
- Generate thumbnails for gallery performance
- Favorite stencils persistence

**Quality Standards:**
- TypeScript strict mode
- ESLint + Prettier code quality
- WCAG AA accessibility compliance  
- Cross-browser testing (iOS Safari, Android Chrome)
- Unit tests for drawing logic
- E2E touch event testing

## CI/CD Pipeline

**Automated Checks:**
- Linting and type checking
- Unit tests and mobile-specific touch tests
- Lighthouse mobile performance audit
- Build verification
- Automatic deployment to GitHub Pages on main branch

**Branch Strategy:**
- `main`: Production deployments only
- `develop`: Integration branch
- `feature/*`: Individual features
- `hotfix/*`: Critical fixes

## Phase-Based Development

**Current Status:** Pre-implementation (specifications complete)

**Phase 1 (MVP):** Basic drawing + CI/CD pipeline
**Phase 2:** Enhanced tools + local gallery  
**Phase 3:** Pre-made stencil system
**Phase 4:** AI stencil generation with security
**Phase 5:** Firebase cloud sync
**Phase 6:** Full PWA with background sync

## Environment Setup

**GitHub Pages Deployment:**
1. Enable GitHub Actions in repository settings
2. Configure Pages source to "GitHub Actions"  
3. Push to main branch triggers automatic deployment

**API Keys (Phase 4+):**
- Store OpenAI API key in GitHub Secrets as `OPENAI_API_KEY`
- Used in build process via environment variable `VITE_OPENAI_API_KEY`

## Special Considerations

**Kid-Friendly Design:**
- Simple, intuitive interface for ages 4+
- Large buttons and clear visual feedback
- Content filtering for AI-generated stencils
- Onboarding tutorial for independent use

**Security:**
- Never commit API keys to repository
- Use serverless functions for AI API calls
- Rate limiting and cost controls for AI generation
- Content filtering for appropriate imagery