// Authentication utilities
const auth = {
    getToken() {
        return localStorage.getItem('token');
    },

    setToken(token) {
        localStorage.setItem('token', token);
    },

    removeToken() {
        localStorage.removeItem('token');
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    removeUser() {
        localStorage.removeItem('user');
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    logout() {
        this.removeToken();
        this.removeUser();
        window.location.href = 'index.html';
    },

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    async login(email, password) {
        try {
            const response = await fetch(config.endpoints.auth.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            this.setToken(data.token);
            this.setUser(data.user);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(displayName, email, password) {
        try {
            const response = await fetch(config.endpoints.auth.register, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ displayName, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            this.setToken(data.token);
            this.setUser(data.user);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async apiCall(url, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (response.status === 401) {
                this.logout();
                throw new Error('Unauthorized');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    },

    async socialLogin(provider) {
        console.log(`Starting ${provider} authentication...`);

        // In a real app, this would redirect to Google/GitHub OAuth URLs
        // For this demo, we simulate a successful handshake
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    id: 'social_' + Math.random().toString(36).substr(2, 9),
                    email: `explorer@${provider}.com`,
                    displayName: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Explorer`,
                    isGuest: true
                };

                // Simulate receiving a token from our backend after OAuth redirect
                const mockToken = 'mock_social_token_' + btoa(JSON.stringify(mockUser));

                this.setToken(mockToken);
                this.setUser(mockUser);

                window.location.href = 'dashboard.html';
                resolve(true);
            }, 1500);
        });
    }
};
