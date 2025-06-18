// Authentication System
document.addEventListener('DOMContentLoaded', function() {
    // 1. Check authentication
    const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (!isAuthenticated && !isLoginPage) {
        window.location.href = '/admin/login.html';
        return;
    }

    // 2. Initialize Admin Panel
    if (!isLoginPage) {
        initAdminPanel();
    }
});

function initAdminPanel() {
    // DOM Elements
    const videoForm = document.getElementById('videoForm');
    const videosContainer = document.getElementById('videosContainer');
    const logoutBtn = document.getElementById('logoutBtn');
    const searchInput = document.getElementById('adminSearch');

    // Event Listeners
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (videoForm) videoForm.addEventListener('submit', handleVideoSubmit);
    if (searchInput) searchInput.addEventListener('input', debounce(loadVideos, 300));

    // Initial Load
    loadVideos();

    // Functions
    async function loadVideos() {
        try {
            const response = await fetch('/videos.json?t=' + Date.now());
            const videos = await response.json();
            renderVideos(videos);
        } catch (error) {
            console.error("Error loading videos:", error);
            showToast("Failed to load videos", "error");
        }
    }

    function renderVideos(videos) {
        if (!videosContainer) return;
        
        const searchTerm = searchInput?.value.toLowerCase() || '';
        videosContainer.innerHTML = videos
            .filter(video => 
                video.title.toLowerCase().includes(searchTerm) ||
                (video.tags && video.tags.some(tag => 
                    tag.toLowerCase().includes(searchTerm))
            )
            .map(video => `
                <div class="video-item" data-id="${video.id}">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="video-info">
                        <h3>${video.title}</h3>
                        <p>${video.categories?.join(', ') || 'No categories'}</p>
                    </div>
                    <div class="video-actions">
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                </div>
            `).join('');

        // Add event listeners
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => loadVideoForEdit(btn.closest('.video-item').dataset.id));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteVideo(btn.closest('.video-item').dataset.id));
        });
    }

    async function handleVideoSubmit(e) {
        e.preventDefault();
        
        const videoData = {
            id: document.getElementById('videoId').value || Date.now().toString(),
            title: document.getElementById('videoTitle').value,
            thumbnail: document.getElementById('videoThumbnail').value,
            doodstream: document.getElementById('videoDoodstream').value,
            terabox: document.getElementById('videoTerabox').value,
            categories: Array.from(
                document.querySelectorAll('input[name="categories"]:checked')
            ).map(el => el.value),
            tags: document.getElementById('videoTags').value?.split(',').map(t => t.trim()) || [],
            date: new Date().toISOString()
        };

        try {
            await saveVideo(videoData);
            loadVideos();
            videoForm.reset();
            showToast("Video saved successfully!", "success");
        } catch (error) {
            showToast("Failed to save video", "error");
            console.error("Error saving video:", error);
        }
    }

    async function saveVideo(videoData) {
        const currentVideos = await (await fetch('/videos.json')).json();
        const updatedVideos = currentVideos.filter(v => v.id !== videoData.id).concat(videoData);

        const response = await fetch('/.netlify/functions/update-videos', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:yourpassword') // Must match netlify.toml
            },
            body: JSON.stringify({ videos: updatedVideos })
        });

        if (!response.ok) throw new Error('Save failed');
    }

    async function deleteVideo(id) {
        if (!confirm('Are you sure you want to delete this video?')) return;
        
        try {
            const currentVideos = await (await fetch('/videos.json')).json();
            const updatedVideos = currentVideos.filter(v => v.id !== id);

            await fetch('/.netlify/functions/update-videos', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:yourpassword')
                },
                body: JSON.stringify({ videos: updatedVideos })
            });

            loadVideos();
            showToast("Video deleted", "success");
        } catch (error) {
            showToast("Failed to delete video", "error");
            console.error("Error deleting video:", error);
        }
    }

    function handleLogout() {
        sessionStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuth');
        window.location.href = '/admin/login.html';
    }

    // Utility Functions
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}
