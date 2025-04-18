// storage.js - Handles localStorage functionality
// Author: Massango V. Moukouelle

/**
 * Saves data to localStorage
 * @param {String} key - The storage key
 * @param {any} data - The data to store
 * @returns {Boolean} - Success status
 */
export function saveToStorage(key, data) {
    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
        return true;
    } catch (error) {
        console.error(`Error saving data to localStorage (${key}):`, error);
        return false;
    }
}

/**
 * Retrieves data from localStorage
 * @param {String} key - The storage key
 * @returns {any|null} - The retrieved data or null if not found
 */
export function getFromStorage(key) {
    try {
        const serializedData = localStorage.getItem(key);
        if (serializedData === null) {
            return null;
        }
        return JSON.parse(serializedData);
    } catch (error) {
        console.error(`Error retrieving data from localStorage (${key}):`, error);
        return null;
    }
}

/**
 * Removes data from localStorage
 * @param {String} key - The storage key
 * @returns {Boolean} - Success status
 */
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing data from localStorage (${key}):`, error);
        return false;
    }
}

/**
 * Saves a trip plan to localStorage
 * @param {Object} tripData - Trip plan data
 * @returns {String} - Generated trip ID
 */
export function saveTripPlan(tripData) {
    // Generate a unique ID for the trip
    const tripId = `trip_${Date.now()}`;
    
    // Add timestamp
    const tripWithMetadata = {
        ...tripData,
        id: tripId,
        savedAt: new Date().toISOString()
    };
    
    // Get existing trips or initialize empty array
    const existingTrips = getFromStorage('savedTrips') || [];
    
    // Add new trip to the array
    const updatedTrips = [...existingTrips, tripWithMetadata];
    
    // Save updated array back to localStorage
    saveToStorage('savedTrips', updatedTrips);
    
    return tripId;
}

/**
 * Gets all saved trip plans from localStorage
 * @returns {Array} - Array of saved trip plans
 */
export function getSavedTrips() {
    return getFromStorage('savedTrips') || [];
}

/**
 * Deletes a trip plan from localStorage
 * @param {String} tripId - ID of the trip to delete
 * @returns {Boolean} - Success status
 */
export function deleteTripPlan(tripId) {
    // Get existing trips
    const existingTrips = getFromStorage('savedTrips') || [];
    
    // Filter out the trip to delete
    const updatedTrips = existingTrips.filter(trip => trip.id !== tripId);
    
    // Save updated array back to localStorage
    return saveToStorage('savedTrips', updatedTrips);
}
