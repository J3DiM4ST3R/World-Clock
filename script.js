const cities = [
  { name: "New York", timeZone: "America/New_York", lat: 40.7128, lon: -74.0060, },
  { name: "London", timeZone: "Europe/London", lat: 51.5074, lon: -0.1278, },
  { name: "Tokyo", timeZone: "Asia/Tokyo", lat: 35.6895, lon: 139.6917, },
  { name: "Moscow", timeZone: "Europe/Moscow", lat: 55.7558, lon: 37.6173, },
  { name: "Los Angeles", timeZone: "America/Los_Angeles", lat: 34.0522, lon: -118.2437, },
  { name: "Paris", timeZone: "Europe/Paris", lat: 48.8566, lon: 2.3522, },
];

const clocksContainer = document.getElementById("clocks");

function createClock(city) {
  const wrapper = document.createElement("div");
  wrapper.className = "clock";

  const cityLabel = document.createElement("div");
  cityLabel.className = "city";
  cityLabel.textContent = city.name;

  const timeDisplay = document.createElement("div");
  timeDisplay.className = "time";
  timeDisplay.id = `clock-${city.name.replace(/\s+/g, "-")}`;

  const weatherDisplay = document.createElement("div");
  weatherDisplay.className = "weather";
  weatherDisplay.id = `weather-${city.name.replace(/\s+/g, "-")}`;

  wrapper.appendChild(cityLabel);
  wrapper.appendChild(timeDisplay);
  wrapper.appendChild(weatherDisplay);
  clocksContainer.appendChild(wrapper);
}

function updateClocks() {
  const now = new Date();
  cities.forEach(city => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: city.timeZone
    });
    const time = formatter.format(now);
    const id = `clock-${city.name.replace(/\s+/g, "-")}`;
    const el = document.getElementById(id);
    if (el) el.textContent = time;
  });
}

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${apiKey}`; 

  try {
    const res = await fetch(url);
    const data = await res.join();

    const weatherContainer = document.getElementById(`weather-${city.name.replace(/\s+/g, "-")}`);
    const iconCode = data.weather[0].icon;
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].main;

    weatherContainer.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}" title="${description}" />
    <div class="temp">${temp}°C</div>
    `;
  } catch (err) {
    console.error("Weather error:", err);
  }
}

function updateWeatherAll() {
  cities.forEach(city => fetchWeather(city));
}

// Init clocks
cities.forEach(createClock);
updateClocks();
setInterval(updateClocks, 1000);

// Init weather
setInterval(updateWeatherAll, 600000)

// Dark/Light theme toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

const analogCanvas = document.getElementById("analog-clock");
const ctx = analogCanvas.getContext("2d");

function drawAnalogClock() {
    const now = new Date();
    const radius = analogCanvas.width / 2;
    ctx.clearRect(0, 0, analogCanvas.width, analogCanvas.height);

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(-Math.PI / 2);

    // Clock face
    ctx.strokeStyle = "var(--text)";
    ctx.fillStyle = "var(--card-bg)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, radius - 4, 0, Math.PI * 2, true);
    ctx.stroke();

    // Tick marks
    for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.rotate(Math.PI / 6);
        ctx.moveTo(radius * 0.85, 0);
        ctx.lineTo(radius * 0.95, 0);
        ctx.stroke();
    }

    // Get time
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hour = now.getHours();

    // Hour hand
      ctx.save();
    ctx.rotate(((hour % 12) + min / 60) * Math.PI / 6);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(radius * 0.5, 0);
    ctx.stroke();
    ctx.restore();

    // Minute hand
    ctx.save();
    ctx.rotate((min + sec / 60) * Math.PI / 30);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(radius * 0.7, 0);
    ctx.stroke();
    ctx.restore();

    // Second hand
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.rotate(sec * Math.PI / 30);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(radius * 0.8, 0);
    ctx.stroke();
    ctx.restore();

    ctx.restore();

    // Center dot
    ctx.beginPath();
    ctx.fillStyle = "var(--accent)";
    ctx.arc(radius, radius, 4, 0, Math.PI * 2, true);
    ctx.fill();
}

setInterval(() => {
    updateClocks();
    drawAnalogClock();
}, 1000);

drawAnalogClock(); // Initial draw