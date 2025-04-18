// weather.js - Handles weather-related functionality
// Author: Massango V. Moukouelle

/**
 * Displays weather information for popular destinations
 * @param {HTMLElement} container - The container element
 * @param {Array} weatherData - Array of weather data objects
 */
export function displayWeather(container, weatherData) {
    if (!container || !weatherData || !weatherData.length) return;
    
    // Clear loading message
    container.innerHTML = '';
    
    // Create a weather card for each location
    weatherData.forEach(data => {
        const weatherCard = createWeatherCard(data);
        container.appendChild(weatherCard);
    });
}

/**
 * Creates a weather card element
 * @param {Object} weatherData - Weather data for a location
 * @returns {HTMLElement} - The created weather card element
 */
function createWeatherCard(weatherData) {
    const card = document.createElement('div');
    card.className = 'weather-card';
    
    // Format temperature with degree symbol
    const formattedTemp = `${weatherData.temperature}°${weatherData.unit || 'C'}`;
    
    // Create card content
    card.innerHTML = `
        <h3>${weatherData.location}</h3>
        <img src="${weatherData.icon}" alt="${weatherData.description}" loading="lazy">
        <div class="weather-temp">${formattedTemp}</div>
        <p>${weatherData.description}</p>
        <p class="weather-update">Last updated: ${formatLastUpdated(weatherData.lastUpdated)}</p>
    `;
    
    return card;
}

/**
 * Formats the last updated timestamp
 * @param {String} timestamp - ISO timestamp string
 * @returns {String} - Formatted date string
 */
function formatLastUpdated(timestamp) {
    if (!timestamp) return 'Unknown';
    
    try {
        const date = new Date(timestamp);
        return date.toLocaleString();
    } catch (error) {
        console.error('Error formatting date:', error);
        return timestamp;
    }
}

/**
 * Fetches real weather data from a weather API
 * Note: This function is not used in the demo version as we're using static data
 * In a real implementation, you would use an API key and make actual API calls
 * @param {String} city - City name
 * @returns {Promise} - Promise resolving to weather data
 */
export async function fetchWeatherData(city) {
    try {
        // This is a placeholder for a real API call
        // In a real implementation, you would use something like:
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YOUR_API_KEY`);
        
        // For demonstration purposes, we'll throw an error that this is not implemented
        throw new Error('Live weather API integration not implemented in demo version');
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}
