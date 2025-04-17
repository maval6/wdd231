// Footer dynamic values
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("lastModified").textContent = document.lastModified;

  loadVisitMessage();
  loadDiscoverCards();
});

// Visit message using localStorage
function loadVisitMessage() {
  const message = document.getElementById("visit-message");
  const lastVisit = localStorage.getItem("lastVisit");
  const now = Date.now();

  if (!lastVisit) {
    message.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const days = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
    message.textContent =
      days < 1 ? "Back so soon! Awesome!" : `You last visited ${days} day(s) ago.`;
  }

  localStorage.setItem("lastVisit", now);
}

// Load places of interest from JSON
async function loadDiscoverCards() {
  try {
    const response = await fetch("data/discover.json");
    const data = await response.json();
    const container = document.getElementById("discover-cards");

    data.places.forEach(place => {
      const card = document.createElement("div");
      card.className = "discover-card";

      card.innerHTML = `
        <figure>
          <img src="images/${place.image}" alt="${place.name}" loading="lazy" width="300" height="200">
        </figure>
        <h3>${place.name}</h3>
        <address>${place.address}</address>
        <p>${place.description}</p>
        <a href="${place.link}" target="_blank">Learn More</a>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading discover.json:", err);
  }
}
