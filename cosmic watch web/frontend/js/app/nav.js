// Render navigation
function renderNav() {
    const navContainer = document.getElementById('mainNav');
    if (!navContainer) return;

    const user = auth.getUser();
    const isAuth = auth.isAuthenticated();

    navContainer.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top navbar-glass">
            <div class="container-fluid px-lg-5">
                <a class="navbar-brand fw-bold d-flex align-items-center" href="${isAuth ? '/dashboard.html' : '/index.html'}">
                    <i class="fas fa-meteor me-2 text-info fa-lg"></i>
                    <span class="bg-gradient-primary">Cosmic Watch</span>
                </a>
                <button class="navbar-toggler border-0" type="button" data-mdb-toggle="collapse" data-mdb-target="#navbarNav">
                    <i class="fas fa-bars fa-lg text-white"></i>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                        ${isAuth ? `
                            <li class="nav-item mx-2">
                                <a class="nav-link px-3" href="/dashboard.html">
                                    <i class="fas fa-tachometer-alt me-2 text-primary"></i>Dashboard
                                </a>
                            </li>
                            <li class="nav-item mx-2">
                                <a class="nav-link px-3" href="/asteroids.html">
                                    <i class="fas fa-satellite-dish me-2 text-success"></i>Feed
                                </a>
                            </li>
                            <li class="nav-item mx-2">
                                <a class="nav-link px-3" href="/watchlist.html">
                                    <i class="fas fa-star me-2 text-warning"></i>Watchlist
                                </a>
                            </li>
                            <li class="nav-item mx-2">
                                <a class="nav-link px-3" href="/orbit.html">
                                    <i class="fas fa-globe-americas me-2 text-info"></i>3D Orbit
                                </a>
                            </li>
                            <li class="nav-item mx-2">
                                <a class="nav-link px-3" href="/chat.html">
                                    <i class="fas fa-comments me-2 text-primary"></i>CommChat
                                </a>
                            </li>
                            <li class="nav-item dropdown mx-2 mt-2 mt-lg-0">
                                <a class="nav-link dropdown-toggle btn btn-outline-light rounded-pill px-4 py-2" href="#" role="button" data-mdb-toggle="dropdown">
                                    <i class="fas fa-user-astronaut me-2"></i>${user?.username || 'User'}
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end bg-dark border border-secondary shadow-lg mt-2">
                                    <li><a class="dropdown-item text-white py-2" href="/profile.html">
                                        <i class="fas fa-id-card me-2 text-warning"></i>Profile
                                    </a></li>
                                    <li><hr class="dropdown-divider bg-white opacity-25"></li>
                                    <li><a class="dropdown-item text-white py-2" href="#" onclick="auth.logout()">
                                        <i class="fas fa-sign-out-alt me-2 text-danger"></i>Logout
                                    </a></li>
                                </ul>
                            </li>
                        ` : `
                            <li class="nav-item mx-2">
                                <a class="nav-link px-4 fw-bold" href="/index.html">Home</a>
                            </li>
                            <li class="nav-item mx-2">
                                <a class="nav-link px-4 fw-bold" href="/login.html">Login</a>
                            </li>
                            <li class="nav-item mx-2">
                                <a class="btn btn-primary px-4 rounded-pill fw-bold shadow-4" href="/register.html">Get Started</a>
                            </li>
                        `}
                    </ul>
                </div>
            </div>
        </nav>
    `;

    // --- CUSTOM DROPDOWN HANDLER (Fix for MDB initialization issues) ---
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation(); // prevent immediate closing

            // Find the menu next to this toggle
            const menu = this.nextElementSibling;
            if (menu && menu.classList.contains('dropdown-menu')) {
                // Close all other open menus first
                document.querySelectorAll('.dropdown-menu.show').forEach(m => {
                    if (m !== menu) m.classList.remove('show');
                });

                // Toggle this one
                menu.classList.toggle('show');
                this.setAttribute('aria-expanded', menu.classList.contains('show'));
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.matches('.dropdown-toggle')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Initialize collapse for mobile menu (standard bootstrap data-api usually handles this, but just in case)
    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) {
        toggler.addEventListener('click', () => {
            const targetId = toggler.getAttribute('data-mdb-target');
            const target = document.querySelector(targetId);
            if (target) {
                target.classList.toggle('show');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', renderNav);
