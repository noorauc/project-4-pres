const API_URL = "http://localhost:5000/api";

function toggleModal() {
    const modal = document.getElementById('authModal');
    modal.classList.toggle('hidden');
}

// INTEGRATION: Login now connects to the Backend API
async function handleLogin() {
    const email = document.getElementById('userEmail').value;
    if(!email.includes('@')) return alert("Please enter a valid email.");

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: email.split('@')[0], 
                email: email, 
                password: "password123" 
            })
        });
        const data = await response.json();
        if(data.token) {
            localStorage.setItem('tm_token', data.token);
            document.getElementById('navActions').innerHTML = `<span class='text-sm font-bold text-[#c5a36c]'>Premium Member: ${data.user.username}</span>`;
            toggleModal();
        }
    } catch (error) {
        alert("Backend not responding. Make sure your server is running!");
    }
}

// INTEGRATION: runDiscovery now fetches from MongoDB via the API
async function runDiscovery() {
    const country = document.getElementById('countrySelect').value;
    if(!country) return alert("Please select a destination");

    try {
        const response = await fetch(`${API_URL}/destinations`);
        const allDestinations = await response.json();
        const data = allDestinations.find(d => d.id === country);

        if (data) {
            const area = document.getElementById('resultsArea');
            document.getElementById('resultImg').src = data.img;
            document.getElementById('resultTitle').innerText = data.title;
            document.getElementById('resultDesc').innerText = data.desc;
            document.getElementById('resultTag').innerText = data.weather;
            document.getElementById('resDining').innerText = data.dining;
            document.getElementById('resSeason').innerText = data.season;

            area.style.display = 'block';
            area.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error("API Error:", error);
        alert("Failed to fetch data from the server.");
    }
}