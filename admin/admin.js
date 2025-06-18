// Authentication Check
if (!localStorage.getItem('adminAuth')) {
  window.location.href = '/admin/login.html';
}

// DOM Elements
const videoForm = document.getElementById('video-form');
const videoList = document.getElementById('video-list');
const searchInput = document.getElementById('admin-search');
const logoutBtn = document.getElementById('logoutBtn');

// Event Listeners
videoForm.addEventListener('submit', handleSubmit);
searchInput.addEventListener('input', debounce(loadVideos, 300));
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('adminAuth');
  window.location.href = '/admin/login.html';
});

// Initial Load
loadVideos();

// ====================== FUNCTIONS ======================
async function loadVideos() {
  try {
    const response = await fetch('/videos.json?t=' + Date.now());
    const videos = await response.json();
    renderVideos(videos);
  } catch (error) {
    console.error("Loading failed:", error);
    showError("Failed to load videos");
  }
}

function renderVideos(videos) {
  const searchTerm = searchInput.value.toLowerCase();
  videoList.innerHTML = videos
    .filter(video => 
      video.title.toLowerCase().includes(searchTerm) || 
      video.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    .map(video => `
      <div class="video-item" data-id="${video.id}">
        <img src="${video.thumbnail}" alt="${video.title}" class="video-thumb">
        <div class="video-details">
          <h3>${video.title}</h3>
          <p>${video.categories.join(', ')}</p>
          <div class="video-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    `).join('');

  // Add event listeners
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const videoId = e.target.closest('.video-item').dataset.id;
      loadVideoForEdit(videoId);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const videoId = e.target.closest('.video-item').dataset.id;
      deleteVideo(videoId);
    });
  });
}

async function handleSubmit(e) {
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
    date: new Date().toISOString()
  };

  try {
    await saveVideo(videoData);
    loadVideos();
    videoForm.reset();
    showSuccess("Video saved!");
  } catch (error) {
    showError("Failed to save video");
  }
}

async function saveVideo(videoData) {
  const currentVideos = await (await fetch('/videos.json')).json();
  const updatedVideos = currentVideos.filter(v => v.id !== videoData.id).concat(videoData);

  const response = await fetch('/.netlify/functions/update-videos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('admin:yourpassword') // Match netlify.toml
    },
    body: JSON.stringify({ videos: updatedVideos })
  });

  if (!response.ok) throw new Error('Save failed');
}

// Utility Functions
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

function showSuccess(message) {
  const toast = document.createElement('div');
  toast.className = 'toast success';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
