// Admin panel functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.admin-section');
    const addVideoBtn = document.getElementById('add-video-btn');
    const videoForm = document.getElementById('video-form');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const videoList = document.getElementById('video-list');
    const adminSearch = document.getElementById('admin-search');
    const adminSearchBtn = document.getElementById('admin-search-btn');
    
    // State variables
    let videos = [];
    let currentVideoId = null;
    
    // Initialize the admin panel
    initAdmin();
    
    // Event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section + '-section';
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show selected section
            sections.forEach(s => s.classList.add('hidden'));
            document.getElementById(sectionId).classList.remove('hidden');
        });
    });
    
    addVideoBtn.addEventListener('click', showAddVideoForm);
    cancelEditBtn.addEventListener('click', cancelEdit);
    videoForm.addEventListener('submit', handleVideoSubmit);
    adminSearchBtn.addEventListener('click', performAdminSearch);
    adminSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performAdminSearch();
    });
    
    // Functions
    async function initAdmin() {
        try {
            const response = await fetch('../videos.json');
            videos = await response.json();
            renderVideoList(videos);
        } catch (error) {
            console.error('Error loading videos:', error);
            videoList.innerHTML = '<p class="error">Failed to load videos. Please try again later.</p>';
        }
    }
    
    function renderVideoList(videosToRender) {
        videoList.innerHTML = '';
        
        if (videosToRender.length === 0) {
            videoList.innerHTML = '<p class="no-results">No videos found.</p>';
            return;
        }
        
        videosToRender.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            videoItem.innerHTML = `
                <div class="video-item-thumb">
                    <img src="${video.thumbnail}" alt="${video.title}">
                </div>
                <div class="video-item-info">
                    <h3>${video.title}</h3>
                    <p>${video.categories.join(', ')}</p>
                    <p>${new Date(video.date).toLocaleDateString()}</p>
                </div>
                <div class="video-item-actions">
                    <button class="edit-btn" data-id="${video.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${video.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            videoList.appendChild(videoItem);
        });
        
        // Add event listeners to edit/delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editVideo(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteVideo(btn.dataset.id));
        });
    }
    
    function showAddVideoForm() {
        currentVideoId = null;
        document.getElementById('add-edit-title').textContent = 'Add New Video';
        document.getElementById('video-id').value = '';
        document.getElementById('video-title').value = '';
        document.getElementById('video-thumbnail').value = '';
        document.getElementById('video-doodstream').value = '';
        document.getElementById('video-terabox').value = '';
        document.getElementById('video-tags').value = '';
        document.getElementById('video-date').value = '';
        
        // Uncheck all category checkboxes
        document.querySelectorAll('input[name="categories"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Switch to add/edit section
        sections.forEach(s => s.classList.add('hidden'));
        document.getElementById('add-edit-section').classList.remove('hidden');
    }
    
    function editVideo(videoId) {
        const video = videos.find(v => v.id === videoId);
        if (!video) return;
        
        currentVideoId = videoId;
        document.getElementById('add-edit-title').textContent = 'Edit Video';
        document.getElementById('video-id').value = video.id;
        document.getElementById('video-title').value = video.title;
        document.getElementById('video-thumbnail').value = video.thumbnail;
        document.getElementById('video-doodstream').value = video.doodstream;
        document.getElementById('video-terabox').value = video.terabox;
        document.getElementById('video-tags').value = video.tags ? video.tags.join(', ') : '';
        document.getElementById('video-date').value = video.date.split('T')[0];
        
        // Check appropriate category checkboxes
        document.querySelectorAll('input[name="categories"]').forEach(checkbox => {
            checkbox.checked = video.categories.includes(checkbox.value);
        });
        
        // Switch to add/edit section
        sections.forEach(s => s.classList.add('hidden'));
        document.getElementById('add-edit-section').classList.remove('hidden');
    }
    
    function cancelEdit() {
        sections.forEach(s => s.classList.add('hidden'));
        document.getElementById('videos-section').classList.remove('hidden');
    }
    
    async function handleVideoSubmit(e) {
        e.preventDefault();
        
        // Gather form data
        const formData = {
            id: document.getElementById('video-id').value || generateId(),
            title: document.getElementById('video-title').value,
            thumbnail: document.getElementById('video-thumbnail').value,
            doodstream: document.getElementById('video-doodstream').value,
            terabox: document.getElementById('video-terabox').value,
            categories: Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(cb => cb.value),
            tags: document.getElementById('video-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            date: document.getElementById('video-date').value
        };
        
        try {
            // Update or add the video
            if (currentVideoId) {
                // Update existing video
                const index = videos.findIndex(v => v.id === currentVideoId);
                if (index !== -1) {
                    videos[index] = formData;
                }
            } else {
                // Add new video
                videos.push(formData);
            }
            
            // Save to JSON file via Netlify function
            await saveVideos(videos);
            
            // Return to video list
            renderVideoList(videos);
            cancelEdit();
        } catch (error) {
            console.error('Error saving video:', error);
            alert('Failed to save video. Please try again.');
        }
    }
    
    async function deleteVideo(videoId) {
        if (!confirm('Are you sure you want to delete this video?')) return;
        
        try {
            // Remove the video
            videos = videos.filter(v => v.id !== videoId);
            
            // Save to JSON file via Netlify function
            await saveVideos(videos);
            
            // Update the list
            renderVideoList(videos);
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('Failed to delete video. Please try again.');
        }
    }
    
    function performAdminSearch() {
        const searchTerm = adminSearch.value.trim().toLowerCase();
        
        if (!searchTerm) {
            renderVideoList(videos);
            return;
        }
        
        const filteredVideos = videos.filter(video => 
            video.title.toLowerCase().includes(searchTerm) ||
            (video.tags && video.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
        
        renderVideoList(filteredVideos);
    }
    
    function generateId() {
        return Date.now().toString();
    }
    
    async function saveVideos(updatedVideos) {
        try {
            // In a real implementation, this would call a Netlify function to update the JSON file
            // For now, we'll just log it
            console.log('Videos to save:', updatedVideos);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // In a real app, you would handle the response here
            return true;
        } catch (error) {
            throw error;
        }
    }
});
