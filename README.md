# EV-PATH 🚗⚡

**Your Smartest EV Travel Companion – Anytime, Anywhere**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Django](https://img.shields.io/badge/Django-Python-blue.svg)](https://www.djangoproject.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

EV-PATH is a comprehensive electric vehicle (EV) navigation and planning platform designed to revolutionize the EV driving experience. Built with modern web technologies, it provides real-time charging station data, intelligent route planning, cost analysis, and AI-powered assistance to make EV ownership seamless and efficient.

### 🌟 Key Highlights

- **Real-time Charging Station Data**: Access to 100,000+ charging stations worldwide via OpenChargeMap API
- **Smart Route Planning**: AI-powered route optimization with charging stop recommendations
- **Cost Analysis**: Detailed cost comparison between EVs and traditional vehicles
- **AI Chatbot**: 24/7 EV expert assistance powered by Google Gemini AI
- **Multi-platform Support**: Responsive web application with mobile-first design
- **Real-time Updates**: Live data on charging station availability and pricing

## ✨ Features

### 🔋 Core Features

#### 1. **Charging Station Finder**
- Real-time location-based charging station discovery
- Advanced filtering by connector type, power rating, and availability
- Distance-based sorting and clustering
- Detailed station information including pricing and operator details

#### 2. **Smart Route Planner**
- Intelligent route optimization considering EV range and charging needs
- Automatic charging stop recommendations
- Real-time traffic integration
- Multiple route options with cost analysis

#### 3. **Cost Calculator**
- Comprehensive cost comparison between EVs and ICE vehicles
- Fuel cost analysis (Petrol/Diesel vs Electricity)
- Annual savings projections
- Environmental impact calculations

#### 4. **AI-Powered Chatbot**
- 24/7 EV expert assistance
- Context-aware responses using Google Gemini AI
- Fallback responses for common EV questions
- Multi-language support

#### 5. **EV Management**
- Personal EV fleet management
- Battery health monitoring
- Range optimization tips
- Maintenance scheduling

### 🎨 User Experience Features

- **Dark/Light Theme**: Automatic theme switching with user preference
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live data synchronization
- **Offline Support**: Basic functionality available offline
- **Progressive Web App**: Install as native app on mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1**: Modern UI framework with hooks and context
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router DOM**: Client-side routing
- **Leaflet**: Interactive maps with clustering
- **Material-UI**: Component library for enhanced UI
- **Lucide React**: Beautiful icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: Authentication and authorization
- **bcrypt**: Password hashing
- **Joi**: Data validation
- **CORS**: Cross-origin resource sharing

### AI & External APIs
- **Google Gemini AI**: Advanced AI chatbot capabilities
- **OpenChargeMap API**: Global charging station data
- **OSRM**: Open-source routing machine for route optimization
- **Nominatim**: Geocoding services

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing
- **Nodemon**: Development server with auto-restart

## 🏗️ Architecture

```
EV-PATH/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth, Theme, EV)
│   │   ├── pages/          # Page components
│   │   └── main.jsx        # Application entry point
│   └── package.json
├── backend/                 # Node.js/Express API
│   ├── Controllers/        # Request handlers
│   ├── Models/            # Database models
│   ├── Routes/            # API route definitions
│   ├── Middlewares/       # Authentication & validation
│   └── index.js          # Server entry point
└── evproxy/              # Django proxy for external APIs
    ├── ocm/              # OpenChargeMap integration
    └── manage.py         # Django management
```

### Data Flow

1. **Frontend** → **Backend API** → **MongoDB** (User data, EV profiles)
2. **Frontend** → **Django Proxy** → **External APIs** (Charging stations, routing)
3. **Frontend** → **Gemini AI** → **Chatbot responses**

## 🚀 Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ and pip
- MongoDB 5.0+
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/EV-PATH.git
cd EV-PATH
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/evpath
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Step 3: Frontend Setup

```bash
cd ../frontend
npm install
```

### Step 4: Django Proxy Setup

```bash
cd ../evproxy
pip install -r requirements.txt
python manage.py migrate
```

Create a `.env` file in the evproxy directory:

```env
OCM_API_KEY=your_openchargemap_api_key
GEMINI_API_KEY=your_gemini_api_key
DEBUG=True
SECRET_KEY=your_django_secret_key
```

### Step 5: Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Django Proxy
cd evproxy
python manage.py runserver 8000
```

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=8080                    # Server port
MONGODB_URI=mongodb://...    # MongoDB connection string
JWT_SECRET=your_secret       # JWT signing secret
NODE_ENV=development         # Environment mode
```

#### Django Proxy (.env)
```env
OCM_API_KEY=your_key         # OpenChargeMap API key
GEMINI_API_KEY=your_key      # Google Gemini AI API key
DEBUG=True                   # Django debug mode
SECRET_KEY=your_secret       # Django secret key
```

### API Keys Required

1. **OpenChargeMap API**: [Get API Key](https://openchargemap.io/site/develop/api)
2. **Google Gemini AI**: [Get API Key](https://makersuite.google.com/app/apikey)

## 📚 API Documentation

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+1234567890",
  "location": "Mumbai, India"
}
```

#### POST `/auth/login`
Authenticate user and get JWT token.

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### EV Management Endpoints

#### GET `/evs/user/:userId`
Get all EVs for a user.

#### POST `/evs/add`
Add a new EV to user's fleet.

```json
{
  "type": "4W",
  "brand": "Tesla",
  "model": "Model 3",
  "batteryCapacity": 75,
  "currentCharge": 60,
  "fullRange": 350,
  "isDefault": true
}
```

### Charging Station Endpoints

#### GET `/api/ev-stations`
Find charging stations near a location.

**Parameters:**
- `lat`: Latitude
- `lon`: Longitude
- `distance`: Search radius in km (default: 10)
- `connectors`: Comma-separated connector types
- `min_kw`: Minimum power rating
- `max_kw`: Maximum power rating

### Trip Planning Endpoints

#### GET `/api/plan-trip`
Plan a complete EV trip with charging stops.

**Parameters:**
- `from`: Starting city
- `to`: Destination city
- `vehicle_range`: EV range in km (default: 300)
- `current_battery`: Current battery percentage (default: 80)

**Response:**
```json
{
  "trip_summary": {
    "distance_km": 150.5,
    "duration_hours": 2.5,
    "ev_cost": 301.0,
    "petrol_cost": 1003.3,
    "savings": 702.3
  },
  "charging_stops": [...],
  "charging_stations": [...],
  "environmental_impact": {
    "co2_saved_kg": 230.1,
    "equivalent_trees": 10.5
  }
}
```

### Chatbot Endpoints

#### POST `/api/chatbot`
Get AI-powered EV assistance.

```json
{
  "message": "What's the range of a Tesla Model 3?",
  "conversation_history": []
}
```

## 💻 Usage

### Getting Started

1. **Register/Login**: Create an account or sign in
2. **Add Your EV**: Configure your electric vehicle details
3. **Find Charging Stations**: Use the map to locate nearby chargers
4. **Plan Routes**: Get optimized routes with charging stops
5. **Get AI Help**: Chat with our EV expert for any questions

### Key Features Walkthrough

#### Charging Station Discovery
- Use the interactive map to find charging stations
- Filter by connector type, power rating, and availability
- Get real-time pricing and operator information
- Save favorite stations for quick access

#### Route Planning
- Enter your start and destination
- Specify your EV's range and current battery level
- Get optimized routes with charging stop recommendations
- View detailed cost analysis and environmental impact

#### Cost Analysis
- Compare EV costs with petrol/diesel vehicles
- Calculate annual savings and break-even points
- Track environmental impact in CO2 savings
- Monitor charging costs and efficiency

## 🚀 Deployment

### Production Deployment

#### 1. Backend Deployment (Vercel/Heroku)

```bash
cd backend
npm run build
```

**Vercel Configuration (vercel.json):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

#### 2. Frontend Deployment (Vercel/Netlify)

```bash
cd frontend
npm run build
```

#### 3. Database Setup

- Use MongoDB Atlas for cloud database
- Configure connection string in environment variables
- Set up database indexes for optimal performance

#### 4. Environment Configuration

Set production environment variables:
- `NODE_ENV=production`
- `MONGODB_URI=your_production_mongodb_uri`
- `JWT_SECRET=your_production_jwt_secret`
- `OCM_API_KEY=your_ocm_api_key`
- `GEMINI_API_KEY=your_gemini_api_key`

### Docker Deployment

#### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/evpath
    depends_on:
      - mongo
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
  
  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Code Style

- **JavaScript**: Use ES6+ features, follow Airbnb style guide
- **React**: Use functional components with hooks
- **CSS**: Use Tailwind CSS utility classes
- **Python**: Follow PEP 8 style guide

## 📊 Performance & Optimization

### Frontend Optimizations
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Service worker for offline functionality
- Bundle size optimization with Vite

### Backend Optimizations
- Database indexing for frequent queries
- API response caching
- Rate limiting for external API calls
- Connection pooling for MongoDB

### Monitoring
- Application performance monitoring
- Error tracking and logging
- Real-time user analytics
- API usage metrics

## 🔒 Security

### Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Session management

### Data Protection
- Input validation and sanitization
- CORS configuration
- Rate limiting
- HTTPS enforcement

### API Security
- Request validation with Joi
- SQL injection prevention
- XSS protection
- CSRF protection

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Core charging station finder
- ✅ Basic route planning
- ✅ User authentication
- ✅ EV management


## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests on GitHub
- **Discussions**: Join our community discussions
- **Email**: Contact us at ishanrshah087@gmail.com

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenChargeMap**: For providing comprehensive charging station data
- **Google Gemini AI**: For powering our intelligent chatbot
- **OSRM**: For open-source routing capabilities
- **React & Node.js Communities**: For excellent documentation and support
- **Our Contributors**: For making EV-PATH better every day

---

**Made with ❤️ for the EV community**

*EV-PATH - Empowering Electric Vehicle Drivers Worldwide*
