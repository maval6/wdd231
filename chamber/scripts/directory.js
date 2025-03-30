document.addEventListener("DOMContentLoaded", () => {
    const directory = document.getElementById("directory");
    const toggleButton = document.getElementById("toggleView");

    let isGridView = true; // Default view

    // Fetch and Display Members
    async function loadMembers() {
        try {
            const response = await fetch("data/members.json");
            const members = await response.json();
            displayMembers(members);
        } catch (error) {
            console.error("Error loading members:", error);
        }
    }

    function displayMembers(members) {
        directory.innerHTML = ""; // Clear previous content
        directory.className = isGridView ? "grid-view" : "list-view";

        members.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("member-card");

            card.innerHTML = `
                <img src="images/${member.image}" alt="${member.name}">
                <h3>${member.name}</h3>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <a href="${member.website}" target="_blank">Visit Website</a>
            `;

            if (!isGridView) {
                card.style.display = "flex";
                card.style.alignItems = "center";
                card.style.gap = "10px";
                card.style.borderBottom = "1px solid #ddd";
            }

            directory.appendChild(card);
        });
    }

    // Toggle between Grid & List View
    toggleButton.addEventListener("click", () => {
        isGridView = !isGridView;
        toggleButton.textContent = isGridView ? "Switch to List View" : "Switch to Grid View";
        loadMembers(); // Reload members in new format
    });

    // Footer: Copyright Year & Last Modified Date
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = document.lastModified;

    loadMembers(); // Load members on page load
});
