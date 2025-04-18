// navigation.js - Handles responsive navigation
// Author: Massango V. Moukouelle

/**
 * Initializes the responsive navigation functionality
 */
export function handleNavigation() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const primaryNav = document.getElementById('primary-nav');
    
    if (hamburgerBtn && primaryNav) {
        // Toggle navigation menu on hamburger button click
        hamburgerBtn.addEventListener('click', () => {
            primaryNav.classList.toggle('active');
            
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = primaryNav.classList.contains('active');
            hamburgerBtn.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close navigation menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!hamburgerBtn.contains(event.target) && !primaryNav.contains(event.target)) {
                primaryNav.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close navigation menu when window is resized to desktop size
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && primaryNav.classList.contains('active')) {
                primaryNav.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}
