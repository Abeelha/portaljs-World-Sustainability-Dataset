# 🌍 World Sustainability Data Portal

> A comprehensive, AI-powered data portal showcasing global sustainability metrics across 173 countries and 19 years of data.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC)
![React](https://img.shields.io/badge/React-18+-61DAFB)

## 🚀 **Live Demo**

A production-ready data portal built with modern web technologies, featuring comprehensive sustainability data visualization, AI-powered insights, and exceptional user experience.

---

## 📋 **Project Overview**

This project represents a **production-ready data portal** that addresses real-world sustainability challenges through advanced data visualization and analysis.

### **Dataset: World Sustainability Metrics**

- **173 Countries** tracked across **19 Years** (2000-2020)
- **54 Distinct Metrics** covering environmental, social, and economic indicators
- **Real-world Impact**: Climate change, renewable energy, human development data
- **Source**: Kaggle sustainability datasets, UN databases, World Bank

---

## ⭐ **Key Features**

### **🔥 Core Portal Functionality**

- ✅ **Dataset Catalog** - Searchable, filterable dataset collection
- ✅ **Dataset Showcase** - Individual dataset pages with rich metadata
- ✅ **Data Preview** - Interactive tables with sorting, pagination, responsive design
- ✅ **Data Visualizations** - Bar charts, line charts, pie charts with dynamic filtering

### **🚀 Advanced Features**

- 🤖 **AI-Powered Insights** - Google Gemini integration for smart data analysis
- 🗺️ **Interactive World Map** - Click countries for detailed profiles
- 📊 **Advanced Data Explorer** - Multi-dimensional filtering and analysis
- 🌓 **Dark/Light Theme Toggle** - Smooth animations with system preference detection
- 📱 **Mobile-First Design** - Responsive across all devices
- 📁 **Data Export** - CSV/JSON download functionality
- 🏠 **Consistent Navigation** - Seamless user experience

### **💡 Smart Analytics & AI**

- **Carbon Emission Trends** - Global patterns and major contributors analysis
- **Renewable Energy Leaders** - Countries leading in sustainable energy adoption
- **Development vs Sustainability** - Correlation analysis between economic growth and environmental impact
- **Regional Analysis** - Comprehensive regional comparison insights
- **Life Expectancy Trends** - Health metrics correlation with sustainability factors

---

## 🛠 **Technology Stack**

### **Frontend Framework**

- **Next.js 15.3.3** - React framework with App Router
- **TypeScript** - Type-safe JavaScript for enhanced development
- **React 18** - Latest React features and hooks

### **UI & Styling**

- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icon set
- **Framer Motion** - Smooth animations and transitions

### **Data Visualization**

- **Recharts** - Declarative charts built for React
- **Leaflet** - Interactive maps for geospatial data
- **Chart.js** - Flexible charting library

### **AI & Data Processing**

- **Google Gemini API** - Advanced AI for insights generation
- **Papa Parse** - Robust CSV parsing and processing
- **Custom Data Processing** - Advanced filtering, aggregation, and analysis

### **Development Tools**

- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing and optimization
- **Git** - Version control with professional workflow

---

## 🏗 **Project Structure**

```
sustainability-portal/
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── page.tsx            # Home page with hero & features
│   │   ├── catalog/            # Dataset catalog page
│   │   ├── dataset/[slug]/     # Individual dataset showcase
│   │   ├── explorer/           # Interactive data explorer
│   │   ├── visualizations/     # Charts and graphs
│   │   ├── insights/           # AI-powered insights dashboard
│   │   ├── countries/          # Country profiles with map
│   │   ├── api-docs/           # API documentation
│   │   ├── terms/              # Terms of service
│   │   └── privacy/            # Privacy policy
│   ├── components/             # Reusable React components
│   │   ├── layout/             # Header, Footer, Navigation
│   │   ├── ui/                 # shadcn/ui components
│   │   └── maps/               # Interactive map components
│   └── lib/                    # Utility functions
│       ├── data-processing.ts  # CSV processing & analysis
│       ├── ai-service.ts       # Google Gemini API integration
│       ├── theme-provider.tsx  # Theme management
│       └── utils.ts           # General utilities
├── public/
│   ├── data/                   # World Sustainability Dataset
│   └── assets/                # Static assets
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # TailwindCSS configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.js            # Next.js configuration
```

---

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18.0 or later
- npm or yarn package manager
- Git for version control

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd portaljs-World-Sustainability-Dataset

# Install dependencies
npm install

# Set up environment variables (optional for AI features)
cp .env.example .env.local
# Add your Google Gemini API key for AI insights

# Run development server
npm run dev
```

### **Environment Variables (Optional)**

Create a `.env.local` file for enhanced AI features:

```env
# Google Gemini API for AI insights
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# Site configuration
NEXT_PUBLIC_SITE_NAME="World Sustainability Portal"
NEXT_PUBLIC_SITE_URL="https://localhost:3000"
```

### **Development Commands**

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

---

## 📊 **Features Deep Dive**

### **1. Dataset Catalog (`/catalog`)**

- **Search & Filter**: Real-time search across titles, descriptions, tags
- **Sorting Options**: Most downloaded, recently updated, alphabetical
- **Tag Filtering**: Multi-select tag filters for precise discovery
- **Clear Filters**: One-click filter reset functionality

### **2. Data Explorer (`/explorer`)**

- **Advanced Filtering**: Country, region, year, income group filters
- **Data Table**: Sortable, paginated table with responsive design
- **Statistics Panel**: Dynamic stats based on filtered data
- **Export Options**: Download filtered data as CSV or JSON

### **3. Interactive Visualizations (`/visualizations`)**

- **Multiple Chart Types**: Bar, line, and pie charts
- **Dynamic Filtering**: Year, region, metric, and top-N selectors
- **Real-time Updates**: Charts update instantly with filter changes
- **Data Export**: Download chart data for external analysis

### **4. AI-Powered Insights (`/insights`)**

- **Smart Analysis**: Choose from 6 different analysis types
- **Comprehensive Reports**: Key insights, statistics, recommendations
- **Featured Countries**: Top performers and notable cases
- **Trend Analysis**: Historical patterns and future implications

### **5. Country Profiles (`/countries`)**

- **Interactive World Map**: Click any country for detailed data
- **Global Statistics**: Live stats calculated from dataset
- **Navigation Integration**: Seamless links to data explorer

---

## 🎨 **Design System**

### **Color Palette**

- **Primary**: Sustainable greens (#22C55E, #16A34A)
- **Secondary**: Earth tones and ocean blues
- **Neutral**: Modern grays with high contrast ratios
- **Gradients**: Smooth color transitions for visual appeal

### **Typography**

- **Font Family**: Inter (system font fallback)
- **Spacing**: 8px grid system for consistent layout
- **Responsive**: Fluid typography scaling across devices

### **Dark Mode**

- **System Preference**: Automatically detects user preference
- **Toggle Control**: Floating toggle button with smooth animations
- **Comprehensive**: All components optimized for both themes

---

## 🔧 **Performance & Optimization**

### **Core Optimizations**

- ⚡ **Next.js App Router** - Optimal routing and rendering
- 🗜️ **Code Splitting** - Automatic bundle optimization
- 🖼️ **Image Optimization** - Next.js Image component with WebP
- 💾 **Data Caching** - Efficient data loading and caching strategies

### **Accessibility**

- ♿ **WCAG 2.1 AA Compliance** - Full accessibility support
- ⌨️ **Keyboard Navigation** - Complete keyboard accessibility
- 🎯 **Focus Management** - Proper focus indicators and management
- 📱 **Screen Reader Support** - Semantic HTML and ARIA labels

---

## 📈 **Data Processing Pipeline**

### **Data Ingestion**

1. **CSV Loading** - Papa Parse with robust error handling
2. **Data Cleaning** - Handle missing values, normalize country names
3. **Type Validation** - Ensure data type consistency
4. **Index Creation** - Fast search and filtering capabilities

### **Advanced Analytics**

- **Statistical Analysis** - Mean, median, percentile calculations
- **Trend Detection** - Year-over-year change analysis
- **Regional Grouping** - Geographic data aggregation
- **Correlation Analysis** - Multi-metric relationship detection

---

## 🤖 **AI Integration**

### **Google Gemini Integration**

- **Contextual Prompts** - Domain-specific sustainability knowledge
- **Structured Responses** - JSON-formatted insights for UI integration
- **Multi-Analysis Support** - 6 different analysis types available
- **Smart Recommendations** - Actionable insights based on data patterns

### **Analysis Types**

1. **Carbon Trends** - Global emission patterns and contributors
2. **Renewable Leaders** - Countries excelling in clean energy
3. **Development Balance** - Economic growth vs environmental impact
4. **Regional Comparison** - Geographic sustainability patterns
5. **Energy Access** - Electricity availability and progress
6. **Health Correlation** - Life expectancy and environmental factors

---

## 🚀 **Deployment**

### **Ready for Production**

- ✅ **Build Optimization** - Production-ready build configuration
- ✅ **Environment Config** - Flexible environment variable setup
- ✅ **Static Generation** - Optimal performance for public pages
- ✅ **Error Handling** - Comprehensive error boundaries and fallbacks

### **Deployment Platforms**

- **Vercel** (Recommended) - Seamless Next.js deployment
- **Netlify** - Alternative static hosting
- **Cloudflare Pages** - Global edge deployment

---

## 👨‍💻 **Development**

### **Skills Demonstrated**

- **Advanced JavaScript/TypeScript** - Complex data processing and type safety
- **Modern React Patterns** - Hooks, context, performance optimization
- **API Integration** - External services and data management
- **UI/UX Design** - Professional interface design and user experience
- **Performance Optimization** - Bundle splitting, caching, lazy loading

### **Code Quality**

- **Clean Architecture** - Component composition and separation of concerns
- **Type Safety** - Comprehensive TypeScript implementation
- **Error Handling** - Robust error boundaries and user feedback
- **Accessibility** - WCAG compliance and inclusive design
- **Documentation** - Clear, comprehensive project documentation

---

## 📝 **License**

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 **Acknowledgments**

- **Open Source Community** - For the amazing tools and libraries used
- **UN & World Bank** - For providing the underlying sustainability data
- **Sustainability Dataset Contributors** - For making the data accessible

---

_Built with ❤️ for sustainable data visualization and global environmental awareness._
