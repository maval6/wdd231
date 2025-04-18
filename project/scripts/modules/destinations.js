// destinations.js - Handles destination-related functionality
// Author: Massango V. Moukouelle

/**
 * Creates and displays destination cards for the featured carousel
 * @param {HTMLElement} container - The container element
 * @param {Array} destinations - Array of destination objects
 */
export function displayFeaturedDestinations(container, destinations) {
    if (!container || !destinations || !destinations.length) return;
    
    // Clear loading message
    container.innerHTML = '';
    
    // Create a card for each destination
    destinations.forEach(destination => {
        const card = createDestinationCard(destination);
        container.appendChild(card);
    });
}

/**
 * Creates and displays destination cards in a grid layout
 * @param {HTMLElement} container - The container element
 * @param {Array} destinations - Array of destination objects
 */
export function displayDestinationGrid(container, destinations) {
    if (!container || !destinations || !destinations.length) return;
    
    // Clear loading message
    container.innerHTML = '';
    
    // Create a card for each destination
    destinations.forEach(destination => {
        const card = createDestinationCard(destination, true);
        container.appendChild(card);
    });
}

/**
 * Creates a destination card element
 * @param {Object} destination - Destination data object
 * @param {Boolean} includeViewButton - Whether to include View Details button
 * @returns {HTMLElement} - The created card element
 */
function createDestinationCard(destination, includeViewButton = false) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.dataset.id = destination.id;
    
    // Calculate a rating string (e.g., "4.5/5")
    const ratingText = destination.rating ? `${destination.rating}/5` : 'Not rated';
    
    // Create card content using template literals
    card.innerHTML = `
        <img src="${destination.image}" alt="${destination.name}" loading="lazy">
        <div class="destination-card-content">
            <h3>${destination.name}</h3>
            <p>${destination.shortDescription}</p>
            <div class="destination-meta">
                <span>${destination.region}</span>
                <span>Rating: ${ratingText}</span>
            </div>
            ${includeViewButton ? `<button class="btn view-details" data-id="${destination.id}">View Details</button>` : ''}
        </div>
    `;
    
    // Add event listener to the button if it exists
    if (includeViewButton) {
        const viewButton = card.querySelector('.view-details');
        viewButton.addEventListener('click', () => {
            showDestinationModal(destination.id);
        });
    }
    
    return card;
}

/**
 * Filters destinations based on selected criteria
 * @param {Array} destinations - The complete destinations array
 * @param {String} region - Selected region filter
 * @param {String} interest - Selected interest filter
 * @returns {Array} - Filtered destinations array
 */
export function filterDestinations(destinations, region, interest) {
    return destinations.filter(destination => {
        // If both filters are set to 'all', return all destinations
        if (region === 'all' && interest === 'all') {
            return true;
        }
        
        // Check if the destination matches the region filter
        const matchesRegion = region === 'all' || destination.region.toLowerCase() === region;
        
        // Check if the destination matches the interest filter
        const matchesInterest = interest === 'all' || 
            (destination.interests && destination.interests.includes(interest));
        
        // Return true if the destination matches both filters
        return matchesRegion && matchesInterest;
    });
}

/**
 * Shows destination details in a modal
 * @param {String} destinationId - ID of the destination to show
 */
export async function showDestinationModal(destinationId) {
    const modal = document.getElementById('destination-modal');
    const modalContent = document.getElementById('modal-content-container');
    
    if (!modal || !modalContent) return;
    
    try {
        // Fetch destination data
        const response = await fetch('./data/destinations.json');
        if (!response.ok) {
            throw new Error('Failed to fetch destination data');
        }
        
        const destinations = await response.json();
        const destination = destinations.find(dest => dest.id === destinationId);
        
        if (!destination) {
            throw new Error('Destination not found');
        }
        
        // Populate modal content
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${destination.name}</h2>
                <p class="destination-location">${destination.country}, ${destination.region}</p>
            </div>
            <div class="modal-image">
                <img src="${destination.image}" alt="${destination.name}" loading="lazy">
            </div>
            <div class="modal-description">
                <h3>About ${destination.name}</h3>
                <p>${destination.fullDescription || destination.shortDescription}</p>
            </div>
            <div class="modal-details">
                <div class="detail-item">
                    <h4>Best Time to Visit</h4>
                    <p>${destination.bestTimeToVisit || 'Information not available'}</p>
                </div>
                <div class="detail-item">
                    <h4>Language</h4>
                    <p>${destination.language || 'Information not available'}</p>
                </div>
                <div class="detail-item">
                    <h4>Currency</h4>
                    <p>${destination.currency || 'Information not available'}</p>
                </div>
                <div class="detail-item">
                    <h4>Popular Activities</h4>
                    <ul>
                        ${destination.activities ? destination.activities.map(activity => `<li>${activity}</li>`).join('') : '<li>Information not available</li>'}
                    </ul>
                </div>
            </div>
        `;
        
        // Show the modal
        modal.style.display = 'block';
        
        // Close modal when clicking the close button
        const closeButton = document.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Close modal when clicking outside the content
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
    } catch (error) {
        console.error('Error showing destination details:', error);
        modalContent.innerHTML = `<p class="error-message">Sorry, we couldn't load the destination details at this time.</p>`;
        modal.style.display = 'block';
    }
}
