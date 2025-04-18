// main.js - Main JavaScript module for Global Gateway Travel Services
// Author: Massango V. Moukouelle

import { displayFeaturedDestinations } from './modules/destinations.js';
import { displayWeather } from './modules/weather.js';
import { handleNavigation } from './modules/navigation.js';

// DOM Elements
const featuredCarousel = document.getElementById('featured-carousel');
const weatherContainer = document.getElementById('weather-container');
const newsletterForm = document.getElementById('newsletter-form');

// Initialize navigation
handleNavigation();

// Initialize featured destinations on home page
async function initFeaturedDestinations() {
    try {
        const response = await fetch('./data/destinations.json');
        if (!response.ok) {
            throw new Error('Failed to fetch destination data');
        }
        const data = await response.json();
        
        // Filter for featured destinations (first 5)
        const featuredDestinations = data.slice(0, 5);
        
        // Display featured destinations in the carousel
        displayFeaturedDestinations(featuredCarousel, featuredDestinations);
    } catch (error) {
        console.error('Error loading featured destinations:', error);
        featuredCarousel.innerHTML = `<p class="error-message">Sorry, we couldn't load featured destinations at this time.</p>`;
    }
}

// Initialize weather widget
async function initWeatherWidget() {
    try {      
        const response = await fetch('./data/weather.json');
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const weatherData = await response.json();
        
        // Display weather data
        displayWeather(weatherContainer, weatherData);
    } catch (error) {
        console.error('Error loading weather data:', error);
        weatherContainer.innerHTML = `<p class="error-message">Sorry, we couldn't load weather data at this time.</p>`;
    }
}

// Handle newsletter form submission
function handleNewsletterForm() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (event) => {
            // Save to localStorage for demo purposes
            const email = document.getElementById('email').value;
            const interests = document.getElementById('interests').value;
            
            const userData = {
                email,
                interests,
                date: new Date().toISOString()
            };
            
            // Store in localStorage
            localStorage.setItem('newsletterData', JSON.stringify(userData));
        });
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    initFeaturedDestinations();
    initWeatherWidget();
    handleNewsletterForm();
});
