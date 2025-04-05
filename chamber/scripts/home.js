document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  const lastModified = document.getElementById("lastModified");
  const weatherContainer = document.getElementById("weather-info");
  const spotlightContainer = document.getElementById("spotlight-container");

  // Update year and last modified
  yearSpan.textContent = new Date().getFullYear();
  lastModified.textContent = document.lastModified;

  // === Weather Section ===
  const API_KEY = "d534abf3dabf1d93f9874772328bd8c7"; // Replace with your OpenWeatherMap API Key
  const CITY = "Douala"; // Update to your selected city

  async function loadWeather() {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Douala&units=metric&appid=d534abf3dabf1d93f9874772328bd8c7`);
      const data = await response.json();

      const currentTemp = data.list[0].main.temp;
      const description = data.list[0].weather[0].description;

      // Create HTML
      let html = `<p><strong>Current:</strong> ${currentTemp.toFixed(1)}°C | ${description}</p>`;
      html += `<h3>3-Day Forecast:</h3><ul>`;

      for (let i = 8; i <= 24; i += 8) {
        const dayData = data.list[i];
        const date = new Date(dayData.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
        html += `<li><strong>${date}:</strong> ${dayData.main.temp.toFixed(1)}°C</li>`;
      }
      html += `</ul>`;
      weatherContainer.innerHTML = html;
    } catch (error) {
      weatherContainer.innerHTML = `<p>Unable to load weather data.</p>`;
      console.error("Weather Error:", error);
    }
  }

  // === Spotlight Members ===
  async function loadSpotlights() {
    try {
      const response = await fetch("./data/members.json");
      const members = await response.json();

      // Filter silver and gold
      const premium = members.filter(m => m.membership === "Gold" || m.membership === "Silver");

      // Shuffle and select 2–3
      const selected = premium.sort(() => 0.5 - Math.random()).slice(0, 3);

      selected.forEach(member => {
        const div = document.createElement("div");
        div.className = "member-card";

        div.innerHTML = `
          <img src="images/${member.image}" alt="${member.name}">
          <h3>${member.name}</h3>
          <p>${member.address}</p>
          <p>${member.phone}</p>
          <a href="${member.website}" target="_blank">Visit Website</a>
          <p class="membership ${member.membership.toLowerCase()}">Level: ${member.membership}</p>
        `;
        spotlightContainer.appendChild(div);
      });
    } catch (error) {
      spotlightContainer.innerHTML = `<p>Unable to load spotlights.</p>`;
      console.error("Spotlight Error:", error);
    }
  }

  loadWeather();
  loadSpotlights();
});
