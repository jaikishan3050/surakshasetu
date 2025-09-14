# SurakshaSetu 🛡️

**SurakshaSetu** is a comprehensive disaster preparedness platform designed for educational institutions. It features a student application for emergency drills and preparedness training, along with an admin dashboard for managing alerts, analyzing drill performance, and maintaining emergency protocols.

## 🏗️ Architecture

### Frontend (React + TypeScript + Tailwind)
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom components
- **Routing**: React Router v6
- **Charts**: Recharts for analytics
- **Build Tool**: Vite for fast development
- **API Layer**: Axios with TypeScript interfaces

### Backend (Node.js + Express)
- **Framework**: Express.js with TypeScript support
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet + CORS + Rate Limiting
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Express-validator

### Key Features

#### Student App
- 🔥 Emergency drill simulations (Fire, Earthquake, Flood, etc.)
- 📚 Preparedness modules and training
- 📞 Emergency contacts management
- 🚨 Real-time disaster alerts
- 📰 News feed for disaster-related updates

#### Admin Dashboard
- 🔐 Secure admin authentication
- 📊 Drill performance analytics and reporting
- ⚠️ Alert management system
- 👥 Student management
- 📈 Comprehensive dashboard with charts

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd surakshasetu
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install:all
   ```
   Or install individually:
   ```bash
   # Root dependencies
   npm install
   
   # Backend dependencies
   cd backend && npm install
   
   # Frontend dependencies
   cd ../frontend && npm install
   ```

3. **Set up environment variables**
   
   **Backend** (copy `.env.example` to `.env` in backend directory):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/surakshasetu
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend** (copy `.env.example` to `.env` in frontend directory):
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_APP_NAME=SurakshaSetu
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   
   # Or start them separately:
   # Backend (http://localhost:5000)
   npm run dev:backend
   
   # Frontend (http://localhost:5173)
   npm run dev:frontend
   ```

## 📁 Project Structure

```
surakshasetu/
├── backend/                 # Express.js API server
│   ├── models/             # MongoDB schemas
│   │   ├── User.js         # Admin users
│   │   ├── Student.js      # Student data
│   │   ├── Drill.js        # Emergency drills
│   │   ├── Alert.js        # Disaster alerts
│   │   └── News.js         # News articles
│   ├── routes/             # API endpoints
│   │   ├── auth.js         # Authentication
│   │   ├── students.js     # Student management
│   │   ├── drills.js       # Drill operations
│   │   ├── alerts.js       # Alert management
│   │   └── news.js         # News management
│   ├── server.js           # Express server setup
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── api/            # API service layer
│   │   │   ├── auth.ts     # Auth API calls
│   │   │   ├── drills.ts   # Drill API calls
│   │   │   ├── alerts.ts   # Alert API calls
│   │   │   ├── news.ts     # News API calls
│   │   │   └── types.ts    # TypeScript interfaces
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── package.json
└── package.json            # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin user
- `GET /api/auth/verify` - Verify JWT token

### Students
- `GET /api/students` - List students
- `POST /api/students` - Add new student
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Drills
- `GET /api/drills` - List drill results
- `POST /api/drills` - Save drill completion
- `GET /api/drills/stats/overview` - Drill analytics
- `GET /api/drills/student/:studentId` - Student's drill history

### Alerts
- `GET /api/alerts` - Get disaster alerts
- `GET /api/alerts/active` - Get active alerts only
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

### News
- `GET /api/news` - Get news articles
- `GET /api/news/latest` - Get latest news
- `POST /api/news` - Create news article
- `GET /api/news/categories/list` - Get news categories

## 🎯 Development

### Running Tests
```bash
# Backend tests (when implemented)
cd backend && npm test

# Frontend tests (when implemented)
cd frontend && npm test
```

### Building for Production
```bash
# Build both frontend and backend
npm run build

# Build individually
npm run build:frontend
npm run build:backend
```

### Code Quality
The project is set up with TypeScript for type safety and includes:
- ESLint configuration
- Prettier for code formatting
- Type definitions for all API responses
- Comprehensive error handling

## 🗄️ Database Schema

### Collections

#### Users (Admin)
- `username`, `passwordHash`, `role`, `lastLogin`, `isActive`

#### Students
- `name`, `class`, `rollNo`, `emergencyContact`, `drillStats`

#### Drills
- `studentId`, `drillType`, `score`, `duration`, `responses`, `status`

#### Alerts
- `type`, `title`, `message`, `region`, `severity`, `expiresAt`

#### News
- `title`, `description`, `source`, `category`, `publishedAt`

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables for production
3. Set up proper JWT secrets and security keys

### Frontend Deployment
- Deploy to Vercel, Netlify, or similar static hosting
- Configure build command: `npm run build:frontend`
- Set environment variables in hosting platform

### Backend Deployment
- Deploy to Railway, Render, Heroku, or VPS
- Configure MongoDB connection string
- Set up environment variables
- Ensure proper CORS configuration

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (NoSQL)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `/api` endpoint when server is running
- Review the code comments and TypeScript interfaces

## 🎯 Future Enhancements

- [ ] Mobile app integration
- [ ] Push notifications for alerts
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with weather APIs
- [ ] Automated drill scheduling
- [ ] Parent/guardian portal
- [ ] SMS alert system

---

**Built with ❤️ for safer educational institutions**