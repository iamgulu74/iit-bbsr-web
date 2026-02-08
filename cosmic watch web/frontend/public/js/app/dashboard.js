// Dashboard page logic
document.addEventListener('DOMContentLoaded', async function () {
    if (!auth.requireAuth()) return;

    await loadDashboardData();
});

async function loadDashboardData() {
    try {
        // Fetch asteroids data
        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        console.log('Fetching asteroid feed from:', `${config.endpoints.asteroids.feed}?start_date=${startDate}&end_date=${endDate}`);

        const feedData = await auth.apiCall(`${config.endpoints.asteroids.feed}?start_date=${startDate}&end_date=${endDate}`);
        console.log('Feed data received:', feedData);

        const asteroids = feedData.near_earth_objects || [];
        console.log('Total asteroids:', asteroids.length);

        // Update stats
        document.getElementById('totalCount').textContent = asteroids.length;
        document.getElementById('hazardousCount').textContent = asteroids.filter(a => a.isPotentiallyHazardous).length;

        // Load watchlist count
        try {
            const watchlist = await auth.apiCall(config.endpoints.watchlist.get);
            document.getElementById('watchlistCount').textContent = watchlist.length;
            renderWatchlistPreview(watchlist.slice(0, 5));
        } catch (error) {
            console.log('Watchlist error:', error);
            document.getElementById('watchlistCount').textContent = '0';
            renderWatchlistPreview([]);
        }

        // Load notifications
        try {
            const notifications = await auth.apiCall(config.endpoints.notifications.get);
            document.getElementById('alertCount').textContent = notifications.length;
            renderNotifications(notifications.slice(0, 5));
        } catch (error) {
            console.log('Notifications error:', error);
            document.getElementById('alertCount').textContent = '0';
            renderNotifications([]);
        }

        // Render approaching asteroids
        renderApproachingAsteroids(asteroids.slice(0, 10));
    } catch (error) {
        console.error('Dashboard load error:', error);
        document.getElementById('approachingList').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Failed to load asteroid data. Error: ${error.message}
                <br><small>Please check if the backend server is running on ${config.apiUrl}</small>
            </div>
        `;
        document.getElementById('totalCount').textContent = '0';
        document.getElementById('hazardousCount').textContent = '0';
    }
}

function renderApproachingAsteroids(asteroids) {
    const container = document.getElementById('approachingList');

    if (asteroids.length === 0) {
        container.innerHTML = '<p class="text-center text-white-50 py-4">No approaching asteroids in the next 7 days</p>';
        return;
    }

    container.innerHTML = asteroids.map(asteroid => `
        <div class="asteroid-card bg-glass rounded-3 p-3 mb-3" onclick="window.location.href='asteroid-detail.html?id=${asteroid.nasaId}'">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="fw-bold text-white mb-1">${asteroid.name}</h6>
                    <small class="text-white-50">
                        <i class="fas fa-ruler-combined me-1"></i>
                        ${asteroid.estimatedDiameter.min.toFixed(3)} - ${asteroid.estimatedDiameter.max.toFixed(3)} km
                    </small>
                </div>
                <div class="text-end">
                    <span class="badge badge-${asteroid.riskCategory} mb-1">${asteroid.riskCategory.toUpperCase()}</span>
                    <br>
                    <small class="text-white-50">Score: ${asteroid.riskScore}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function renderWatchlistPreview(watchlist) {
    const container = document.getElementById('watchlistPreview');

    if (watchlist.length === 0) {
        container.innerHTML = '<p class="text-center text-white-50 small py-2">Your watchlist is empty</p>';
        return;
    }

    container.innerHTML = watchlist.map(item => `
        <div class="notification-item">
            <div class="d-flex align-items-center">
                <i class="fas fa-star text-warning me-2"></i>
                <div class="flex-grow-1">
                    <small class="text-white">${item.asteroid?.name || 'Unknown'}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function renderNotifications(notifications) {
    const container = document.getElementById('notificationsList');

    if (notifications.length === 0) {
        container.innerHTML = '<p class="text-center text-white-50 small py-2">No notifications</p>';
        return;
    }

    container.innerHTML = notifications.map(notif => `
        <div class="notification-item ${!notif.isRead ? 'notification-unread' : ''}">
            <div class="d-flex align-items-start">
                <i class="fas ${getNotificationIcon(notif.type)} text-info me-2 mt-1"></i>
                <div class="flex-grow-1">
                    <small class="text-white d-block">${notif.message}</small>
                    <small class="text-white-50">${formatDate(notif.createdAt)}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function getNotificationIcon(type) {
    const icons = {
        'approaching_asteroid': 'fa-meteor',
        'new_hazardous': 'fa-exclamation-triangle',
        'watchlist_update': 'fa-star'
    };
    return icons[type] || 'fa-bell';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
}
