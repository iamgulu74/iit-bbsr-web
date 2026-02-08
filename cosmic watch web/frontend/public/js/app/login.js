// Login page logic
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const alertDiv = document.getElementById('loginAlert');

    // Redirect if already logged in
    if (auth.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const data = await auth.apiCall(config.endpoints.auth.login, {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            auth.setToken(data.token);
            auth.setUser(data.user);

            window.location.href = 'dashboard.html';
        } catch (error) {
            alertDiv.textContent = error.message || 'Login failed. Please check your credentials.';
            alertDiv.classList.remove('d-none');
        }
    });
});
