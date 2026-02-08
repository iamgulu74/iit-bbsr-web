// Asteroid Detail Page Logic
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Auth Check
    if (!auth.requireAuth()) return;

    // 2. Get ID from URL
    const params = new URLSearchParams(window.location.search);
    const nasaId = params.get('id');

    if (!nasaId) {
        showError('No Asteroid ID provided in URL');
        return;
    }

    // 3. Fetch Data
    await loadAsteroidDetails(nasaId);
});

async function loadAsteroidDetails(nasaId) {
    const loading = document.getElementById('loading');
    const content = document.getElementById('detailContent');
    const errorState = document.getElementById('errorState');

    try {
        // Use the endpoint from config
        // Note: config.endpoints.asteroids.single(id) returns the URL string
        console.log(`Fetching details for ID: ${nasaId}`);
        const asteroid = await auth.apiCall(config.endpoints.asteroids.single(nasaId));
        console.log('Detail data:', asteroid);

        // 4. Render Data
        renderDetails(asteroid);

        // Show content
        loading.classList.add('d-none');
        content.classList.remove('d-none');

    } catch (error) {
        console.error('Fetch error:', error);
        loading.classList.add('d-none');
        showError(error.message);
    }
}

function renderDetails(asteroid) {
    // Basic Info
    document.getElementById('asteroidName').textContent = asteroid.name;
    document.getElementById('asteroidId').textContent = asteroid.nasaId;

    // Hazard Badge
    const badge = document.getElementById('hazardBadge');
    if (asteroid.isPotentiallyHazardous) {
        badge.className = 'badge bg-danger rounded-pill px-4 py-2 fs-6';
        badge.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>HAZARDOUS';
    } else {
        badge.className = 'badge bg-success rounded-pill px-4 py-2 fs-6';
        badge.innerHTML = '<i class="fas fa-check-circle me-2"></i>SAFE';
    }

    // Stats
    // Diameter (average max/min or just max)
    const diameter = asteroid.estimatedDiameter.max.toFixed(3);
    document.getElementById('diameterVal').textContent = diameter;

    // Velocity & Miss Distance
    // We check closeApproachData[0] (most recent/future)
    if (asteroid.closeApproachData && asteroid.closeApproachData.length > 0) {
        // Sort by date to get the upcoming one? Usually API returns them sorted or we just take the first.
        // Let's find the one closest to now, or just the first one in the list.
        // NASA usually returns the requested date range.
        const approach = asteroid.closeApproachData[0];

        // Handle velocity format (kmph or kilometers_per_hour depending on Backend fix)
        // Backend was fixed to return kmph in relativeVelocity object
        let vel = 'N/A';
        if (approach.relativeVelocity) {
            vel = parseFloat(approach.relativeVelocity.kmph || approach.relativeVelocity.kilometers_per_hour || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
        }
        document.getElementById('velocityVal').textContent = vel;

        let miss = 'N/A';
        if (approach.missDistance) {
            miss = parseFloat(approach.missDistance.kilometers || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
        }
        document.getElementById('missDistanceVal').textContent = miss;
    }

    // Metadata
    document.getElementById('absMag').textContent = asteroid.absoluteMagnitude;
    document.getElementById('isSentry').textContent = asteroid.isSentryObject ? 'Yes' : 'No';
    document.getElementById('nasaLink').href = asteroid.nasaJplUrl;

    // Approach Table
    const tbody = document.getElementById('approachTableBody');
    tbody.innerHTML = '';

    if (asteroid.closeApproachData) {
        // Limit to 5 or so if there are many
        asteroid.closeApproachData.slice(0, 10).forEach(app => {
            const date = new Date(app.date || app.close_approach_date).toLocaleDateString();
            const vel = parseFloat(app.relativeVelocity?.kmph || app.relativeVelocity?.kilometers_per_hour || 0).toFixed(0);
            const miss = parseFloat(app.missDistance?.kilometers || 0).toFixed(0);
            const orbit = app.orbitingBody || 'Earth';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td>${vel}</td>
                <td>${miss}</td>
                <td>${orbit}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

function showError(msg) {
    const errorState = document.getElementById('errorState');
    const loading = document.getElementById('loading');
    const content = document.getElementById('detailContent');

    loading.classList.add('d-none');
    content.classList.add('d-none');
    errorState.classList.remove('d-none');

    document.getElementById('errorMessage').textContent = msg;
}
