
document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || 9090;
    localStorage.setItem('host', BACKEND_PORT);
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {

                const response = await fetch(`http://localhost:${localStorage.getItem('host')}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.status === 500) {
                    throw new Error('Nieprawidłowe dane logowania');
                } else if (!response.ok) {
                    throw new Error(`Błąd serwera: ${response.status}`);
                }

                const token = await response.text();
                localStorage.setItem('jwtToken', token);

                document.getElementById('message').textContent = "Logowanie udane!";
                document.getElementById('message').style.color = "green";

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);

            } catch (error) {
                document.getElementById('message').textContent = error.message;
                console.error('Error:', error);
            }
        });
    }

    // Obsługa rejestracji
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('newUsername').value;
            const password = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                document.getElementById('message').textContent = "Hasła nie są identyczne!";
                document.getElementById('message').style.color = "red";
                return;
            }

            try {
                const response = await fetch(`http://localhost:${localStorage.getItem('host')}/api/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Błąd rejestracji');
                }

                document.getElementById('message').textContent = "Rejestracja udana!";
                document.getElementById('message').style.color = "green";

                // Przekierowanie do logowania po rejestracji
                setTimeout(() => window.location.href = 'index.html', 1500);

            } catch (error) {
                document.getElementById('message').textContent = error.message;
                console.error('Error:', error);
            }
        });
    }

    // Przyciski nawigacyjne
    const signUpButton = document.getElementById('signUpButton');
    if (signUpButton) {
        signUpButton.addEventListener('click', () => {
            window.location.href = 'signup.html';
        });
    }

    const logInButton = document.getElementById('logInButton');
    if (logInButton) {
        logInButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});