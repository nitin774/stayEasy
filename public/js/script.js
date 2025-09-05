// Search functionality for listings page
document.addEventListener('DOMContentLoaded', function() {
    // Get listings data from the JSON script tag
    const allListingsData = JSON.parse(document.getElementById('listings-data').textContent);
    
    // DOM elements
    const searchInput = document.querySelector('input[name="location"]');
    const searchBtn = document.querySelector('.search-btn');
    const searchCloseBtn = document.querySelector('.search-close-btn');
    const listingsContainer = document.getElementById('listings-container');
    const noResultsDiv = document.getElementById('no-results');
    const dynamicSearchHeader = document.getElementById('dynamic-search-header');
    const searchTitle = document.getElementById('search-title');
    const searchCount = document.getElementById('search-count');
    const gstSwitch = document.getElementById('switch');
    let searchTimeout;

    // Function to apply GST toggle state to all GST elements
    function applyGSTToggle() {
        const gstElements = document.querySelectorAll('.GST');
        if (gstSwitch && gstSwitch.checked) {
            gstElements.forEach(element => {
                element.style.display = 'inline';
            });
        } else {
            gstElements.forEach(element => {
                element.style.display = 'none';
            });
        }
    }

    // Function to perform fast client-side search
    function performSearch(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            // Show all listings if search is empty
            displayAllListings();
            return;
        }

        const filteredListings = filterListingsByLocation(searchTerm.trim());
        displaySearchResults(filteredListings, searchTerm);
    }

    // Function to filter listings by location (client-side)
    function filterListingsByLocation(searchTerm) {
        if (!allListingsData || allListingsData.length === 0) {
            return [];
        }

        const searchLower = searchTerm.toLowerCase().trim();
        return allListingsData.filter(listing => {
            if (!listing.location) return false;
            
            const locationLower = listing.location.toLowerCase().trim();
            
            // Multiple matching strategies for better results
            return (
                // Exact match
                locationLower === searchLower ||
                // Location starts with search term
                locationLower.startsWith(searchLower) ||
                // Location contains search term
                locationLower.includes(searchLower) ||
                // Search term contains location (for partial matches)
                searchLower.includes(locationLower) ||
                // Word boundary matching (for city names within longer addresses)
                locationLower.split(/[,\s]+/).some(word => 
                    word.startsWith(searchLower) || word === searchLower
                ) ||
                // Country matching (if location has country info)
                (listing.country && listing.country.toLowerCase().includes(searchLower))
            );
        });
    }

    // Function to display all listings
    function displayAllListings() {
        noResultsDiv.style.display = 'none';
        dynamicSearchHeader.style.display = 'none';
        listingsContainer.style.display = 'flex';
        
        // Generate HTML for all listings
        let listingsHTML = '';
        allListingsData.forEach(listing => {
            listingsHTML += `
                <a href="/listings/${listing._id}" class="listing-link">
                    <div class="card col listing-card">
                        <img src="${listing.image.url || listing.image}" class="card-img-top" alt="${listing.title}" style="height: 15rem;"/>
                        <div class="card-img-overlay">Views</div>
                        <div class="card-body">
                            <p class="card-text">
                                <b>${listing.title}</b> <br>
                                <small class="text-muted">${listing.location}</small> <br>
                                ₹${listing.price.toLocaleString('en-IN')} / night
                                <i class="GST">&nbsp;&nbsp;+18% GST</i>
                            </p>
                        </div>
                    </div>
                </a>
            `;
        });
        
        listingsContainer.innerHTML = listingsHTML;
        document.title = 'Wanderlust - All Listings';
        
        // Apply GST toggle state to newly created elements
        applyGSTToggle();
    }

    // Function to display search results
    function displaySearchResults(listings, searchTerm) {
        if (listings.length === 0) {
            // Show no results message
            listingsContainer.style.display = 'none';
            dynamicSearchHeader.style.display = 'none';
            noResultsDiv.style.display = 'block';
            noResultsDiv.querySelector('p').textContent = `Sorry, no listings found for "${searchTerm}". Try searching for a different location.`;
        } else {
            // Hide no results message and show search header
            noResultsDiv.style.display = 'none';
            dynamicSearchHeader.style.display = 'block';
            listingsContainer.style.display = 'flex';
            
            // Update search header
            searchTitle.textContent = `Search Results for "${searchTerm}"`;
            searchCount.textContent = `${listings.length} listing(s) found`;
            
            // Generate HTML for filtered listings
            let listingsHTML = '';
            listings.forEach(listing => {
                listingsHTML += `
                    <a href="/listings/${listing._id}" class="listing-link">
                        <div class="card col listing-card">
                            <img src="${listing.image.url || listing.image}" class="card-img-top" alt="${listing.title}" style="height: 15rem;"/>
                            <div class="card-img-overlay">Views</div>
                            <div class="card-body">
                                <p class="card-text">
                                    <b>${listing.title}</b> <br>
                                    <small class="text-muted">${listing.location}</small> <br>
                                    ₹${listing.price.toLocaleString('en-IN')} / night
                                    <i class="GST">&nbsp;&nbsp;+18% GST</i>
                                </p>
                            </div>
                        </div>
                    </a>
                `;
            });
            
            listingsContainer.innerHTML = listingsHTML;
            document.title = `Search Results for "${searchTerm}" - Wanderlust`;
            
            // Apply GST toggle state to newly created elements
            applyGSTToggle();
        }
    }

    // Event listeners
    if (searchInput) {
        // Search on Enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });

        // Real-time search on input (much faster with reduced debounce)
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            const searchTerm = e.target.value;
            
            // Show immediate feedback for better UX
            if (searchTerm.length > 0) {
                searchInput.style.borderColor = '#007bff';
            } else {
                searchInput.style.borderColor = '';
            }
            
            // Immediate search for better responsiveness
            searchTimeout = setTimeout(() => {
                performSearch(searchTerm);
            }, 50); // Further reduced to 50ms for instant response
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (searchInput && searchInput.value.trim()) {
                performSearch(searchInput.value);
            }
        });
    }

    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (searchInput) {
                searchInput.value = '';
                displayAllListings();
            }
        });
    }

    // GST toggle event listener
    if (gstSwitch) {
        gstSwitch.addEventListener('change', function() {
            applyGSTToggle();
        });
    }
});