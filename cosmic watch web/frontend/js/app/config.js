// API Configuration
// Auto-detect if running in production or locally
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `http://${window.location.hostname}:5000/api/v1`
    : `https://webcosmic1.onrender.com`; // Replace with your actual Render backend URL

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
