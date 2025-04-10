// Get query parameters from URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    firstName: params.get("first-name"),
    lastName: params.get("last-name"),
    email: params.get("email"),
    phone: params.get("phone"),
    organization: params.get("organization"),
    timestamp: params.get("timestamp")
  };
}

// Display values on page
function displayFormResults() {
  const data = getQueryParams();
  document.getElementById("firstName").textContent = data.firstName || "N/A";
  document.getElementById("lastName").textContent = data.lastName || "N/A";
  document.getElementById("email").textContent = data.email || "N/A";
  document.getElementById("phone").textContent = data.phone || "N/A";
  document.getElementById("organization").textContent = data.organization || "N/A";
  document.getElementById("timestamp").textContent = data.timestamp || "N/A";
}

// Footer dynamic data
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("lastModified").textContent = document.lastModified;
  displayFormResults();
});
