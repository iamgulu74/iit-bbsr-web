// Watchlist page logic
document.addEventListener('DOMContentLoaded', async function () {
    if (!auth.requireAuth()) return;

    await loadWatchlist();
});

async function loadWatchlist() {
    const loading = document.getElementById('loading');
    const container = document.getElementById('watchlistGrid');

    try {
        console.log('Fetching watchlist from:', config.endpoints.watchlist.get);
        const watchlist = await auth.apiCall(config.endpoints.watchlist.get);
        console.log('Watchlist data received:', watchlist);

        loading.classList.add('d-none');
        renderWatchlist(watchlist);
    } catch (error) {
        console.error('Load watchlist error:', error);
        loading.classList.add('d-none');
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="glass-card p-4 d-inline-block">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h5 class="text-white">Failed to load watchlist</h5>
                    <p class="text-white-50 mb-0">${error.message}</p>
                </div>
            </div>
        `;
    }
}

function renderWatchlist(watchlist) {
    const container = document.getElementById('watchlistGrid');

    if (watchlist.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-star fa-3x text-white-50 mb-3"></i>
                <p class="text-white-50 mb-4">Your watchlist is empty</p>
                <a href="asteroids.html" class="btn btn-cosmic">Browse Asteroids</a>
            </div>
        `;
        return;
    }

    container.innerHTML = watchlist.map(item => {
        // Backend populates 'asteroid' not 'asteroidId'
        const asteroid = item.asteroid;
        if (!asteroid) return '';

        return `
            <div class="col-md-6 col-lg-4">
                <div class="card bg-glass h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title text-white fw-bold">${asteroid.name}</h5>
                            <span class="badge badge-${asteroid.riskCategory}">${asteroid.riskCategory.toUpperCase()}</span>
                        </div>
                        
                        <div class="mb-3">
                            <div class="d-flex justify-content-between text-white-50 small mb-1">
                                <span>Risk Score</span>
                                <span class="text-white fw-bold">${asteroid.riskScore}/100</span>
                            </div>
                            <div class="progress" style="height: 6px;">
                                <div class="progress-bar bg-${asteroid.riskCategory === 'critical' ? 'danger' : asteroid.riskCategory === 'high' ? 'warning' : 'success'}" 
                                     style="width: ${asteroid.riskScore}%"></div>
                            </div>
                        </div>
                        
                        <div class="text-white-50 small mb-3">
                            <div class="mb-1">
                                <i class="fas fa-ruler-combined me-2"></i>
                                ${asteroid.estimatedDiameter.min.toFixed(3)} - ${asteroid.estimatedDiameter.max.toFixed(3)} km
                            </div>
                            <div>
                                <i class="fas fa-clock me-2"></i>
                                Added ${formatDate(item.createdAt)}
                            </div>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-light flex-grow-1" onclick="window.location.href='asteroid-detail.html?id=${asteroid.nasaId}'">
                                <i class="fas fa-info-circle me-1"></i>Details
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="removeFromWatchlist('${item._id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function removeFromWatchlist(itemId) {
    if (!confirm('Remove this asteroid from your watchlist?')) return;

    try {
        await auth.apiCall(config.endpoints.watchlist.remove(itemId), {
            method: 'DELETE'
        });

        await loadWatchlist();
    } catch (error) {
        alert('Failed to remove from watchlist: ' + error.message);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}
