# Real-Time IoT Sensor Data Aggregator

A modern, real-time IoT sensor data monitoring and analytics platform built with Next.js, TypeScript, and React. This application simulates and visualizes data from multiple IoT sensors with comprehensive metrics tracking, performance monitoring, and storage analytics.

## 🚀 Features

### Real-Time Monitoring
- **Live Sensor Data**: Monitor temperature, accelerometer, pressure, and humidity sensors in real-time
- **50+ Simulated Devices**: Simulates data from 50 IoT devices with realistic sensor readings
- **Interactive Dashboard**: Beautiful, responsive UI with dark mode support
- **Time-Series Visualization**: Dynamic charts showing sensor data trends over time

### Performance Metrics
- **SLO Compliance Tracking**: Monitor Service Level Objectives for latency, throughput, and availability
- **P95 Latency Monitoring**: Track 95th percentile latency for performance optimization
- **Throughput Metrics**: Real-time events per second tracking
- **Alert System**: Automated alerts for critical, warning, and info level events

### Storage Analytics
- **DynamoDB Integration**: Schema design for efficient sensor data storage
- **Capacity Monitoring**: Track storage usage vs. total capacity
- **Write Performance**: Monitor write latency and throughput
- **Event Success Rate**: Track successful vs. failed storage operations

### System Health
- **Availability Tracking**: Real-time system availability percentage (target: ≥99%)
- **Error Rate Monitoring**: Track and analyze system error rates
- **Uptime Reporting**: Monitor system uptime and health status
- **Status Indicators**: Visual status badges for quick system health assessment

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **pnpm** (or npm/yarn)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.2.4**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Recharts**: Composable charting library

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library
- **shadcn/ui**: Re-usable component collection
- **Geist Font**: Modern typography

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johaankjis/Real-Time-IoT-Sensor-Data-Aggregator.git
   cd Real-Time-IoT-Sensor-Data-Aggregator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
Real-Time-IoT-Sensor-Data-Aggregator/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Overview dashboard
│   ├── sensors/             # Sensor data page
│   ├── metrics/             # Metrics and alerts page
│   ├── storage/             # Storage analytics page
│   └── settings/            # Configuration page
├── components/              # React components
│   ├── ui/                  # UI component primitives
│   ├── metric-card.tsx      # Metric display card
│   ├── sensor-card.tsx      # Sensor data card
│   ├── time-series-chart.tsx # Time-series visualization
│   ├── event-log.tsx        # Event logging component
│   └── sidebar-nav.tsx      # Navigation sidebar
├── lib/                     # Core library code
│   ├── data-simulator.ts    # IoT data simulation engine
│   ├── metrics-collector.ts # Metrics aggregation
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
├── styles/                  # Global styles
├── next.config.mjs          # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Project dependencies
```

## 🎯 Usage

### Starting the Data Simulator

1. Navigate to any page in the application
2. Click the **"Start Simulation"** button in the top-right corner
3. Watch as real-time sensor data begins flowing through the system
4. Click **"Stop Simulation"** to pause data generation

### Exploring the Dashboard

#### Overview Page (`/`)
- View key performance metrics at a glance
- Monitor P95 latency, throughput, and system availability
- Visualize throughput and latency trends over time
- Check overall system health status

#### Sensors Page (`/sensors`)
- Real-time sensor readings from all 4 sensor types
- Individual sensor history charts
- Detailed event log with timestamps
- Filter by specific sensor type using tabs

#### Metrics Page (`/metrics`)
- SLO compliance tracking
- Active alerts dashboard (Critical, Warning, Info)
- Performance comparison charts
- System health indicators

#### Storage Page (`/storage`)
- Storage capacity monitoring
- Write performance metrics
- DynamoDB table schema visualization
- Event success/failure rates

#### Settings Page (`/settings`)
- Configure data ingestion parameters
- Set alert thresholds
- Adjust monitoring intervals
- Enable/disable features

## 🔧 Configuration

### Data Simulation Settings
The simulator can be configured in `lib/data-simulator.ts`:
- **DEVICE_COUNT**: Number of simulated IoT devices (default: 50)
- **SENSOR_TYPES**: Types of sensors to simulate
- **Events Per Second**: Configurable throughput (default: 12 events/s)

### Sensor Value Ranges
- **Temperature**: 15-35°C
- **Accelerometer**: -10 to 10 m/s²
- **Pressure**: 980-1040 hPa
- **Humidity**: 30-80%

### Metrics Collection
Configure metrics in `lib/metrics-collector.ts`:
- **maxHistorySize**: Number of events to retain (default: 1000)
- **P95 Calculation**: Automatic 95th percentile latency
- **Success Rate**: Simulated 99.5% success rate

## 📊 Key Metrics

### Performance Targets (SLOs)
- **P95 Latency**: < 200ms (target)
- **Throughput**: 12 events/second (configurable)
- **Availability**: ≥ 99% uptime
- **Error Rate**: < 1%

### Monitoring Intervals
- **Metrics Update**: 1 second
- **Chart History**: 60 seconds (rolling window)
- **Event Retention**: Last 1000 events

## 🎨 UI Features

- **Dark Mode**: Modern dark theme optimized for monitoring
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live data updates without page refresh
- **Interactive Charts**: Hover for detailed data points
- **Status Badges**: Color-coded health indicators
- **Accessible**: Built with Radix UI primitives for accessibility

## 🚀 Deployment

### Build for Production

```bash
pnpm build
# or
npm run build
# or
yarn build
```

### Start Production Server

```bash
pnpm start
# or
npm start
# or
yarn start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use the [Vercel GitHub Integration](https://vercel.com/docs/git) for automatic deployments.

## 🧪 Development

### Run Linter

```bash
pnpm lint
# or
npm run lint
```

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Consistent component structure
- Modular architecture

## 📈 Future Enhancements

Potential areas for expansion:
- **Real DynamoDB Integration**: Connect to actual AWS DynamoDB
- **Authentication**: User login and multi-tenancy
- **Historical Data**: Long-term data storage and analysis
- **Export Features**: Download data as CSV/JSON
- **Custom Alerts**: User-configurable alert rules
- **API Integration**: REST/GraphQL API for external systems
- **WebSocket Support**: Real-time bidirectional communication
- **ML Analytics**: Anomaly detection and predictive analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**johaankjis**
- GitHub: [@johaankjis](https://github.com/johaankjis)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)
- Hosted on [Vercel](https://vercel.com/)

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation above

---

**Note**: This is a demonstration application with simulated data. For production use with real IoT devices, you'll need to integrate with actual sensor hardware and cloud storage services.
