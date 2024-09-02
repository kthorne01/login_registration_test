//  register.js
// user registration by sending the username and password to the backend

document.getElementById('registerForm').addEventListener('submit', function(event) {
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
    
    fetch('https://tqbcrvfn6i.execute-api.us-east-1.amazonaws.com/prod/register', { // Replace with your API Gateway endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful! Please log in.');
            window.location.href = 'index.html';
        } else {
            alert('Registration failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during registration.');
    });
});
