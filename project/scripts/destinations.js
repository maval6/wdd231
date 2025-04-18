// destinations.js - JavaScript for the destinations page
// Author: Massango V. Moukouelle

import { displayDestinationGrid, filterDestinations, showDestinationModal } from './modules/destinations.js';
import { handleNavigation } from './modules/navigation.js';

// DOM Elements
const destinationsContainer = document.getElementById('destinations-container');
const regionFilter = document.getElementById('region-filter');
const interestFilter = document.getElementById('interest-filter');
const clearFiltersBtn = document.getElementById('clear-filters');
const spotlightContainer = document.getElementById('spotlight-container');

// Global variables
let allDestinations = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    handleNavigation();
    
    // Load destinations data
    initDestinations();
    
    // Set up event listeners
    setupEventListeners();
});

// Initialize destinations
async function initDestinations() {
    try {
        const response = await fetch('./data/destinations.json');
        if (!response.ok) {
            throw new Error('Failed to fetch destination data');
        }
        
        allDestinations = await response.json();
        
        // Display all destinations initially
        displayDestinationGrid(destinationsContainer, allDestinations);
        
        // Display random spotlight destination
        displayRandomSpotlight();
    } catch (error) {
        console.error('Error loading destinations:', error);
        destinationsContainer.innerHTML = `<p class="error-message">Sorry, we couldn't load destinations at this time.</p>`;
        spotlightContainer.innerHTML = `<p class="error-message">Sorry, we couldn't load spotlight data at this time.</p>`;
    }
}

// Set up event listeners
function setupEventListeners() {
    // Filter changes
    if (regionFilter) {
        regionFilter.addEventListener('change', applyFilters);
    }
    
    if (interestFilter) {
        interestFilter.addEventListener('change', applyFilters);
    }
    
    // Clear filters button
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Apply filters to destinations
function applyFilters() {
    const regionValue = regionFilter.value;
    const interestValue = interestFilter.value;
    
    // Apply filters
    const filteredDestinations = filterDestinations(allDestinations, regionValue, interestValue);
    
    // Update display
    displayDestinationGrid(destinationsContainer, filteredDestinations);
    
    // Show message if no results
    if (filteredDestinations.length === 0) {
        destinationsContainer.innerHTML = `<p class="no-results">No destinations match your selected filters. Please try different criteria.</p>`;
    }
}

// Clear all filters
function clearFilters() {
    // Reset filter selects
    regionFilter.value = 'all';
    interestFilter.value = 'all';
    
    // Reset display
    displayDestinationGrid(destinationsContainer, allDestinations);
}

// Display a random destination in the spotlight section
function displayRandomSpotlight() {
    if (!spotlightContainer || !allDestinations.length) return;
    
    // Get a random destination
    const randomIndex = Math.floor(Math.random() * allDestinations.length);
    const spotlight = allDestinations[randomIndex];
    
    // Create spotlight content
    spotlightContainer.innerHTML = `
        <div class="spotlight-card">
            <div class="spotlight-image">
                <img src="${spotlight.image}" alt="${spotlight.name}" loading="lazy">
            </div>
            <div class="spotlight-content">
                <h3>${spotlight.name}, ${spotlight.country}</h3>
                <p class="spotlight-region">${spotlight.region}</p>
                <p>${spotlight.shortDescription}</p>
                <p>${spotlight.fullDescription || ''}</p>
                <button class="btn view-spotlight" data-id="${spotlight.id}">View Details</button>
            </div>
        </div>
    `;
    
    // Add event listener to the view details button
    const viewButton = spotlightContainer.querySelector('.view-spotlight');
    if (viewButton) {
        viewButton.addEventListener('click', () => {
            showDestinationModal(spotlight.id);
        });
    }
}
