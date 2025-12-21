# Trippy - Travel Planning Made Simple

![Trippy Logo](docs/screenshots/logo.png) <!-- Add your logo here -->

A modern, responsive web application for planning and managing your travel adventures. Discover destinations, create detailed trip itineraries, and explore the world with Trippy.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)

## 📸 Screenshots

### Homepage
![Homepage](docs/screenshots/homepage.png)
*The beautiful homepage showcasing popular destinations with stunning imagery and easy navigation.*

### Destination Discovery
![Destinations](docs/screenshots/destinations.png)
*Browse through curated destinations with ratings, prices, and detailed information.*

### Trip Planning
![Trip Planning](docs/screenshots/trip-planning.png)
*Create detailed trip itineraries with activities, dates, and locations.*

### Interactive Map
![Map View](docs/screenshots/map-view.png)
*Visualize your trip on an interactive Google Maps integration.*

### Backend Warmup Screen
![Warmup Screen](docs/screenshots/warmup-screen.png)
*Automatic server warmup detection when the backend is starting up (Render free tier).*

### Mobile Responsive
![Mobile View](docs/screenshots/mobile-view.png)
*Fully responsive design that works beautifully on all devices.*

## ✨ Features

- 🌍 **Destination Discovery** - Browse and search through popular travel destinations
- 📅 **Trip Planning** - Create detailed itineraries with activities and schedules
- 🗺️ **Interactive Maps** - Visualize trips with Google Maps integration
- ⭐ **Favorites** - Save your favorite destinations for quick access
- 🔄 **Backend Warmup** - Automatic detection and retry when backend is starting
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful, intuitive interface built with Tailwind CSS
- ⚡ **Fast Performance** - Optimized with Vite and React best practices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Google Maps API key (optional, for map features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Trippy-FE.git
   cd Trippy-FE
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```env
   VITE_API_BASE_URL=https://trippy-be.onrender.com/api
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## ⚙️ Configuration

### API Configuration

The app connects to a backend API. Configure the base URL in `.env`:

```env
VITE_API_BASE_URL=https://trippy-be.onrender.com/api
```

For local development:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Google Maps Setup

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional)
   - Geocoding API (optional)
3. Add your API key to `.env`:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

See [GOOGLE_MAPS_SETUP.md](GOOGLE_MAPS_SETUP.md) for detailed instructions.

## 🏗️ Project Structure

```
Trippy-FE/
├── src/
│   ├── components/          # React components
│   │   ├── HomePage.tsx
│   │   ├── PlanPage.tsx
│   │   ├── TripMap.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── BackendWarmupScreen.tsx
│   ├── contexts/           # React contexts
│   │   └── BackendWarmupContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useApi.ts
│   │   ├── useDestinations.ts
│   │   └── useTrips.ts
│   ├── services/           # API services
│   │   ├── api.ts
│   │   ├── destinationService.ts
│   │   └── tripService.ts
│   ├── types/              # TypeScript types
│   │   └── api.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                  # Static assets
├── docs/                    # Documentation
│   └── screenshots/        # Screenshot images
├── .env                    # Environment variables
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔧 Tech Stack

- **Frontend Framework**: React 18.2.0
- **Language**: TypeScript 5.2.2
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS 3.3.6
- **Routing**: React Router DOM 7.9.4
- **HTTP Client**: Axios 1.12.2
- **Maps**: Google Maps API (@react-google-maps/api)
- **Icons**: Lucide React

## 🌐 Backend Warmup Feature

Trippy includes intelligent backend warmup detection for free-tier hosting services (like Render) that spin down after inactivity.

### How It Works

1. **Automatic Detection**: When a backend API call times out (>2 seconds) or fails with a network error
2. **Warmup Screen**: Shows a beautiful loading screen with progress updates
3. **Auto-Retry**: Automatically retries the request every 5 seconds
4. **Smart Hiding**: Hides the warmup screen as soon as the backend responds

### Features

- ✅ Only shows in production (bypasses localhost)
- ✅ Non-blocking - app loads immediately
- ✅ Automatic retry with exponential backoff
- ✅ User-friendly progress messages
- ✅ Seamless user experience

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `VITE_API_BASE_URL`
   - `VITE_GOOGLE_MAPS_API_KEY`
4. Deploy!

### Other Platforms

The app can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 📚 Documentation

- [API Integration Guide](API_GUIDE.md) - Complete guide for API integration
- [Google Maps Setup](GOOGLE_MAPS_SETUP.md) - Detailed Google Maps configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - *Initial work*

## 🙏 Acknowledgments

- Google Maps API for mapping functionality
- Render for backend hosting
- All the amazing open-source libraries that made this possible

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation files
- Review the API guide

---

Made with ❤️ for travelers around the world
```

## Screenshot Instructions

Create a `docs/screenshots/` folder and add:

1. `logo.png` - Your app logo
2. `homepage.png` - Homepage screenshot
3. `destinations.png` - Destinations page
4. `trip-planning.png` - Trip planning interface
5. `map-view.png` - Map view with trips
6. `warmup-screen.png` - Backend warmup screen
7. `mobile-view.png` - Mobile responsive view

Recommended screenshot sizes:
- Desktop: 1920x1080 or 1440x900
- Mobile: 375x667 (iPhone) or 414x896

You can take screenshots using:
- Browser DevTools (F12 → Device Toolbar)
- Screenshot tools (Lightshot, Snagit, etc.)
- Online tools for mockups

Switch to agent mode if you want me to create the folder structure and add placeholder images.
