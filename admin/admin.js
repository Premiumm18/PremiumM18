// Make sure you include these Firebase SDK scripts in your admin/index.html before this script:
// <script src="https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js"></script>
// <script src="https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js"></script>

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC_p2iYOTHmlHfxaH1NLIxTBcLwTY8UgXc",
  authDomain: "premium-videos-admin.firebaseapp.com",
  projectId: "premium-videos-admin",
  storageBucket: "premium-videos-admin.firebasestorage.app",
  messagingSenderId: "14153291045",
  appId: "1:14153291045:web:dab7f5b270ccf4627ab6cc",
  measurementId: "G-YB642WNF2Q"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Protect admin page: redirect to login if not authenticated
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = '/admin/login.html';
  } else {
    // User logged in, initialize admin panel
    initAdmin();
  }
});

// DOM elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.admin-section');
const addVideoBtn = document.getElementById('add-video-btn');
const videoForm = document.getElementById('video-form');
const cancelEditBtn = document.getElementById('cancel-edit');
const videoList = document.getElementById('video-list');
const adminSearch = document.getElementById('admin-search');
const adminSearchBtn = document.getElementById('admin-search-btn');
const logoutBtn = document.getElementById('logout-btn');

// State variables
let videos = [];
let currentVideoId = null;

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
logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = '/admin/login.html';
  });
});

// Functions

function initAdmin() {
  // Load videos from Firebase Realtime Database
  database.ref('videos').once('value').then(snapshot => {
    const videosObj = snapshot.val() || {};
    videos = Object.values(videosObj);
    renderVideoList(videos);
  }).catch(err => {
    console.error('Error loading videos from Firebase:', err);
    videoList.innerHTML = '<p class="error">Failed to load videos. Please try again later.</p>';
  });

  // Show videos section initially
  sections.forEach(s => s.classList.add('hidden'));
  document.getElementById('videos-section').classList.remove('hidden');

  // Set active nav link to Videos
  navLinks.forEach(l => l.classList.remove('active'));
  document.querySelector('.nav-link[data-section="videos"]').classList.add('active');
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

    await saveVideos(videos);

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
    videos = videos.filter(v => v.id !== videoId);
    await saveVideos(videos);
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
  const videoObj = {};
  updatedVideos.forEach(video => {
    videoObj[video.id] = video;
  });

  await database.ref("videos").set(videoObj);
}
