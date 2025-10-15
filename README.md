# CR360 - Credit Risk Dashboard

A modern, interactive credit risk monitoring dashboard built with React, TypeScript, and TailwindCSS.

## Features

✅ **KPI Summary Bar** - 8 key risk metrics with trend indicators
✅ **Portfolio Health** - Interactive charts with 12-month trends
✅ **Delinquency Matrix** - Heatmap with click-to-drilldown
✅ **Top Exposures** - Ranked table of largest exposures
✅ **Group Hierarchy Visualization** - Interactive tree view of connected counterparties with parent-child relationships
✅ **AI-Powered Chatbot** - Context-aware assistant using Google Gemini 2.5 Flash
✅ **Comprehensive Company Profiles** - Detailed risk, exposure, profitability, and climate risk views
✅ **Responsive Design** - Desktop and tablet support
✅ **Mock Data** - Realistic sample data

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Tech Stack

React 19 • TypeScript • Vite 7 • TailwindCSS • Recharts • Zustand • React Flow • Google Generative AI

## Group Hierarchy Visualization

The Group Hierarchy feature provides an interactive tree visualization of connected counterparties within corporate groups. This powerful tool helps credit analysts understand parent-child relationships and group structures at a glance.

### Features

- **Interactive Tree Layout**: Automatic hierarchical positioning using React Flow
- **Detailed Company Cards**: Each node displays:
  - External, Internal, and Basel Ratings
  - Credit Score and Risk Weight
  - Industry and Credit Exposure
  - Credit Status (Standard, Watchlist, Delinquent)
  - Org Structure information
- **Full-Screen Modal**: Large canvas for viewing complex group structures
- **Zoom and Pan Controls**: Navigate large hierarchies easily
- **Mini Map**: Bird's-eye view of the entire tree structure
- **Color-Coded Status**: Visual indication of credit health (Green/Yellow/Red)

### How to Use

1. Navigate to any Company Profile page
2. Look for the network icon button next to "Group of Connected Counterparties" in the left sidebar
3. Click the button to open the interactive hierarchy visualization
4. Use mouse wheel to zoom, click and drag to pan
5. View detailed company information in each node card

### Supported Groups

The feature works with all corporate groups in the portfolio, including:
- Tata Group (Tata Steel, TCS Limited, Titan Company)
- Aditya Birla Group (Grasim Industries, UltraTech Cement, Hindalco Industries, ABB India)
- Adani Group (Adani Ports, ONGC Limited, Power Grid Corp, NTPC Limited, Coal India)
- HDFC Banking Group
- Pharma & Healthcare Group
- IT Services Group
- And many more...
