This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure and Modules

### Core Components

#### Authentication (`/src/app/auth/`)
- `login/page.tsx`: Handles user authentication with email/password
- Implements form validation and error handling
- Currently uses placeholder authentication (to be replaced with actual auth system)

#### Dashboard (`/src/app/dashboard/`)
- Main application interface after login
- Features:
  - Overview of network performance metrics
  - Quick access to all major features
  - Real-time data updates
  - Responsive layout with sidebar navigation

#### Map View (`/src/app/dashboard/map/`)
- Interactive network coverage visualization
- Features:
  - Dynamic color-coding based on network metrics
  - Filtering by network type (4G/LTE, 5G, 3G)
  - Data export in KML format
  - Real-time updates of network status

#### Analytics (`/src/app/dashboard/analytics/`)
- Detailed performance analysis and trends
- Features:
  - Historical data visualization
  - Performance metrics comparison
  - Customizable time ranges
  - Export capabilities

#### Settings (`/src/app/dashboard/settings/`)
- User preferences and system configuration
- Features:
  - Alert threshold configuration
  - Map view preferences
  - Data collection settings
  - User profile management

### Components

#### Network Map (`/src/components/map/network-map.tsx`)
- Interactive map implementation using Leaflet
- Features:
  - Dynamic marker placement
  - Color-coded network status
  - Popup information windows
  - Real-time updates

#### Network Chart (`/src/components/charts/network-chart.tsx`)
- Performance visualization using Chart.js
- Features:
  - Line charts for various metrics
  - Multiple dataset comparison
  - Responsive design
  - Customizable options

#### Metric Card (`/src/components/ui/metric-card.tsx`)
- Reusable component for displaying metrics
- Features:
  - Trend indicators (up/down arrows)
  - Percentage change display
  - Customizable styling
  - Responsive layout

#### Card (`/src/components/ui/card.tsx`)
- Base component for consistent styling
- Features:
  - Shadow and border styling
  - Flexible content area
  - Customizable className support
  - Responsive design

### Types and Interfaces (`/src/types/`)
- `network.ts`: TypeScript interfaces for network data
  - NetworkMetrics: Structure for network performance data
  - User: User profile and preferences
  - ThresholdConfig: Alert threshold configuration

### Layout Components
- `RootLayout`: Base application layout with font configuration
- `DashboardLayout`: Dashboard-specific layout with navigation
- Implements responsive design and consistent styling

### Configuration Files
- `next.config.ts`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `eslint.config.mjs`: ESLint rules and settings
- `tailwind.config.ts`: Tailwind CSS configuration

### Dependencies
- Next.js 15.2.3: React framework
- React 19: UI library
- Chart.js: Data visualization
- Leaflet: Interactive maps
- Tailwind CSS: Styling
- TypeScript: Type safety
- Various UI components from Headless UI and Heroicons

### Development Tools
- ESLint: Code linting
- TypeScript: Type checking
- Turbopack: Fast development server
- PostCSS: CSS processing

### Data Flow
1. Android client collects network metrics
2. Data is sent to backend API
3. Web application fetches and processes data
4. Components update to display latest information
5. Real-time updates via WebSocket (to be implemented)

### Future Enhancements
- Implement actual authentication system
- Add WebSocket for real-time updates
- Enhance data export capabilities
- Add more visualization options
- Implement user management
- Add Persian language support
- Enhance mobile responsiveness
