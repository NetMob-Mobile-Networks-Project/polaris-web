# Polaris QoE Web Dashboard

A comprehensive web-based dashboard for monitoring and analyzing network Quality of Experience (QoE) metrics. This Next.js application provides real-time visualization of network performance data collected from mobile devices.

## Features

### 🔐 Authentication & Authorization
- Secure login system with JWT token authentication
- Role-based access control (Admin/User)
- Protected routes with automatic session management
- Token expiration handling and refresh

### 📊 Real-time Analytics
- Dynamic metrics tables with pagination
- Multiple metric types: Network, Ping, HTTP, DNS, Web, SMS
- Time-based filtering (Last Hour, 24 Hours, 7 Days, 30 Days)
- CSV export functionality for detailed analysis
- Interactive data visualization

### 🗺️ Interactive Network Coverage Map
- Real-time network coverage visualization using Leaflet
- Dynamic color-coding based on signal strength and quality
- Customizable threshold settings for performance indicators
- Map bounds-based data fetching for optimal performance
- KML export for use with Google Earth and other mapping tools
- Responsive design with mobile support

### ⚙️ Administrative Settings
- **Data Collection Configuration**: Sampling intervals and test types
- **User Management**: Create, view, and delete users (Admin only)
- **Export Settings**: Default formats and preferences
- Real-time configuration updates

### 🎯 Dashboard Overview
- Key performance indicators (KPIs)
- Network status summaries
- Quick access to all major features
- Responsive layout with sidebar navigation

## Technology Stack

- **Frontend**: Next.js 15.2.3, React 19, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Maps**: Leaflet with React-Leaflet
- **Charts**: Chart.js (ready for implementation)
- **Authentication**: JWT with localStorage
- **HTTP Client**: Axios with interceptors
- **Icons**: Heroicons

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Backend API server running

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd polaris-web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://your-backend-url:8080/api/v1
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Deployment

### Using Docker Compose

1. Build and start the container:
```bash
docker-compose up --build
```

2. Access the application at [http://localhost:3000](http://localhost:3000)

### Development with Docker

```bash
# Start in development mode
docker-compose up

# Stop containers
docker-compose down

# View logs
docker-compose logs -f web

# Rebuild after changes
docker-compose up --build
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   └── login/               # Login page
│   ├── dashboard/               # Protected dashboard area
│   │   ├── analytics/           # Analytics and reporting
│   │   ├── map/                 # Network coverage map
│   │   ├── settings/            # Admin settings
│   │   └── layout.tsx           # Dashboard layout with navigation
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── auth/                    # Authentication components
│   │   └── ProtectedRoute.tsx   # Route protection wrapper
│   ├── charts/                  # Chart components
│   ├── map/                     # Map-related components
│   │   └── network-map.tsx      # Interactive network map
│   ├── metrics/                 # Metrics display components
│   │   └── dynamic-metrics-table.tsx
│   └── ui/                      # UI components
│       ├── card.tsx             # Base card component
│       └── metric-card.tsx      # Metric display card
├── lib/                         # Utilities and services
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Authentication hook
│   │   ├── useAnalyticsData.ts  # Analytics data fetching
│   │   ├── useConfigData.ts     # Configuration management
│   │   ├── useMapData.ts        # Map data with bounds
│   │   └── useUsersData.ts      # User management
│   ├── services/                # API services
│   │   ├── auth.ts              # Authentication service
│   │   └── metrics.ts           # Metrics API service
│   └── axios.ts                 # HTTP client configuration
└── types/                       # TypeScript type definitions
```

## API Integration

The application integrates with the following backend endpoints:

### Authentication
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user profile

### Metrics & Analytics
- `GET /metrics/detailed-list` - Paginated metrics data
- `GET /metrics/map-data` - Geographic network data
- `GET /export/csv` - Export metrics as CSV
- `GET /export/kml` - Export map data as KML

### Configuration & Users
- `GET /config` - Get system configuration
- `PUT /config` - Update system configuration
- `GET /users` - List users (Admin only)
- `POST /users` - Create user (Admin only)
- `DELETE /users/{id}` - Delete user (Admin only)

## Key Features Explained

### Real-time Map Updates
The network coverage map automatically fetches new data when:
- Map bounds change (pan/zoom)
- User stops interacting (debounced)
- Manual refresh is triggered

### Role-based Access Control
- **Admin users**: Full access to all features including user management and settings
- **Regular users**: Access to dashboard, analytics, and map views
- Settings tab is hidden for non-admin users

### Data Export Capabilities
- **CSV Export**: Detailed metrics data with current filters applied
- **KML Export**: Geographic data for use in mapping applications
- Server-side generation ensures consistent formatting

### Responsive Design
- Mobile-friendly navigation with collapsible sidebar
- Responsive tables and charts
- Touch-optimized map interactions

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://156.255.1.85:8080/api/v1` |
| `NODE_ENV` | Application environment | `development` |

## Development

### Code Structure
- **Custom Hooks**: Centralized data fetching and state management
- **Service Layer**: API abstraction with error handling
- **Component Architecture**: Reusable, composable components
- **Type Safety**: Full TypeScript coverage

### Authentication Flow
1. User logs in with email/password
2. JWT token stored in localStorage
3. Token included in all API requests
4. Automatic logout on token expiration
5. Protected routes redirect to login if unauthenticated

### Data Flow
1. Mobile clients collect network metrics
2. Data sent to backend API
3. Web application fetches processed data
4. Real-time updates via API polling
5. Interactive visualizations update automatically

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
Ensure the following for production:
- Set `NODE_ENV=production`
- Configure proper API base URL
- Set up SSL/HTTPS
- Configure proper CORS on backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
