// resources.js - JavaScript for the resources page
// Author: Massango V. Moukouelle

import { handleNavigation } from './modules/navigation.js';
import { saveToStorage, getFromStorage, saveTripPlan, getSavedTrips, deleteTripPlan } from './modules/storage.js';

// DOM Elements
const visaForm = document.getElementById('visa-form');
const visaResults = document.getElementById('visa-results');
const currencyForm = document.getElementById('currency-form');
const conversionResult = document.getElementById('conversion-result');
const travelPlannerForm = document.getElementById('travel-planner-form');
const saveDraftBtn = document.getElementById('save-draft');
const tripsContainer = document.getElementById('trips-container');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    handleNavigation();
    
    // Load country options for visa form
    loadCountryOptions();
    
    // Load currency options
    loadCurrencyOptions();
    
    // Load saved trips
    loadSavedTrips();
    
    // Set up event listeners
    setupEventListeners();
});

// Load country options for the visa tool dropdowns
async function loadCountryOptions() {
    try {
        const response = await fetch('./data/countries.json');
        if (!response.ok) {
            throw new Error('Failed to fetch country data');
        }
        
        const countries = await response.json();
        
        // Sort countries alphabetically
        countries.sort((a, b) => a.name.localeCompare(b.name));
        
        // Get the select elements
        const nationalitySelect = document.getElementById('nationality');
        const destinationSelect = document.getElementById('destination');
        
        if (nationalitySelect && destinationSelect) {
            // Populate nationality dropdown
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code;
                option.textContent = country.name;
                nationalitySelect.appendChild(option);
            });
            
            // Populate destination dropdown (clone the options)
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code;
                option.textContent = country.name;
                destinationSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading countries:', error);
        const errorMessage = `<p class="error-message">Sorry, we couldn't load the country data. Please try again later.</p>`;
        
        // Display error in both select elements
        if (document.getElementById('nationality')) {
            document.getElementById('nationality').insertAdjacentHTML('beforebegin', errorMessage);
        }
        if (document.getElementById('destination')) {
            document.getElementById('destination').insertAdjacentHTML('beforebegin', errorMessage);
        }
    }
}

// Load currency options for the currency converter
async function loadCurrencyOptions() {
    try {
        const response = await fetch('./data/currencies.json');
        if (!response.ok) {
            throw new Error('Failed to fetch currency data');
        }
        
        const currencies = await response.json();
        
        // Get the select elements
        const fromCurrencySelect = document.getElementById('from-currency');
        const toCurrencySelect = document.getElementById('to-currency');
        
        if (fromCurrencySelect && toCurrencySelect) {
            // Populate fromCurrency dropdown
            currencies.forEach(currency => {
                const option = document.createElement('option');
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                fromCurrencySelect.appendChild(option);
            });
            
            // Populate toCurrency dropdown
            currencies.forEach(currency => {
                const option = document.createElement('option');
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                toCurrencySelect.appendChild(option);
            });
            
            // Set default values
            fromCurrencySelect.value = 'USD';
            toCurrencySelect.value = 'EUR';
        }
    } catch (error) {
        console.error('Error loading currencies:', error);
        const errorMessage = `<p class="error-message">Sorry, we couldn't load the currency data. Please try again later.</p>`;
        
        // Display error in both select elements
        if (document.getElementById('from-currency')) {
            document.getElementById('from-currency').insertAdjacentHTML('beforebegin', errorMessage);
        }
        if (document.getElementById('to-currency')) {
            document.getElementById('to-currency').insertAdjacentHTML('beforebegin', errorMessage);
        }
    }
}

// Load saved trips from localStorage
function loadSavedTrips() {
    if (!tripsContainer) return;
    
    const savedTrips = getSavedTrips();
    
    if (savedTrips.length === 0) {
        tripsContainer.innerHTML = `<p class="no-trips-message">No saved trip drafts yet.</p>`;
        return;
    }
    
    // Clear container
    tripsContainer.innerHTML = '';
    
    // Display each saved trip
    savedTrips.forEach(trip => {
        const tripCard = document.createElement('div');
        tripCard.className = 'trip-card';
        tripCard.dataset.id = trip.id;
        
        // Format dates
        const departureDate = new Date(trip['departure-date']).toLocaleDateString();
        const returnDate = new Date(trip['return-date']).toLocaleDateString();
        
        tripCard.innerHTML = `
            <h4>${trip['trip-name']}</h4>
            <p><strong>Destination:</strong> ${trip['destination-country']}</p>
            <p><strong>Dates:</strong> ${departureDate} to ${returnDate}</p>
            <p><strong>Travelers:</strong> ${trip.travelers}</p>
            <div class="trip-actions">
                <button class="btn-secondary delete-trip" data-id="${trip.id}">Delete</button>
                <button class="btn load-trip" data-id="${trip.id}">Load Trip</button>
            </div>
        `;
        
        tripsContainer.appendChild(tripCard);
    });
    
    // Add event listeners to the buttons
    document.querySelectorAll('.delete-trip').forEach(button => {
        button.addEventListener('click', (e) => {
            const tripId = e.target.dataset.id;
            deleteTripPlan(tripId);
            loadSavedTrips(); // Refresh the list
        });
    });
    
    document.querySelectorAll('.load-trip').forEach(button => {
        button.addEventListener('click', (e) => {
            const tripId = e.target.dataset.id;
            loadTripData(tripId);
        });
    });
}

// Load trip data into the form
function loadTripData(tripId) {
    const savedTrips = getSavedTrips();
    const trip = savedTrips.find(t => t.id === tripId);
    
    if (!trip || !travelPlannerForm) return;
    
    // Populate form fields with trip data
    document.getElementById('trip-name').value = trip['trip-name'];
    document.getElementById('departure-date').value = trip['departure-date'];
    document.getElementById('return-date').value = trip['return-date'];
    document.getElementById('destination-country').value = trip['destination-country'];
    document.getElementById('travelers').value = trip.travelers;
    document.getElementById('trip-type').value = trip['trip-type'];
    document.getElementById('budget').value = trip.budget;
    document.getElementById('notes').value = trip.notes || '';
    
    // Scroll to the form
    travelPlannerForm.scrollIntoView({ behavior: 'smooth' });
}

// Set up event listeners
function setupEventListeners() {
    // Visa form submission
    if (visaForm) {
        visaForm.addEventListener('submit', handleVisaForm);
    }
    
    // Currency converter form submission
    if (currencyForm) {
        currencyForm.addEventListener('submit', handleCurrencyForm);
    }
    
    // Save trip draft button
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', saveTripDraft);
    }
}

// Handle visa form submission
function handleVisaForm(event) {
    event.preventDefault();
    
    const nationality = document.getElementById('nationality').value;
    const destination = document.getElementById('destination').value;
    
    if (!nationality || !destination) {
        visaResults.innerHTML = `<p class="error-message">Please select both your nationality and destination.</p>`;
        return;
    }
    
    // Get country names for display
    const nationalityText = document.getElementById('nationality').options[document.getElementById('nationality').selectedIndex].text;
    const destinationText = document.getElementById('destination').options[document.getElementById('destination').selectedIndex].text;
    
    // In a real app, this would make an API call to get visa requirements
    // For demo purposes, we'll generate a simulated response
    
    // Simulate visa requirement based on country codes (just for demo)
    let requirementText, requirementClass;
    
    if (nationality === destination) {
        requirementText = 'No visa required for citizens traveling within their own country.';
        requirementClass = 'success-message';
    } else if (Math.random() > 0.5) { // Random result for demo
        requirementText = `Visa required. ${nationalityText} citizens must obtain a visa before traveling to ${destinationText}.`;
        requirementClass = 'requirement-visa';
    } else {
        requirementText = `No visa required for short stays. ${nationalityText} citizens can visit ${destinationText} for up to 90 days without a visa.`;
        requirementClass = 'requirement-no-visa';
    }
    
    // Display the result
    visaResults.innerHTML = `
        <h3>Visa Requirements</h3>
        <p class="${requirementClass}">${requirementText}</p>
        <p><strong>From:</strong> ${nationalityText}</p>
        <p><strong>To:</strong> ${destinationText}</p>
        <p class="disclaimer">Note: This information is for demonstration purposes only. Always check with the embassy or consulate of your destination country for the most up-to-date visa requirements.</p>
    `;
}

// Handle currency form submission
function handleCurrencyForm(event) {
    event.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    
    if (isNaN(amount) || amount <= 0 || !fromCurrency || !toCurrency) {
        conversionResult.innerHTML = `<p class="error-message">Please enter a valid amount and select both currencies.</p>`;
        return;
    }
    
    // Get currency names for display
    const fromCurrencyText = fromCurrency;
    const toCurrencyText = toCurrency;
    
    // In a real app, this would make an API call to get current exchange rates
    // For demo purposes, we'll use a simulated rate
    
    // Generate a random conversion rate between 0.5 and 2
    const conversionRate = 0.5 + Math.random() * 1.5;
    
    // Calculate converted amount
    const convertedAmount = amount * conversionRate;
    
    // Format amounts with 2 decimal places
    const formattedAmount = amount.toFixed(2);
    const formattedConvertedAmount = convertedAmount.toFixed(2);
    
    // Display the result
    conversionResult.innerHTML = `
        <h3>Conversion Result</h3>
        <p class="conversion-main">${formattedAmount} ${fromCurrencyText} = ${formattedConvertedAmount} ${toCurrencyText}</p>
        <p><strong>Exchange Rate:</strong> 1 ${fromCurrencyText} = ${conversionRate.toFixed(4)} ${toCurrencyText}</p>
        <p class="disclaimer">Note: This conversion is for demonstration purposes only. Actual exchange rates may vary.</p>
    `;
}

// Save trip draft to localStorage
function saveTripDraft() {
    // Get form data
    const tripName = document.getElementById('trip-name').value;
    const departureDate = document.getElementById('departure-date').value;
    const returnDate = document.getElementById('return-date').value;
    const destinationCountry = document.getElementById('destination-country').value;
    const travelers = document.getElementById('travelers').value;
    const tripType = document.getElementById('trip-type').value;
    const budget = document.getElementById('budget').value;
    const notes = document.getElementById('notes').value;
    
    // Validate required fields
    if (!tripName || !departureDate || !returnDate || !destinationCountry) {
        alert('Please fill in the required fields (Trip Name, Dates, and Destination) before saving a draft.');
        return;
    }
    
    // Create trip data object
    const tripData = {
        'trip-name': tripName,
        'departure-date': departureDate,
        'return-date': returnDate,
        'destination-country': destinationCountry,
        'travelers': travelers,
        'trip-type': tripType,
        'budget': budget,
        'notes': notes
    };
    
    // Save to localStorage
    saveTripPlan(tripData);
    
    // Refresh the saved trips display
    loadSavedTrips();
    
    // Show confirmation
    alert('Trip draft saved successfully!');
}
