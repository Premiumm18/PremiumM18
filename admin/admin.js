// Authentication check (add to top)
if (!localStorage.getItem('adminAuth')) {
  window.location.href = '/admin/login.html';
}

// DOM Elements
const videoForm = document.getElementById('videoForm');
const videosContainer = document.getElementById('videosContainer');
const logoutBtn = document.getElementById('logoutBtn');

// Load videos on page load
loadVideos();

// Form submission handler
videoForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const videoData = {
    id: document.getElementById('videoId').value || Date.now().toString(),
    title: document.getElementById('videoTitle').value,
    thumbnail: document.getElementById('videoThumbnail').value,
    doodstream: document.getElementById('videoDoodstream').value,
    terabox: document.getElementById('videoTerabox').value,
    date: new Date().toISOString()
  };

  await saveVideo(videoData);
  loadVideos();
  videoForm.reset();
});

// Logout handler
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('adminAuth');
  window.location.href = '/admin/login.html';
});

// Load videos function
async function loadVideos() {
  try {
    const response = await fetch('/videos.json');
    const videos = await response.json();
    renderVideos(videos);
  } catch (error) {
    console.error("Error loading videos:", error);
    alert("Failed to load videos");
  }
}

// Render videos to DOM
function renderVideos(videos) {
  videosContainer.innerHTML = videos.map(video => `
    <div class="video-item" data-id="${video.id}">
      <img src="${video.thumbnail}" alt="${video.title}">
      <h3>${video.title}</h3>
      <div class="video-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
  `).join('');

  // Add event listeners
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const videoId = btn.closest('.video-item').dataset.id;
      loadVideoForEdit(videoId);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const videoId = btn.closest('.video-item').dataset.id;
      if (confirm('Delete this video permanently?')) {
        deleteVideo(videoId);
      }
    });
  });
}

// Load video data into form
async function loadVideoForEdit(videoId) {
  const response = await fetch('/videos.json');
  const videos = await response.json();
  const video = videos.find(v => v.id === videoId);

  if (video) {
    document.getElementById('videoId').value = video.id;
    document.getElementById('videoTitle').value = video.title;
    document.getElementById('videoThumbnail').value = video.thumbnail;
    document.getElementById('videoDoodstream').value = video.doodstream;
    document.getElementById('videoTerabox').value = video.terabox;
  }
}

// Save video to server
async function saveVideo(videoData) {
  try {
    const currentVideos = await (await fetch('/videos.json')).json();
    const updatedVideos = currentVideos.filter(v => v.id !== videoData.id).concat(videoData);

    const response = await fetch('/.netlify/functions/update-videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videos: updatedVideos })
    });

    if (!response.ok) throw new Error('Save failed');
    alert('Video saved successfully!');
  } catch (error) {
    console.error("Error saving video:", error);
    alert("Failed to save video");
  }
}

// Delete video
async function deleteVideo(videoId) {
  try {
    const currentVideos = await (await fetch('/videos.json')).json();
    const updatedVideos = currentVideos.filter(v => v.id !== videoId);

    const response = await fetch('/.netlify/functions/update-videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videos: updatedVideos })
    });

    if (response.ok) {
      loadVideos();
      alert('Video deleted!');
    }
  } catch (error) {
    console.error("Error deleting video:", error);
    alert("Failed to delete video");
  }
}
