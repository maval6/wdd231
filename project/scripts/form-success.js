// form-success.js - Handles displaying form submission data
// Author: Massango V. Moukouelle

document.addEventListener('DOMContentLoaded', () => {
    const formDataDisplay = document.getElementById('form-data-display');
    
    if (!formDataDisplay) return;
    
    // Get URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    
    // Check if there are any parameters
    if (queryParams.toString() === '') {
        formDataDisplay.innerHTML = '<p>No form data was submitted.</p>';
        return;
    }
    
    // Create content to display form data
    let formDataHtml = '<p>Thank you for your submission. Below are the details you provided:</p>';
    formDataHtml += '<div class="form-data-list">';
    
    // Iterate through all parameters and format them for display
    for (const [key, value] of queryParams.entries()) {
        // Format the key to be more readable (convert dashes to spaces and capitalize)
        const formattedKey = key
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        formDataHtml += `
            <div class="form-data-item">
                <span class="form-data-label">${formattedKey}:</span>
                <span class="form-data-value">${value}</span>
            </div>
        `;
    }
    
    formDataHtml += '</div>';
    
    // Set the content
    formDataDisplay.innerHTML = formDataHtml;
});
