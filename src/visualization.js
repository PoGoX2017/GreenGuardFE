import ApexCharts from 'apexcharts';
document.addEventListener('DOMContentLoaded',  () => {
    let chart;
    let refreshInterval;
    const token = localStorage.getItem('jwtToken');
    console.log('=== DEBUG VISUALIZATION.JS ===');
    console.log('Token:', token);
    console.log('Token length:', token ? token.length : 'null');
    if (!token) {
        window.location.href = 'index.html';
    }
    function initChart() {
        return new ApexCharts(document.getElementById('Chart'), {
            chart: {
                type: 'line',
                height: '100%',
                animations: {
                    enabled: false
                },
                toolbar: {
                    show: true,
                    tools: {
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true
                    }
                }
            },
            series: [
                {
                    name: 'Temperatura (°C)',
                    data: []
                },
                {
                    name: 'Wilgotność (%)',
                    data: []
                }
            ],
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    format: 'dd.MM HH:mm'
                },
                title: {
                    text: 'Czas'
                }
            },
            yaxis: [
                {
                    title: {
                        text: 'Temperatura (°C)'
                    },
                    min: -15,
                    max: 40
                },
                {
                    opposite: true,
                    title: {
                        text: 'Wilgotność (%)'
                    },
                    min: 0,
                    max: 100
                }
            ],
            tooltip: {
                shared: true,
                x: {
                    format: 'dd.MM.yyyy HH:mm'
                }
            },
            legend: {
                position: 'top'
            },
            colors: ['#FF4560', '#008FFB']
        });
    }

    function getFilters() {
        const formData = new FormData(document.getElementById('filterForm'));
        return {
            sensorName: formData.get('sensorName') || null,
            temperatureFrom: formData.get('tempFrom') ? parseFloat(formData.get('tempFrom')) : null,
            temperatureTo: formData.get('tempTo') ? parseFloat(formData.get('tempTo')) : null,
            humidityFrom: formData.get('humidFrom') ? parseFloat(formData.get('humidFrom')) : null,
            humidityTo: formData.get('humidTo') ? parseFloat(formData.get('humidTo')) : null,
            dateFrom: formData.get('dateFrom') ? new Date(formData.get('dateFrom')).toISOString() : null,
            dateTo: formData.get('dateTo') ? new Date(formData.get('dateTo')).toISOString() : null,
            locationName: formData.get('location') || null
        };
    }
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('pl-PL');
    }


    function updateLastReading(reading) {
        const lastRecordElement = document.getElementById('lastRecord');
        if (reading) {
            lastRecordElement.innerHTML = `
                Ostatni Pomiar: 
                <strong>${reading.temperature}°C</strong> / 
                <strong>${reading.humidity}%</strong><br>
                <small>${formatDate(reading.timestamp)}</small>
            `;
        } else {
            lastRecordElement.textContent = 'Brak danych do wyświetlenia';
        }
    }


    async function fetchData() {
        try {
            const filters = getFilters();
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== null && value !== '') {

                    params.append(key, value);
                }
            });

            const response = await fetch(`http://localhost:${localStorage.getItem('host')}/api/reading?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Błąd pobierania danych');
            const readings = await response.json();


            const lastResponse = await fetch(`http://localhost:${localStorage.getItem('host')}/api/reading/last?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const lastReading = lastResponse.ok ? await lastResponse.json() : null;

            return {readings, lastReading};
        } catch (error) {
            console.error('Błąd:', error);
            throw error;
        }
    }


    function updateChart(readings) {
        readings.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        const grouped = new Map();

        for (const r of readings) {
            const ts = new Date(r.timestamp).getTime();
            if (!grouped.has(ts)) {
                grouped.set(ts, {
                    count: 1,
                    tempSum: r.temperature,
                    humidSum: r.humidity
                });
            } else {
                const entry = grouped.get(ts);
                entry.count++;
                entry.tempSum += r.temperature;
                entry.humidSum += r.humidity;
            }
        }

        const temperatureData = [];
        const humidityData = [];

        for (const [ts, {count, tempSum, humidSum}] of grouped.entries()) {
            temperatureData.push({x: ts, y: (tempSum / count).toFixed(2)});
            humidityData.push({x: ts, y: (humidSum / count).toFixed(2)});
        }
        temperatureData.sort((a, b) => a.x - b.x);
        humidityData.sort((a, b) => a.x - b.x);

        chart.updateSeries([
            {
                name: 'Temperatura (°C)',
                data: temperatureData
            },
            {
                name: 'Wilgotność (%)',
                data: humidityData
            }
        ]);
    }


    async function updateAllData() {
        try {
            const {readings, lastReading} = await fetchData();

            if (!chart) {
                chart = initChart();
                chart.render();
            }

            updateChart(readings);
            updateLastReading(lastReading);
            await updateFavoritesList(true);


            if (refreshInterval) clearInterval(refreshInterval);
            refreshInterval = setInterval(updateAllData, 30000);

        } catch (error) {
            document.getElementById('lastRecord').textContent = 'Błąd ładowania danych';
            console.error('Error:', error);
        }
    }


    document.getElementById('filterForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateAllData();
    });


    document.getElementById('resetBtn').addEventListener('click', () => {
        document.getElementById('filterForm').reset();
        updateFavoritesList();
        updateAllData();
    });

    const confButton = document.getElementById('confBtn');
    if (confButton) {
        confButton.addEventListener('click', () => {
            console.log("sensory")
            window.location.href = 'sensor-menagment.html';
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

    async function downloadFavoritesLocation() {
        const response = await fetch(`http://localhost:${localStorage.getItem('host')}/api/reading/favorite-locations`, {
            headers: {'Authorization': `Bearer ${token}`},
        });
        if (!response.ok) {
            throw new Error('Failed to fetch favorite locations');
        }
        const tempR = await response.json();
        return new Set(tempR.map(item => item.locationName));
    }

    let lastUpdateId = 0;

    let favoritesUpdateTimeout;

    async function updateFavoritesList(force = false) {

        clearTimeout(favoritesUpdateTimeout);

        if (!force) {
            favoritesUpdateTimeout = setTimeout(() => {
                updateFavoritesList(true);
            }, 500);
            return;
        }
        const currentUpdateId = ++lastUpdateId;
        let uniqueLocations;

        try {
            uniqueLocations = await downloadFavoritesLocation();

            if (currentUpdateId !== lastUpdateId) {
                console.log('Pomijam przestarzałą aktualizację ulubionych');
                return;
            }

            console.log("przed update");
            await updateList(uniqueLocations);
        } catch (error) {
            console.error('Błąd pobierania ulubionych lokalizacji:', error);
        }
    }


    async function updateList(locationsSet) {
        const container = document.getElementById("listOfF");

        container.innerHTML = "";
        console.log("set")
        console.log(locationsSet)

        const locations = Array.from(locationsSet);
        console.log("Arr")
        console.log(locations)

        const updatePromises = locations.map(async locationName => {
            try {
                const params = new URLSearchParams();
                params.append("locationName", locationName);

                const response = await fetch(`http://localhost:${localStorage.getItem('host')}/api/reading/last?${params.toString()}`, {
                    headers: {'Authorization': `Bearer ${token}`}
                });

                if (!response.ok) return null;

                const rawData = await response.json();
                const singleData = Array.isArray(rawData) ? rawData[0] : rawData;

                return {
                    location: locationName,
                    data: singleData
                };
            } catch (error) {
                console.error(`Błąd dla lokacji ${locationName}:`, error);
                return null;
            }
        });

        const results = await Promise.all(updatePromises);

        const validResults = results.filter(r => r && r.data);

        validResults.sort((a, b) => a.location.localeCompare(b.location));

        validResults.forEach(item => {
            const row = document.createElement("div");
            row.className = "locGrid";
            row.id = `${item.location}`;

            const locationElement = document.createElement("h5");
            locationElement.textContent = item.location;

            const temperatureElement = document.createElement("h5");
            temperatureElement.innerHTML =
                `${item.data.temperature}&#8451; ${item.data.humidity}%`;
            temperatureElement.className = "values";

            const button = document.createElement("button");
            button.textContent = "Historia";
            button.dataset.location = item.location;

            row.appendChild(locationElement);
            row.appendChild(temperatureElement);
            row.appendChild(button);
            container.appendChild(row);
        });
    }
    document.getElementById('listOfF').addEventListener('click', async (e) => {
        const button = e.target.closest('button[data-location]');
        if (!button) return;

        const location = button.dataset.location;
        //const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

        console.log("Kliknięto lokalizację:", location);

        document.getElementById('location').value = location;

        //document.getElementById('dateFrom').value = yesterday.toISOString().slice(0, 16);

        const params = new URLSearchParams();
        //params.append("dateFrom", yesterday.toISOString());
        params.append("locationName", location);

        const response = await fetch(`http://localhost:${localStorage.getItem('host')}/api/reading?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Błąd pobierania danych');
        const readingsloc = await response.json();
        updateChart(readingsloc);

    });

    console.log("test");
     updateAllData();
});