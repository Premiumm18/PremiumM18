// ✅ FULL admin.js SCRIPT (Firebase + Auth + CRUD)

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_p2iYOTHmlHfxaH1NLIxTBcLwTY8UgXc",
  authDomain: "premium-videos-admin.firebaseapp.com",
  projectId: "premium-videos-admin",
  storageBucket: "premium-videos-admin.appspot.com",
  messagingSenderId: "14153291045",
  appId: "1:14153291045:web:dab7f5b270ccf4627ab6cc"
};
firebase.initializeApp(firebaseConfig);

// ✅ Redirect to login if not authenticated
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location.href = '/admin/login.html';
  }
});

// Admin panel functionality

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.admin-section');
  const addVideoBtn = document.getElementById('add-video-btn');
  const videoForm = document.getElementById('video-form');
  const cancelEditBtn = document.getElementById('cancel-edit');
  const videoList = document.getElementById('video-list');
  const adminSearch = document.getElementById('admin-search');
  const adminSearchBtn = document.getElementById('admin-search-btn');

  let videos = [];
  let currentVideoId = null;

  initAdmin();

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const sectionId = link.dataset.section + '-section';
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      sections.forEach(s => s.classList.add('hidden'));
      document.getElementById(sectionId).classList.remove('hidden');
    });
  });

  addVideoBtn.addEventListener('click', showAddVideoForm);
  cancelEditBtn.addEventListener('click', cancelEdit);
  videoForm.addEventListener('submit', handleVideoSubmit);
  adminSearchBtn.addEventListener('click', performAdminSearch);
  adminSearch.addEventListener('keypress', e => {
    if (e.key === 'Enter') performAdminSearch();
  });

  async function initAdmin() {
    try {
      const snapshot = await firebase.database().ref('videos').once('value');
      videos = Object.values(snapshot.val() || {});
      renderVideoList(videos);
    } catch (error) {
      console.error('Error loading videos:', error);
      videoList.innerHTML = '<p class="error">Failed to load videos.</p>';
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
    videoForm.reset();
    document.querySelectorAll('input[name="categories"]').forEach(cb => cb.checked = false);
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
    document.querySelectorAll('input[name="categories"]').forEach(cb => cb.checked = video.categories.includes(cb.value));
    sections.forEach(s => s.classList.add('hidden'));
    document.getElementById('add-edit-section').classList.remove('hidden');
  }

  function cancelEdit() {
    sections.forEach(s => s.classList.add('hidden'));
    document.getElementById('videos-section').classList.remove('hidden');
  }

  async function handleVideoSubmit(e) {
    e.preventDefault();
    const formData = {
      id: document.getElementById('video-id').value || generateId(),
      title: document.getElementById('video-title').value,
      thumbnail: document.getElementById('video-thumbnail').value,
      doodstream: document.getElementById('video-doodstream').value,
      terabox: document.getElementById('video-terabox').value,
      categories: Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(cb => cb.value),
      tags: document.getElementById('video-tags').value.split(',').map(t => t.trim()).filter(t => t),
      date: document.getElementById('video-date').value
    };

    try {
      if (currentVideoId) {
        const index = videos.findIndex(v => v.id === currentVideoId);
        if (index !== -1) videos[index] = formData;
      } else {
        videos.push(formData);
      }

      await saveVideos(videos);
      renderVideoList(videos);
      cancelEdit();
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Failed to save video.');
    }
  }

  async function deleteVideo(videoId) {
    if (!confirm('Are you sure?')) return;
    videos = videos.filter(v => v.id !== videoId);
    await saveVideos(videos);
    renderVideoList(videos);
  }

  function performAdminSearch() {
    const term = adminSearch.value.trim().toLowerCase();
    if (!term) return renderVideoList(videos);
    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(term) ||
      (video.tags && video.tags.some(tag => tag.toLowerCase().includes(term)))
    );
    renderVideoList(filtered);
  }

  function generateId() {
    return Date.now().toString();
  }

  async function saveVideos(updatedVideos) {
    const videoObj = {};
    updatedVideos.forEach(video => {
      videoObj[video.id] = video;
    });
    await firebase.database().ref("videos").set(videoObj);
  }
});
