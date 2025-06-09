document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
       window.location.href = 'index.html';
    }
    const baseUrl = `http://localhost:${localStorage.getItem('host')}/api/sensor`;

    window.getSensor = async function() {
        const name = document.getElementById('getName').value;
        const res = await fetch(`${baseUrl}/${encodeURIComponent(name)}`);
        const data = await res.json();
        document.getElementById('responseArea').textContent = JSON.stringify(data, null, 2);
    }

    window.addSensor = async function() {
        const dto = {
            name: document.getElementById('addName').value,
            ipAddress: document.getElementById('addIP').value,
            macAddress: document.getElementById('addMAC').value,
            active: document.getElementById('addActive').checked
        };
        const res = await fetch(baseUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dto)
        });
        const text = await res.text();
        document.getElementById('responseArea').textContent = text;
    }

    window.deleteSensor = async function() {
        const name = document.getElementById('delName').value;
        const res = await fetch(`${baseUrl}/${encodeURIComponent(name)}`, {
            method: 'DELETE'
        });
        const text = await res.text();
        document.getElementById('responseArea').textContent = text;
    }

    window.updateSensor = async function() {
        const oldName = document.getElementById('oldName').value;
        const newName = document.getElementById('newName').value;
        const res = await fetch(`${baseUrl}/${encodeURIComponent(oldName)}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({newName})
        });
        const text = await res.text();
        document.getElementById('responseArea').textContent = text;
    }

    const wizButton = document.getElementById('wizBtn');
    if (wizButton) {
        wizButton.addEventListener('click', () => {
            console.log("sensory")
            window.location.href = 'dashboard.html';
        });
    }
    const logOut = document.getElementById('logOut');
    if (logOut) {
        logOut.addEventListener('click', () => {
            console.log("sensory")
            localStorage.removeItem('jwtToken');
            window.location.href = 'index.html';
        });
    }
});
