import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                register: resolve(__dirname, 'register.html'),
                dashboard: resolve(__dirname, 'dashboard.html'),
                asteroids: resolve(__dirname, 'asteroids.html'),
                asteroidDetail: resolve(__dirname, 'asteroid-detail.html'),
                watchlist: resolve(__dirname, 'watchlist.html'),
                orbit: resolve(__dirname, 'orbit.html'),
                chat: resolve(__dirname, 'chat.html'),
                profile: resolve(__dirname, 'profile.html'),
            },
        },
    },
});
