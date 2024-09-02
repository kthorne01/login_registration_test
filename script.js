// script.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }
    
    const data = {
        username: username,
        password: password
    };
    
    fetch('https://your-api-gateway-endpoint/login', { // Replace with your API Gateway endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store the token securely (consider using HttpOnly cookies for better security)
            localStorage.setItem('authToken', data.token);
            alert('Login successful!');
            // Redirect to a protected page or dashboard
            // window.location.href = 'dashboard.html';
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login.');
    });
});

// Optional: Logout Functionality
function logout() {
    localStorage.removeItem('authToken');
    alert('Logged out successfully.');
    window.location.href = 'index.html';
}
