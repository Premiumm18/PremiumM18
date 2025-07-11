// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const videoContainer = document.getElementById('video-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    // State variables
    let videos = [];
    let currentCategory = 'all';
    let currentSearchTerm = '';
    
    // Initialize the page
    init();
    
    // Event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.category;
            filterVideos();
        });
    });
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    // Functions
    async function init() {
        showLoading();
        try {
            // Load videos from videos.json or Firebase as you prefer
            // Here I kept your original fetch for videos.json
            const response = await fetch('videos.json');
            videos = await response.json();
            renderVideos(videos);
        } catch (error) {
            console.error('Error loading videos:', error);
            videoContainer.innerHTML = '<p class="error">Failed to load videos. Please try again later.</p>';
        } finally {
            hideLoading();
        }
    }
    
    function renderVideos(videosToRender) {
        videoContainer.innerHTML = '';
        
        if (videosToRender.length === 0) {
            videoContainer.innerHTML = '<p class="no-results">No videos found matching your criteria.</p>';
            return;
        }
        
        videosToRender.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            
            videoCard.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <div class="watch-btn-container">
                        <a href="redirect.html?source=doodstream&url=${encodeURIComponent(video.doodstream)}&ad=${shouldShowAd()}" class="watch-btn doodstream">
                            <img src="images/doodstream.png" alt="Doodstream">
                            Watch Now
                        </a>
                        <span class="watch-subtext">No ads, no login</span>
                        <a href="redirect.html?source=terabox&url=${encodeURIComponent(video.terabox)}&ad=${shouldShowAd()}" class="watch-btn terabox">
                            <img src="images/terabox.png" alt="Terabox">
                            Watch Now
                        </a>
                    </div>
                </div>
            `;
            
            videoContainer.appendChild(videoCard);
        });
    }
    
    function filterVideos() {
        let filteredVideos = [...videos];
        
        // Filter by category (categories stored as string)
        if (currentCategory !== 'all') {
            filteredVideos = filteredVideos.filter(video => {
                const categories = video.categories || "";
                return categories.toLowerCase().includes(currentCategory.toLowerCase());
            });
        }
        
        // Filter by search term (tags can be string or array)
        if (currentSearchTerm) {
            const searchTerm = currentSearchTerm.toLowerCase();
            filteredVideos = filteredVideos.filter(video => {
                const titleMatch = video.title && video.title.toLowerCase().includes(searchTerm);
                
                let tagsMatch = false;
                if (video.tags) {
                    if (Array.isArray(video.tags)) {
                        tagsMatch = video.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                    } else if (typeof video.tags === 'string') {
                        tagsMatch = video.tags.toLowerCase().includes(searchTerm);
                    }
                }
                
                return titleMatch || tagsMatch;
            });
        }
        
        // Sort by newest first (assuming video.date is a valid date string)
        filteredVideos.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        renderVideos(filteredVideos);
    }
    
    function performSearch() {
        currentSearchTerm = searchInput.value.trim();
        filterVideos();
    }
    
    function showLoading() {
        loadingSpinner.classList.remove('hidden');
    }
    
    function hideLoading() {
        loadingSpinner.classList.add('hidden');
    }
    
    function shouldShowAd() {
        // Implement logic to determine if an ad should be shown
        // This could be based on user consent, frequency capping, etc.
        const consent = getConsent();
        return consent && consent.adsAllowed ? 'true' : 'false';
    }
});
