// Register page logic
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const alertDiv = document.getElementById('registerAlert');

    if (auth.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const data = await auth.apiCall(config.endpoints.auth.register, {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });

            alertDiv.textContent = 'Registration successful! Redirecting to login...';
            alertDiv.classList.remove('d-none', 'alert-danger');
            alertDiv.classList.add('alert-success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } catch (error) {
            alertDiv.textContent = error.message || 'Registration failed. Please try again.';
            alertDiv.classList.remove('d-none', 'alert-success');
            alertDiv.classList.add('alert-danger');
        }
    });
});
