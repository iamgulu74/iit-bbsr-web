# Cosmic Watch - MDB5 Frontend

## Overview
This is a complete frontend rebuild using **MDB5 Standard UI Kit (Free v9.3.0)** with vanilla HTML, CSS, and JavaScript.

## Features
- ✅ **Landing Page** - Stunning hero section with feature highlights
- ✅ **Authentication** - Login & Registration pages
- ✅ **Dashboard** - Real-time statistics and asteroid overview
- ✅ **NEO Feed** - Browse and search asteroids with filtering
- ✅ **Watchlist** - Track priority Near-Earth Objects
- ✅ **Premium Design** - Glassmorphism effects and smooth animations

## Tech Stack
- **UI Framework**: MDB5 Standard (Material Design for Bootstrap 5)
- **JavaScript**: Vanilla ES6+ (No frameworks)
- **CSS**: Custom styles with MDB5 utilities
- **Icons**: Font Awesome 6

## File Structure
```
frontend-new/
├── index.html           # Landing page
├── login.html           # Login page
├── register.html        # Registration page
├── dashboard.html       # Dashboard
├── asteroids.html       # Asteroid feed
├── watchlist.html       # Watchlist
├── css/
│   ├── mdb.min.css     # MDB5 core styles
│   └── app.css         # Custom application styles
└── js/
    ├── mdb.umd.min.js  # MDB5 JavaScript
    └── app/
        ├── config.js    # API configuration
        ├── auth.js      # Authentication utilities
        ├── nav.js       # Navigation component
        ├── login.js     # Login page logic
        ├── register.js  # Register page logic
        ├── dashboard.js # Dashboard logic
        ├── asteroids.js # Asteroid feed logic
        └── watchlist.js # Watchlist logic
```

## How to Use

### Option 1: Direct Access (Recommended)
Simply open `index.html` in a web browser. The application will connect to the backend API at `http://localhost:5000/api/v1`.

### Option 2: Local Server
```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve -p 8080

# Using PHP
php -S localhost:8080
```

Then navigate to `http://localhost:8080`

## API Configuration
The backend API URL is configured in `js/app/config.js`. The default is:
```javascript
const API_BASE_URL = 'http://localhost:5000/api/v1';
```

## Pages

### Public Pages
- **/** - Landing page with hero section and feature highlights
- **/login.html** - User login
- **/register.html** - User registration

### Authenticated Pages
- **/dashboard.html** - Mission control dashboard with live stats
- **/asteroids.html** - Browse and search NEO feed
- **/watchlist.html** - Personal watchlist management

## Design Features
- **Glassmorphism Effects** - Modern frosted glass card designs
- **Gradient Buttons** - Eye-catching cosmic-themed buttons
- **Smooth Animations** - Hover effects and transitions
- **Responsive Layout** - Mobile-first Bootstrap grid
- **Dark Theme** - Space-inspired dark color palette
- **Real-time Updates** - Dynamic data loading

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Modern browsers with ES6 support

## Notes
- This is a pure HTML/CSS/JS implementation
- No build process required
- All dependencies are included via MDB5 package
- JWT token stored in localStorage for authentication

## Credits
- **UI Kit**: [MDB5 Standard UI Kit Free v9.3.0](https://mdbootstrap.com/)
- **Icons**: [Font Awesome 6](https://fontawesome.com/)
- **Backend API**: Cosmic Watch REST API
