// API Configuration
// Auto-detect if running in Docker, locally, or on Render
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// If in production or requested by user, use the Render backend URL
const RENDER_BACKEND_URL = 'https://cosmicwatch-nctg.onrender.com/api/v1';

const API_BASE_URL = isProduction
    ? RENDER_BACKEND_URL
    : `http://${window.location.hostname}:5000/api/v1`;

const config = {
    apiUrl: API_BASE_URL,
    endpoints: {
        auth: {
            register: `${API_BASE_URL}/auth/register`,
            login: `${API_BASE_URL}/auth/login`
        },
        asteroids: {
            feed: `${API_BASE_URL}/asteroids/feed`,
            single: (id) => `${API_BASE_URL}/asteroids/${id}`
        },
        watchlist: {
            get: `${API_BASE_URL}/watchlist`,
            add: `${API_BASE_URL}/watchlist`,
            remove: (id) => `${API_BASE_URL}/watchlist/${id}`
        },
        notifications: {
            get: `${API_BASE_URL}/notifications`,
            markRead: (id) => `${API_BASE_URL}/notifications/${id}/read`
        }
    }
};
