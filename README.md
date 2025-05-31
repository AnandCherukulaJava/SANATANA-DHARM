# SANATANA-DHARM Application

A comprehensive web and mobile application built with React and React Native, featuring authentication, user management, and admin dashboard functionality.

## 🚀 Features

### Authentication
- **Login** - User authentication with JWT tokens
- **Sign Up** - User registration with email verification
- **Forgot Password** - Password reset via email
- **Email Verification** - Account verification system
- **Token Refresh** - Automatic token refresh for seamless experience

### User Features
- **User Dashboard** - Personal dashboard with profile information
- **Profile Management** - View and update user profile
- **Secure API Integration** - All API calls secured with JWT authentication

### Admin Features
- **Admin Dashboard** - Comprehensive admin panel
- **User Management** - Enable/disable users, view user details
- **Role Management** - Manage user roles and permissions
- **System Statistics** - View system-wide statistics and metrics

## 🏗️ Architecture

### Technology Stack
- **Frontend Web**: React 19, Redux Toolkit, React Router
- **Frontend Mobile**: React Native, Redux Toolkit, React Navigation
- **State Management**: Redux with Redux Thunk
- **HTTP Client**: Axios with interceptors
- **Build Tools**: Webpack, Babel
- **Styling**: CSS-in-JS (Styled Components approach)

### Project Structure
```
SANATANA-DHARM/
├── web-app/                 # React Web Application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── webpack.config.js   # Webpack configuration
│   ├── babel.config.js     # Babel configuration
│   └── package.json
├── mobile-app/             # React Native Mobile Application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── screens/        # Screen components
│   │   ├── store/          # Redux store and slices
│   │   ├── services/       # API services
│   │   └── navigation/     # Navigation configuration
│   ├── App.js             # Main app component
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- For mobile development: React Native CLI, Android Studio/Xcode

### Web Application Setup

1. **Navigate to web-app directory**
   ```bash
   cd web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   The web application will be available at `http://localhost:12000`

4. **Build for production**
   ```bash
   npm run build
   ```

### Mobile Application Setup

1. **Navigate to mobile-app directory**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Metro bundler**
   ```bash
   npm start
   ```

4. **Run on Android**
   ```bash
   npm run android
   ```

5. **Run on iOS**
   ```bash
   npm run ios
   ```

## 🔧 Configuration

### API Configuration
The applications are configured to use the API at:
```
https://work-1-nedwsbjkdouwcmux.prod-runtime.all-hands.dev/api
```

### Environment Variables
You can customize the API base URL by modifying the `API_BASE_URL` constant in:
- Web: `src/services/api.js`
- Mobile: `src/services/api.js`

## 📱 Available Screens/Pages

### Web Application
- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Forgot password page
- `/reset-password` - Password reset page
- `/verify-email` - Email verification page
- `/dashboard` - User dashboard (protected)
- `/admin` - Admin dashboard (admin only)

### Mobile Application
- **LoginScreen** - User authentication
- **SignUpScreen** - User registration
- **ForgotPasswordScreen** - Password reset
- **DashboardScreen** - User dashboard

## 🔐 Authentication Flow

1. **Registration**: User creates account → Email verification sent → Account activated
2. **Login**: User provides credentials → JWT tokens issued → Access granted
3. **Token Refresh**: Automatic token refresh on expiry
4. **Logout**: Tokens cleared → Redirect to login

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Purple gradient theme (#667eea to #764ba2)
- **Typography**: Clean, modern fonts with proper hierarchy
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: Proper contrast ratios and semantic HTML

### Components
- **Layout**: Consistent header and navigation
- **Forms**: Styled form inputs with validation
- **Buttons**: Interactive buttons with hover states
- **Cards**: Information display cards
- **Loading States**: Spinner components for async operations
- **Error Handling**: User-friendly error messages

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal
- **Protected Routes**: Route-level access control
- **Role-Based Access**: Admin and user role separation
- **API Security**: Request/response interceptors
- **Input Validation**: Client-side form validation

## 📊 Redux Store Structure

### Auth Slice
- User authentication state
- Login/logout actions
- Token management
- Error handling

### User Slice (Web)
- User profile data
- Dashboard information
- User-specific actions

### Admin Slice (Web)
- Admin dashboard data
- User management actions
- Role management
- System statistics

## 🚀 Deployment

### Web Application
The web application is configured to run on port 12000 with CORS enabled for the specified runtime environment.

### Mobile Application
Follow standard React Native deployment procedures for iOS App Store and Google Play Store.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please refer to the API documentation at:
https://work-1-nedwsbjkdouwcmux.prod-runtime.all-hands.dev/api/swagger-ui/index.html

---

**Built with ❤️ for the SANATANA-DHARM community**