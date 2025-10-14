# 💖 Dating App - Full Stack Application

A modern, feature-rich dating application built with React, Node.js, TypeScript, and SQL Server.

## 🌟 Features

### User Features
- ✅ **User Authentication** - Secure login/register with JWT
- ✅ **Profile Management** - Create and edit detailed profiles
- ✅ **Photo Upload** - Cloudinary integration for image storage
- ✅ **Smart Matching** - Swipe left/right to find matches
- ✅ **Real-time Chat** - Socket.io powered instant messaging
- ✅ **Likes System** - See who liked you (Premium feature)
- ✅ **Notifications** - Real-time notifications for matches and messages
- ✅ **Premium Subscriptions** - Three-tier premium plans with Stripe

### Admin Features
- ✅ **Admin Dashboard** - Comprehensive statistics and metrics
- ✅ **User Management** - Ban, unban, and delete users
- ✅ **Reports System** - Handle user reports and moderation
- ✅ **Analytics** - Advanced charts and insights with Recharts
- ✅ **Activity Logs** - Track all admin actions

### Technical Features
- ✅ **SEO Optimized** - Meta tags and Open Graph support
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✅ **TypeScript** - Type-safe code throughout
- ✅ **Real-time Updates** - Socket.io integration
- ✅ **Secure** - Password hashing, JWT authentication
- ✅ **Legal Pages** - Privacy Policy and Terms of Service

---

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Recharts** - Data visualization
- **React Helmet** - SEO management

### Backend
- **Node.js** with Express
- **TypeScript**
- **SQL Server** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Socket.io** - WebSocket server
- **Cloudinary** - Image hosting
- **Multer** - File upload handling

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- SQL Server (2019 or higher)
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/dating-app.git
cd dating-app
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

**Backend .env:**
```env
PORT=5000
DATABASE_SERVER=localhost
DATABASE_NAME=DatingAppDB
DATABASE_USER=sa
DATABASE_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

### 3. Database Setup
Open SQL Server Management Studio and run:
```sql
-- Create database
CREATE DATABASE DatingAppDB;
GO

USE DatingAppDB;
GO

-- Run all migration scripts from /backend/migrations folder
-- (Check backend/migrations/*.sql)
```

### 4. Frontend Setup
```bash
cd ../web-app
npm install
```

### 5. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd web-app
npm run dev
# App runs on http://localhost:5173
```

---

## 🎯 Usage

### User Access
1. Navigate to `http://localhost:5173`
2. Register a new account or login
3. Complete your profile
4. Start swiping and matching!

### Admin Access
1. Navigate to `http://localhost:5173/admin/login`
2. Default credentials:
   - Email: `admin@datingapp.com`
   - Password: `admin123`
3. Access dashboard, users, reports, and analytics

---

## 📁 Project Structure

```
dating-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth and validation middleware
│   │   ├── routes/         # API routes
│   │   ├── sockets/        # Socket.io handlers
│   │   ├── utils/          # Helper functions
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── migrations/         # SQL migration scripts
│   └── package.json
│
├── web-app/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin pages
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Discover.tsx
│   │   │   ├── Matches.tsx
│   │   │   └── ...
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   └── package.json
│
└── README.md
```

---

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/refresh         - Refresh JWT token
```

### Users
```
GET    /api/users/profile        - Get current user profile
PUT    /api/users/profile        - Update profile
GET    /api/users/potential      - Get potential matches
```

### Swipes & Matches
```
POST   /api/swipe                - Swipe on a user
GET    /api/matches              - Get all matches
DELETE /api/matches/:id          - Unmatch
```

### Messages
```
GET    /api/messages/:matchId    - Get conversation
POST   /api/messages             - Send message
```

### Subscriptions
```
GET    /api/subscriptions/plans  - Get premium plans
POST   /api/subscriptions/subscribe - Subscribe to plan
```

### Admin
```
POST   /api/admin/login          - Admin login
GET    /api/admin/dashboard/stats - Get dashboard stats
GET    /api/admin/users          - Get all users
GET    /api/admin/analytics      - Get analytics data
PUT    /api/admin/users/:id/ban  - Ban user
```

---

## 🎨 Features in Detail

### Swipe System
- Smooth card animations
- Left swipe = Pass
- Right swipe = Like
- Instant match notification if mutual like

### Real-time Chat
- Socket.io powered instant messaging
- Online/offline status
- Message read receipts
- Typing indicators

### Premium Features
- **Basic ($9.99/month)** - Unlimited likes
- **Plus ($19.99/month)** - See who liked you + Rewind
- **Premium ($29.99/month)** - All features + Boost

### Admin Analytics
- User growth charts
- Gender distribution
- Match statistics
- Revenue tracking
- Age demographics

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd web-app
npm run build
vercel deploy
```

### Backend (Railway/Heroku)
```bash
cd backend
# Set environment variables
# Deploy to your preferred platform
```

### Database (Azure SQL)
- Create Azure SQL Database
- Import schema from migrations
- Update connection string in .env

---

## 🔒 Security

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT authentication with refresh tokens
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Rate limiting (recommended)
- ✅ Helmet.js for security headers

---

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd web-app
npm test
```

---

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 👥 Contributors

- **Your Name** - Full Stack Developer

---

## 🐛 Known Issues

- None currently! 🎉

---

## 📞 Support

For issues, questions, or contributions:
- Email: support@datingapp.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/dating-app/issues)

---

## 🎉 Acknowledgments

- React Team
- Node.js Community
- Tailwind CSS
- Recharts
- Socket.io

---

**Made with ❤️ and ☕**
