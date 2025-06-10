document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    console.log('=== DEBUG ADMIN.JS ===');
    console.log('Token:', token);
    console.log('Token length:', token ? token.length : 'null');
    console.log('localStorage keys:', Object.keys(localStorage));
    console.log('All localStorage:', localStorage);
    if (!token) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    const baseUrl = `api/sensor`;

    // Funkcja pomocnicza do tworzenia nagłówków z autoryzacją
    function getAuthHeaders() {
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Funkcja pomocnicza do obsługi błędów autoryzacji
    function handleAuthError(response) {
        if (response.status === 401 || response.status === 403) {
            console.log('Token wygasł lub jest nieprawidłowy');
            localStorage.removeItem('jwtToken');
            window.location.href = 'index.html';
            return true;
        }
        return false;
    }

    window.getSensor = async function() {
        try {
            const name = document.getElementById('getName').value;
            const res = await fetch(`${baseUrl}/${encodeURIComponent(name)}`, {
                headers: getAuthHeaders()
            });

            if (handleAuthError(res)) return;

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            document.getElementById('responseArea').textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Błąd pobierania sensora:', error);
            document.getElementById('responseArea').textContent = `Błąd: ${error.message}`;
        }
    }

    window.addSensor = async function() {
        try {
            const dto = {
                name: document.getElementById('addName').value,
                ipAddress: document.getElementById('addIP').value,
                macAddress: document.getElementById('addMAC').value,
                active: document.getElementById('addActive').checked
            };

            const res = await fetch(baseUrl, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(dto)
            });

            if (handleAuthError(res)) return;

            const text = await res.text();
            document.getElementById('responseArea').textContent = text;
        } catch (error) {
            console.error('Błąd dodawania sensora:', error);
            document.getElementById('responseArea').textContent = `Błąd: ${error.message}`;
        }
    }

    window.deleteSensor = async function() {
        try {
            const name = document.getElementById('delName').value;
            // POPRAWKA: Dodaj /delete do URL
            const res = await fetch(`${baseUrl}/delete/${encodeURIComponent(name)}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (handleAuthError(res)) return;

            const text = await res.text();
            document.getElementById('responseArea').textContent = text;
        } catch (error) {
            console.error('Błąd usuwania sensora:', error);
            document.getElementById('responseArea').textContent = `Błąd: ${error.message}`;
        }
    }

    window.updateSensor = async function() {
        try {
            const oldName = document.getElementById('oldName').value;
            const newName = document.getElementById('newName').value;

            // POPRAWKA: Dodaj /update do URL i popraw strukturę body
            const res = await fetch(`${baseUrl}/update/${encodeURIComponent(oldName)}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ value: newName }) // Zmiana: używaj 'value' zamiast 'newName'
            });

            if (handleAuthError(res)) return;

            const text = await res.text();
            document.getElementById('responseArea').textContent = text;
        } catch (error) {
            console.error('Błąd aktualizacji sensora:', error);
            document.getElementById('responseArea').textContent = `Błąd: ${error.message}`;
        }
    }

    window.addFavoriteLocation = async function() {
        const name = document.getElementById('favSensorName').value;
        const location = document.getElementById('favLocation').value;

        fetch(`/api/sensors/${encodeURIComponent(name)}/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location })
        })
            .then(res => res.json())
            .then(data => {
                document.getElementById('responseArea').textContent = JSON.stringify(data, null, 2);
            })
            .catch(err => {
                document.getElementById('responseArea').textContent = 'Error: ' + err;
            });
    }

    window.removeFavoriteLocation = async function() {
        const name = document.getElementById('favSensorName').value;
        const location = document.getElementById('favLocation').value;

        fetch(`/api/sensors/${encodeURIComponent(name)}/favorites`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location })
        })
            .then(res => res.json())
            .then(data => {
                document.getElementById('responseArea').textContent = JSON.stringify(data, null, 2);
            })
            .catch(err => {
                document.getElementById('responseArea').textContent = 'Error: ' + err;
            });
    }


    const wizButton = document.getElementById('wizBtn');
    if (wizButton) {
        wizButton.addEventListener('click', () => {
            console.log("przejście do dashboard");
            window.location.href = 'dashboard.html';
        });
    }

    const logOut = document.getElementById('logOut');
    if (logOut) {
        logOut.addEventListener('click', () => {
            console.log("wylogowanie");
            localStorage.removeItem('jwtToken');
            window.location.href = 'index.html';
        });
    }
});