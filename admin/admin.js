document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const videoForm = document.getElementById('video-form');
  const videoList = document.getElementById('video-list');
  const searchInput = document.getElementById('admin-search');

  // Load videos on page load
  loadVideos();

  // Form submission
  videoForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const videoData = {
      id: document.getElementById('video-id').value || Date.now().toString(),
      title: document.getElementById('video-title').value,
      thumbnail: document.getElementById('video-thumbnail').value,
      doodstream: document.getElementById('video-doodstream').value,
      terabox: document.getElementById('video-terabox').value,
      categories: Array.from(
        document.querySelectorAll('input[name="categories"]:checked')
      ).map(el => el.value),
      tags: document.getElementById('video-tags').value.split(',').map(t => t.trim()),
      date: document.getElementById('video-date').value || new Date().toISOString()
    };

    await saveVideo(videoData);
    loadVideos();
    videoForm.reset();
  });

  // Search functionality
  searchInput.addEventListener('input', debounce(loadVideos, 300));

  // Functions
  async function loadVideos() {
    try {
      const response = await fetch('/videos.json');
      const videos = await response.json();
      renderVideos(videos);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  }

  function renderVideos(videos) {
    videoList.innerHTML = '';
    
    const searchTerm = searchInput.value.toLowerCase();
    const filteredVideos = videos.filter(video => 
      video.title.toLowerCase().includes(searchTerm) ||
      (video.tags && video.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm))
    );

    filteredVideos.forEach(video => {
      const videoItem = document.createElement('div');
      videoItem.className = 'video-item';
      videoItem.innerHTML = `
        <div class="video-info">
          <h3>${video.title}</h3>
          <p>Categories: ${video.categories.join(', ')}</p>
          <p>Date: ${new Date(video.date).toLocaleDateString()}</p>
        </div>
        <div class="video-actions">
          <button class="edit-btn" data-id="${video.id}">Edit</button>
          <button class="delete-btn" data-id="${video.id}">Delete</button>
        </div>
      `;
      videoList.appendChild(videoItem);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => loadVideoForEdit(btn.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteVideo(btn.dataset.id));
    });
  }

  async function loadVideoForEdit(id) {
    const response = await fetch('/videos.json');
    const videos = await response.json();
    const video = videos.find(v => v.id === id);

    if (video) {
      document.getElementById('video-id').value = video.id;
      document.getElementById('video-title').value = video.title;
      document.getElementById('video-thumbnail').value = video.thumbnail;
      document.getElementById('video-doodstream').value = video.doodstream;
      document.getElementById('video-terabox').value = video.terabox;
      document.getElementById('video-tags').value = video.tags?.join(', ') || '';
      document.getElementById('video-date').value = video.date.split('T')[0];
      
      document.querySelectorAll('input[name="categories"]').forEach(checkbox => {
        checkbox.checked = video.categories.includes(checkbox.value);
      });
    }
  }

  async function saveVideo(videoData) {
    const response = await fetch('/videos.json');
    let videos = await response.json();
    
    const existingIndex = videos.findIndex(v => v.id === videoData.id);
    if (existingIndex >= 0) {
      videos[existingIndex] = videoData;
    } else {
      videos.push(videoData);
    }

    // Save via Netlify function
    const saveResponse = await fetch('/.netlify/functions/update-videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('sagor321:yourpassword')
      },
      body: JSON.stringify({ videos })
    });

    if (!saveResponse.ok) {
      throw new Error('Failed to save videos');
    }
  }

  async function deleteVideo(id) {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    const response = await fetch('/videos.json');
    let videos = await response.json();
    videos = videos.filter(video => video.id !== id);

    const saveResponse = await fetch('/.netlify/functions/update-videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('sagor321:yourpassword')
      },
      body: JSON.stringify({ videos })
    });

    if (saveResponse.ok) {
      loadVideos();
    }
  }

  // Utility function
  function debounce(func, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
});
