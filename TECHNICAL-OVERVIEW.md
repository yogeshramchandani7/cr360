# CR360 - Credit Risk 360 Platform
## Technical Architecture Overview for New Developers

---

## 🎯 Product Overview

**CR360** is an enterprise credit risk analytics dashboard for financial institutions. It provides real-time portfolio monitoring, AI-powered insights, risk assessment, and compliance tracking through interactive visualizations and automated alerts.

---

## 🛠️ Tech Stack

### Core Technologies
- **Frontend Framework**: React 19.1.1
- **Language**: TypeScript 5.9 (strict mode)
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.3
- **State Management**: Zustand 5.0.8

### UI & Styling
- **CSS Framework**: Tailwind CSS 3.4.18
- **Icons**: Lucide React 0.544.0
- **Charts**: Recharts 3.2.1
- **Flow Diagrams**: ReactFlow 11.11.4
- **Sliders**: rc-slider 11.1.9

### AI & Data
- **LLM Integration**: Google Gemini 2.5 Flash (@google/generative-ai 0.24.1)
- **Search**: Fuse.js 7.1.0 (fuzzy search)
- **Date Handling**: date-fns 4.1.0
- **Markdown**: React Markdown 10.1.0

### Export & Documents
- **PDF Generation**: jsPDF 3.0.3 + jsPDF AutoTable 5.0.2
- **Screenshots**: html2canvas 1.4.1

### Testing & Quality
- **Testing**: Vitest 3.2.4 + Testing Library
- **Linting**: ESLint 9.36.0 + TypeScript ESLint

### Deployment
- **Hosting**: Vercel
- **Live URL**: https://creditrisk360.vercel.app

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/              # 12 route pages (Dashboard, Agent, Customer, etc.)
│   ├── components/         # 95+ reusable components
│   │   ├── chat/          # AI chatbot UI
│   │   ├── agent/         # Agent page components
│   │   ├── charts/        # Advanced visualizations
│   │   ├── risk-details/  # Risk analysis components
│   │   └── ...
│   ├── stores/            # Zustand stores (chatStore, filterStore, alertStore)
│   ├── services/          # API integrations (geminiService, contextBuilder)
│   ├── lib/               # Utilities & mock data
│   │   ├── mockData.ts    # 50+ mock companies
│   │   ├── filterUtils.ts # Filter logic (1000+ LOC)
│   │   ├── kpiInsights.ts # KPI insights (27 insights)
│   │   └── ...
│   ├── types/             # TypeScript definitions
│   ├── App.tsx            # Router configuration
│   └── main.tsx           # Entry point
├── dist/                  # Build output
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🏗️ Architecture Patterns

### 1. **State Management**
- **Zustand** for lightweight global state (3 stores)
- **localStorage** persistence for filters and chat
- No Redux boilerplate

### 2. **Data Flow**
```
User Action → Zustand Store Update → Component Re-render → UI Update
```

### 3. **Filtering Architecture**
- **Global filters**: LOB, Party Type, Rating, Asset Classification
- **Page-level filters**: Per-route specific filters
- **Drill-down filters**: From chart interactions
- All filters combine with AND/OR logic

### 4. **Component Patterns**
- Functional components with hooks
- Props-based composition
- Folder-based organization by feature

### 5. **Routing**
- URL-based navigation (React Router)
- Query parameters for view state (`/agent?view=daily-briefing`)
- Protected/nested routes for detail pages

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup
- API key for Google Gemini is in `src/config/apiKeys.ts` (hardcoded for demo)
- No backend required - all data is mock/client-side

---

## 🔑 Key Features & Files

### 1. **Dashboard** (`/pages/Dashboard.tsx`)
- KPI monitoring, charts, top exposures
- Uses: `AdvancedKPIBar`, `MasterSlicerChart`, `TopExposuresTable`

### 2. **AI Chatbot** (`/components/chat/`)
- Google Gemini integration with streaming
- Context-aware from portfolio data
- Service: `services/geminiService.ts`

### 3. **Filtering System** (`/stores/filterStore.ts`, `/lib/filterUtils.ts`)
- Multi-level filtering with persistence
- 7+ utility functions for filtered calculations

### 4. **Insights Engine** (`/lib/kpiInsights.ts`, `/lib/insightsBriefingGenerator.ts`)
- 27 KPI insights + dynamic macro insights
- Auto-generated daily briefing

### 5. **Alert System** (`/stores/alertStore.ts`, `/lib/alertGenerator.ts`)
- Real-time monitoring with 4 alert types
- Background scanning

---

## 📊 Data Architecture

### Mock Data
- **Source**: `lib/mockData.ts`
- **Companies**: 50+ mock portfolio companies
- **Loans**: 100+ loan records
- **Historical**: 12-month trends

### Key Data Models
```typescript
PortfolioCompany {
  id, customerName, group, lineOfBusiness,
  creditExposure, creditLimit, creditStatus,
  borrowerExternalRating, assetClass, ...
}

KPI {
  value, unit, trend, changePercent,
  threshold: { green, amber, status }
}

Insight {
  id, theme, description, severity,
  keyInsights[], croActions[]
}
```

---

## 🎨 Styling

### Tailwind Configuration
- **Oracle Theme**: Navy (`#2C3E50`), Red (`#C74634`), Light BG (`#FBF9F8`)
- **Utility-first**: All styling via Tailwind classes
- **Responsive**: Mobile-first breakpoints

### Component Styling
```typescript
// Tailwind classes directly in JSX
<div className="bg-white rounded-lg shadow-sm p-4">
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

- **Framework**: Vitest
- **13 test files** covering stores, utilities, components
- **Test location**: Co-located with source files (`*.test.ts`)

---

## 🚢 Deployment

```bash
# Build production bundle
npm run build

# Deploy to Vercel
npx vercel --prod
```

**Note**: TypeScript strict errors won't block Vite build, but should be fixed for code quality.

---

## 🔧 Common Development Tasks

### Add a New Component
```typescript
// src/components/MyComponent.tsx
export default function MyComponent() {
  return <div>Hello</div>;
}
```

### Add a New Route
```typescript
// src/App.tsx
<Route path="my-route" element={<MyPage />} />
```

### Add a New Filter
1. Update `filterStore.ts` with new filter state
2. Add filter logic in `filterUtils.ts`
3. Update `FilterBar.tsx` with UI control

### Add a New Insight
1. Add to appropriate array in `lib/kpiInsights.ts`
2. Follow `KPIInsight` interface structure
3. Auto-appears in Agent > Insights

---

## 📦 Key Dependencies Explained

| Package | Purpose |
|---------|---------|
| `zustand` | Lightweight state management |
| `recharts` | Chart library (React-native) |
| `@google/generative-ai` | Gemini LLM integration |
| `react-router-dom` | Client-side routing |
| `tailwindcss` | Utility-first CSS |
| `jspdf` | PDF report generation |
| `vitest` | Fast unit testing |

---

## ⚠️ Important Notes

1. **No Backend**: All data is mock/client-side
2. **API Key**: Hardcoded in `config/apiKeys.ts` (not production-ready)
3. **State Persistence**: Uses localStorage for filters/chat
4. **Hot Reload**: Vite HMR works automatically
5. **TypeScript**: Strict mode enabled - fix errors before PR

---

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Vite auto-increments port (5173 → 5174 → ...)
```

**Build fails on TypeScript errors?**
```bash
# Use Vite directly to skip tsc
npx vite build
```

**Chat not working?**
- Check Gemini API key in `config/apiKeys.ts`
- Check browser console for errors

---

## 📚 Useful Commands

```bash
npm run dev          # Start dev server
npm test             # Run tests
npm run build        # Production build
npm run lint         # Lint code
npx vercel --prod    # Deploy to production
```

---

## 👥 Getting Help

- **Codebase**: 138 TypeScript files, 95+ components
- **Main Files**: `App.tsx`, `Dashboard.tsx`, `filterStore.ts`, `mockData.ts`
- **Docs**: Check inline comments and type definitions

---

## 📖 Additional Resources

### Converting to PDF
If you need a PDF version of this document:

```bash
# Using Pandoc (install first: brew install pandoc)
pandoc TECHNICAL-OVERVIEW.md -o TECHNICAL-OVERVIEW.pdf

# Or use online converters:
# - https://www.markdowntopdf.com/
# - https://cloudconvert.com/md-to-pdf
```

### IDE Setup Recommendations
- **VS Code Extensions**:
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
  - Vitest

---

**Happy Coding! 🚀**

---

*Last Updated: November 2025*
*Version: 1.0*
