# MutualFund Pro - Investment Comparison Platform

A modern, responsive web application for comparing and analyzing mutual fund performance with advanced charting and detailed analytics.

## 🚀 Live Demo

**Deployed Application:** [https://taskrabbitinvest-5ysq6iaex-amit123singhs-projects.vercel.app/](https://candid-treacle-389a6f.netlify.app)

## ✨ Features

### 🔐 Authentication
- Simple email/password authentication system
- Persistent login sessions with localStorage
- Protected routes for authenticated users only

### 📊 Fund Selection & Management
- Browse and search through thousands of mutual funds
- Advanced filtering by fund category and fund house
- Select up to 4 funds for comparison
- Real-time search with instant results
- Intuitive fund cards with detailed information

### 📈 Interactive Comparison
- Side-by-side performance comparison charts
- Interactive line charts with hover tooltips
- Historical NAV (Net Asset Value) data visualization
- Color-coded fund identification
- Responsive chart design for all screen sizes

### 🎨 Modern UI/UX
- Clean, professional design with Tailwind CSS
- Fully responsive layout (mobile, tablet, desktop)
- Smooth animations and micro-interactions
- Loading states and error handling
- Apple-level design aesthetics

## 🛠️ Technology Stack

- **Frontend Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Build Tool:** Vite
- **Deployment:** Netlify

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Amit123Singh/Project
   cd Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 📱 Usage Guide

### Getting Started

1. **Login**: Use any email address and password (minimum 6 characters) to access the application
2. **Select Funds**: Browse and select 2-4 mutual funds you want to compare
3. **Compare**: View detailed comparison charts and analytics

### Fund Selection

- **Search**: Use the search bar to find specific funds by name
- **Filter**: Filter by fund category or fund house
- **Select**: Click on fund cards to add them to your comparison list
- **Manage**: Remove funds by clicking the X button or clicking selected funds again

### Comparison View

- **Interactive Charts**: Hover over chart lines to see detailed NAV values
- **Fund Details**: View comprehensive information about each selected fund
- **Historical Data**: Analyze performance trends over time

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ComparisonChart.tsx
│   ├── FundCard.tsx
│   ├── LoadingSpinner.tsx
│   └── Navbar.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx
│   └── useFunds.tsx
├── pages/              # Page components
│   ├── Comparison.tsx
│   ├── FundSelection.tsx
│   └── Login.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── api.ts
│   └── localStorage.ts
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🔌 API Integration

The application uses the [MF API](https://www.mfapi.in/) for mutual fund data:

- **All Funds Endpoint**: `https://api.mfapi.in/mf`
- **Fund Details Endpoint**: `https://api.mfapi.in/mf/{scheme_code}`

### Data Flow

1. Fetch all available mutual funds on app initialization
2. Allow users to search and filter funds
3. Fetch detailed historical data for selected funds
4. Process and visualize data in interactive charts

## 🎯 Key Features Explained

### State Management
- **Authentication State**: Managed via React Context with localStorage persistence
- **Fund Selection State**: Global state for selected funds with automatic persistence
- **Local Component State**: For UI interactions, loading states, and form data

### Error Handling
- Comprehensive error boundaries
- API error handling with user-friendly messages
- Retry mechanisms for failed requests
- Loading states for better UX

### Performance Optimizations
- Memoized computations for filtered data
- Efficient re-rendering with React hooks
- Optimized chart data processing
- Lazy loading and code splitting ready

## 🚀 Deployment

The application is deployed on Netlify with automatic builds from the main branch.

### Deployment Configuration
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18.x

## 🔮 Future Enhancements

- [ ] Portfolio tracking and management
- [ ] Advanced analytics and metrics
- [ ] Export functionality for charts and data
- [ ] Real-time data updates
- [ ] Mobile app version
- [ ] Social sharing features
- [ ] Watchlist functionality
- [ ] Performance alerts and notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [MF API](https://www.mfapi.in/) for providing mutual fund data
- [Recharts](https://recharts.org/) for beautiful chart components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide React](https://lucide.dev/) for beautiful icons


---

**Built with ❤️ using React, TypeScript, and modern web technologies**