// Updated login event handler with API integration
// Replace lines 1819-1837 in main.js with this code

loginBtn?.addEventListener('click', async () => {
    const userId = userIdInput?.value;
    const password = passwordInput?.value;

    if (!userId || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    // Disable button during login
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';

    try {
        // Call backend API for authentication
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, password })
        });

        const data = await response.json();

        if (data.success && data.user) {
            // Authentication successful
            currentUser = {
                userId: data.user.userId,
                role: data.user.role,
                name: data.user.name,
                access: data.user.access
            };
            currentPage = currentUser.access[0];
            showToast(`Welcome, ${currentUser.name}!`);
            render();
        } else {
            // Authentication failed
            showToast(data.message || 'Invalid credentials', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Unable to connect to server', 'error');
    } finally {
        // Re-enable button
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';
    }
});
