# 🎨 Kids Drawing App

A mobile-first browser native drawing app designed specifically for children, featuring touch-optimized drawing, AI-generated stencils, and secure local storage.

## 🌟 Project Goals

- **Kid-Friendly Design**: Large touch targets, colorful interface, and intuitive navigation suitable for ages 4+
- **Mobile-First**: Optimized for tablets and smartphones with responsive design
- **Creative Tools**: Touch drawing, color palettes, brush controls, and AI-powered stencil generation
- **Safe Storage**: Local-first approach with eventual cloud backup for artwork preservation  
- **Offline-First**: Works without internet connection via Progressive Web App (PWA) technology
- **Performance**: Fast loading (<3s on 3G) and smooth drawing interactions (<50ms latency)

## 📱 Features

### 🚀 **Currently Available**
- ✅ Welcome page with project overview
- ✅ Mobile-responsive design with kid-friendly UI
- ✅ Automated CI/CD deployment pipeline
- ✅ Performance optimized build system

### 🔄 **In Development (Phase 1)**  
- 🔨 Touch-enabled canvas drawing
- 🔨 Color picker with kid-friendly palette
- 🔨 Basic brush size controls
- 🔨 Local storage for saving drawings

### 🎯 **Planned Features**
- **Phase 2**: Enhanced drawing tools (undo/redo, multiple brushes, eraser)
- **Phase 3**: Pre-made stencil library with categories
- **Phase 4**: AI-generated stencils via OpenAI API
- **Phase 5**: Cloud storage with Firebase integration
- **Phase 6**: Full PWA with offline capabilities and app installation

## 🏗️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5.2
- **Styling**: Tailwind CSS with custom kid-friendly design system
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + TypeScript strict mode
- **Deployment**: GitHub Actions → GitHub Pages
- **Future**: Firebase (cloud storage), OpenAI API (AI stencils), Workbox (PWA)

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yuripats/kids-drawing-app.git
   cd kids-drawing-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will open at `http://localhost:3000`

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run preview      # Preview production build locally

# Building
npm run build        # Build for production
npm run type-check   # Run TypeScript type checking

# Testing & Quality
npm run test         # Run tests with Vitest
npm run test:touch   # Run mobile touch-specific tests
npm run lint         # Run ESLint code quality checks

# Performance
npm run lighthouse:mobile  # Run Lighthouse mobile audit
```

## 🧪 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/canvas-drawing
   ```

2. **Make your changes and test**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   npm run build
   ```

3. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: implement canvas drawing functionality"
   git push origin feature/canvas-drawing
   ```

4. **Create Pull Request**
   - GitHub Actions will automatically run CI tests
   - Merge to `main` triggers automatic deployment

## 🏗️ Project Structure

```
kids-drawing-app/
├── .github/workflows/     # CI/CD pipeline definitions
├── public/               # Static assets
├── src/
│   ├── components/       # React components (planned structure)
│   │   ├── Canvas/       # Drawing canvas components
│   │   ├── Tools/        # Drawing tools (colors, brushes)
│   │   ├── Gallery/      # Saved drawings management
│   │   └── UI/           # Shared UI components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and storage services
│   ├── utils/            # Helper functions
│   ├── types/            # TypeScript type definitions
│   └── test/             # Test utilities and setup
├── CLAUDE.md               # AI assistant guidance
├── SPECIFICATIONS.MD       # Detailed technical specifications
├── implementation-plan.md  # Phase-by-phase implementation plan
├── progress.md             # Development progress tracking
└── package.json            # Dependencies and scripts
```

## 🌐 Live Demo

Visit the live application: **[Kids Drawing App](https://yuripats.github.io/kids-drawing-app/)**

*Currently showing the welcome page with project overview and planned features.*

## 📈 Performance Targets

- **Load Time**: <3 seconds on 3G networks
- **Bundle Size**: <500KB initial load
- **Lighthouse Mobile Score**: >90
- **Touch Latency**: <50ms for drawing interactions
- **Offline Capability**: Full functionality without internet (Phase 6)

## 🔐 Security & Privacy

- **No Data Collection**: All artwork stored locally on device
- **API Security**: OpenAI API calls through secure serverless functions (Phase 4)
- **Content Filtering**: AI-generated content filtered for child-appropriate material
- **Local-First**: Primary storage on device, cloud as optional backup only

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the development workflow above
4. Ensure all tests pass and code meets quality standards
5. Submit a pull request with clear description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

**Phase 1** (Current): Core drawing functionality + CI/CD  
**Phase 2**: Enhanced tools + local gallery  
**Phase 3**: Stencil system + asset pipeline  
**Phase 4**: AI integration + security  
**Phase 5**: Cloud storage + sync  
**Phase 6**: PWA + offline-first architecture

---

*Made with ❤️ for creative kids everywhere*
