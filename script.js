const cities = [
  { name: "New York", timeZone: "America/New_York" },
  { name: "London", timeZone: "Europe/London" },
  { name: "Tokyo", timeZone: "Asia/Tokyo" },
  { name: "Moscow", timeZone: "Europe/Moscow" },
  { name: "Los Angeles", timeZone: "America/Los_Angeles" },
  { name: "Paris", timeZone: "Europe/Paris" },
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

  wrapper.appendChild(cityLabel);
  wrapper.appendChild(timeDisplay);
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

// Init clocks
cities.forEach(createClock);
updateClocks();
setInterval(updateClocks, 1000);

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