// Asteroids feed page logic
let allAsteroids = [];

document.addEventListener('DOMContentLoaded', async function () {
    if (!auth.requireAuth()) return;

    // Set default dates
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    document.getElementById('startDate').value = today.toISOString().split('T')[0];
    document.getElementById('endDate').value = nextWeek.toISOString().split('T')[0];

    await loadAsteroids();
});

async function updateDateRange() {
    await loadAsteroids();
}

function filterAsteroids(type) {
    const cards = document.querySelectorAll('.asteroid-col');

    cards.forEach(card => {
        const isHazardous = card.dataset.hazardous === 'true';

        if (type === 'all') {
            card.style.display = 'block';
        } else if (type === 'hazardous') {
            card.style.display = isHazardous ? 'block' : 'none';
        }
    });
}

async function loadAsteroids() {
    const container = document.getElementById('asteroidsGrid');
    const loading = document.getElementById('loading');

    loading.classList.remove('d-none');
    container.innerHTML = ''; // Clear current

    try {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        console.log(`Fetching asteroid feed: ${startDate} to ${endDate}`);

        // This endpoint returns complex object { element_count, near_earth_objects: [...] }
        const feedData = await auth.apiCall(`${config.endpoints.asteroids.feed}?start_date=${startDate}&end_date=${endDate}`);

        allAsteroids = feedData.near_earth_objects || [];
        console.log('Asteroids loaded:', allAsteroids.length);

        renderAsteroids(allAsteroids);
    } catch (error) {
        console.error('Load error:', error);
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
                <h3 class="text-white">System Error</h3>
                <p class="text-white-50">${error.message}</p>
            </div>
        `;
    } finally {
        loading.classList.add('d-none');
    }
}

function renderAsteroids(asteroids) {
    const container = document.getElementById('asteroidsGrid');

    if (asteroids.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-satellite-dish fa-3x text-white-50 mb-3"></i>
                <h3 class="text-white">No Objects Found</h3>
                <p class="text-white-50">Try requesting a different date range.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = asteroids.map(asteroid => {
        const isHaz = asteroid.isPotentiallyHazardous;
        const riskColor = isHaz ? 'danger' : 'success';
        const glowClass = isHaz ? 'card-glow-danger' : 'card-glow-success';
        const titleGlow = isHaz ? 'glow-text-danger' : 'glow-text-success';
        const diameter = asteroid.estimatedDiameter.max.toFixed(3);

        return `
        <div class="col-md-6 col-lg-4 asteroid-col" data-hazardous="${isHaz}">
            <div class="glass-card h-100 asteroid-card position-relative ${glowClass}" 
                 onclick="window.location.href='asteroid-detail.html?id=${asteroid.nasaId}'">
                <div class="p-4">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="d-flex align-items-center">
                            <div class="p-2 rounded-circle bg-${riskColor} bg-opacity-10 text-${riskColor} me-3" 
                                 style="box-shadow: 0 0 15px rgba(${isHaz ? '239, 68, 68' : '16, 185, 129'}, 0.2)">
                                <i class="fas ${isHaz ? 'fa-meteor' : 'fa-star'}"></i>
                            </div>
                            <div>
                                <h5 class="fw-bold text-white mb-0 ${titleGlow}">${asteroid.name}</h5>
                                <small class="text-white-50">ID: ${asteroid.nasaId}</small>
                            </div>
                        </div>
                        <span class="badge bg-${riskColor} rounded-pill px-3 shadow-sm">${isHaz ? 'HAZARDOUS' : 'SAFE'}</span>
                    </div>

                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <div class="p-2 border border-secondary rounded bg-dark bg-opacity-25">
                                <small class="d-block text-white-50">Diameter</small>
                                <strong class="text-white">${diameter} km</strong>
                            </div>
                        </div>
                        <div class="col-6">
                             <div class="p-2 border border-secondary rounded bg-dark bg-opacity-25">
                                <small class="d-block text-white-50">Magnitude</small>
                                <strong class="text-white">${asteroid.absoluteMagnitude} H</strong>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary">
                        <small class="text-info"><i class="fas fa-calendar-alt me-2"></i>Close Approach</small>
                        <i class="fas fa-chevron-right text-white-50"></i>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}
