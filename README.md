# 🔄 SwapIn - Item Swapping Platform

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10.0-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive item swapping platform with advanced features, AI integration, and enterprise-level backend. Built with React, Firebase, and modern web technologies.

## 🚀 Live Demo

[View Live Application](https://your-app-url.firebaseapp.com)

## ✨ Features

### 🔐 Authentication & Security
- **Multi-provider Authentication** (Email + Google OAuth)
- **User Verification System** with trust scoring
- **Advanced Security** with rate limiting
- **Firestore Security Rules** for data protection

### 🛍️ Core Functionality
- **Item Listings** with categories and conditions
- **Real-time Chat System** for user communication
- **Shopping Cart** with full functionality
- **Wishlist Management** with backend integration
- **Exchange Proposals** with status tracking
- **Delivery Tracking** and management

### 🎨 User Experience
- **Responsive Design** for all devices
- **Toast Notifications** for user feedback
- **Real-time Updates** across the platform
- **Professional UI/UX** with modern design
- **Loading States** and error handling

### 📊 Analytics & Management
- **User Analytics Dashboard** with statistics
- **Notification System** with multiple channels
- **Settings Management** with security features
- **Location Management** for delivery addresses

## 🏗️ Technology Stack

### Frontend
- **React 19.1.0** - Modern UI framework
- **React Router DOM 7.7.0** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **React Icons 5.5.0** - Icon library
- **Firebase 11.10.0** - Backend services

### Backend
- **Firebase Cloud Functions** - Serverless backend
- **Firestore** - NoSQL database
- **Firebase Authentication** - User management
- **Firebase Storage** - File storage
- **TypeScript** - Type-safe development

### Development Tools
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **ESLint** - Code linting
- **Jest** - Testing framework

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase CLI
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/swapin.git
   cd swapin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   ```bash
   # Install Firebase CLI globally
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase project
   firebase init
   ```

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. **Start development server**
   ```bash
   npm start
   ```

## 🚀 Deployment

### Firebase Hosting (Recommended)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Application pages
├── services/           # API and service layer
├── contexts/           # React contexts
├── styles/             # CSS and styling
└── utils/              # Utility functions

functions/              # Firebase Cloud Functions
├── src/               # TypeScript source
└── package.json       # Backend dependencies

public/                # Static assets
dataconnect/           # Data connectivity
```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication, Firestore, Storage, and Functions
3. Configure security rules
4. Set up hosting

### Environment Variables
- `REACT_APP_FIREBASE_*` - Firebase configuration
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_GOOGLE_CLIENT_ID` - Google OAuth client ID

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📚 API Documentation

The application includes comprehensive API documentation in the `API_DOCUMENTATION.md` file.

### Key Endpoints
- `/api/users` - User management
- `/api/items` - Item listings
- `/api/exchanges` - Exchange proposals
- `/api/chat` - Real-time messaging
- `/api/notifications` - User notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/swapin/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/swapin/discussions)

## 🗺️ Roadmap

- [ ] Mobile app development
- [ ] Advanced AI recommendations
- [ ] Payment integration
- [ ] Social features
- [ ] Multi-language support
- [ ] Advanced analytics

## 🙏 Acknowledgments

- Firebase team for the excellent platform
- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- All contributors and supporters

---

**Built with ❤️ using React, Firebase, and modern web technologies**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/swapin.svg?style=social&label=Star)](https://github.com/yourusername/swapin)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/swapin.svg?style=social&label=Fork)](https://github.com/yourusername/swapin)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/swapin.svg)](https://github.com/yourusername/swapin/issues)
