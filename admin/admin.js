// Initialize Firebase - replace with your config
const firebaseConfig = {
  apiKey: "AIzaSyC_p2iYOTHmlHfxaH1NLIxTBcLwTY8UgXc",
  authDomain: "premium-videos-admin.firebaseapp.com",
  databaseURL: "https://premium-videos-admin-default-rtdb.firebaseio.com",
  projectId: "premium-videos-admin",
  storageBucket: "premium-videos-admin.appspot.com",
  messagingSenderId: "14153291045",
  appId: "1:14153291045:web:dab7f5b270ccf4627ab6cc"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

const logoutBtn = document.getElementById('logout-btn');
const btnViewVideos = document.getElementById('btn-view-videos');
const btnAddVideo = document.getElementById('btn-add-video');
const videoListSection = document.getElementById('video-list-section');
const videoFormSection = document.getElementById('video-form-section');
const videoListBody = document.getElementById('video-list-body');
const noVideosMsg = document.getElementById('no-videos-msg');
const searchInput = document.getElementById('search-input');

const videoForm = document.getElementById('video-form');
const formTitle = document.getElementById('form-title');
const statusMsg = document.getElementById('status-msg');

let videos = [];
let editingVideoId = null;

// Auth check & redirect to login if not logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = '/admin/login.html';
  } else {
    loadVideos();
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = '/admin/login.html';
  });
});

// Show videos list, hide form
btnViewVideos.addEventListener('click', () => {
  toggleView('list');
});

// Show add video form
btnAddVideo.addEventListener('click', () => {
  editingVideoId = null;
  formTitle.textContent = 'Add New Video';
  videoForm.reset();
  toggleView('form');
});

// Search videos
searchInput.addEventListener('input', () => {
  const term = searchInput.value.trim().toLowerCase();
  renderVideos(term);
});

// Load all videos from Firebase
function loadVideos() {
  database.ref('videos').once('value').then(snapshot => {
    const data = snapshot.val() || {};
    videos = Object.values(data);
    renderVideos();
  }).catch(err => {
    console.error('Failed to load videos:', err);
  });
}

// Render videos to table with optional search filter
function renderVideos(searchTerm = '') {
  videoListBody.innerHTML = '';
  const filteredVideos = videos.filter(v => {
    return (
      v.title.toLowerCase().includes(searchTerm) ||
      (v.tags && v.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  });

  if (filteredVideos.length === 0) {
    noVideosMsg.style.display = 'block';
    return;
  } else {
    noVideosMsg.style.display = 'none';
  }

  filteredVideos.forEach(video => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${video.thumbnail}" alt="${video.title}" style="width:100px; height:60px; object-fit:cover; border-radius:4px;"></td>
      <td>${video.title}</td>
      <td>${(video.categories || []).join(', ')}</td>
      <td>${video.date}</td>
      <td>${(video.tags || []).join(', ')}</td>
      <td>
        <button class="edit-btn" data-id="${video.id}" title="Edit"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${video.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    videoListBody.appendChild(tr);
  });

  // Attach event listeners for edit/delete
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      editVideo(id);
    };
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      deleteVideo(id);
    };
  });
}

// Show add/edit video form and populate if editing
function editVideo(id) {
  const video = videos.find(v => v.id === id);
  if (!video) return alert('Video not found');
  editingVideoId = id;
  formTitle.textContent = 'Edit Video';

  videoForm['video-id'].value = video.id || '';
  videoForm['video-title'].value = video.title || '';
  videoForm['video-thumbnail'].value = video.thumbnail || '';
  videoForm['video-doodstream'].value = video.doodstream || '';
  videoForm['video-terabox'].value = video.terabox || '';
  videoForm['video-date'].value = video.date || '';
  videoForm['video-tags'].value = (video.tags || []).join(', ');

  // Set categories checkboxes
  const categoriesCheckboxes = videoForm.querySelectorAll('input[name="categories"]');
  categoriesCheckboxes.forEach(cb => {
    cb.checked = video.categories?.includes(cb.value) || false;
  });

  toggleView('form');
}

// Delete video by ID
function deleteVideo(id) {
  if (!confirm('Are you sure you want to delete this video?')) return;
  database.ref('videos/' + id).remove()
    .then(() => {
      videos = videos.filter(v => v.id !== id);
      renderVideos(searchInput.value.toLowerCase());
    })
    .catch(err => alert('Failed to delete video: ' + err));
}

// Form submit handler: create or update video
videoForm.addEventListener('submit', e => {
  e.preventDefault();
  statusMsg.textContent = '';

  const id = editingVideoId || Date.now().toString();
  const title = videoForm['video-title'].value.trim();
  const thumbnail = videoForm['video-thumbnail'].value.trim();
  const doodstream = videoForm['video-doodstream'].value.trim();
  const terabox = videoForm['video-terabox'].value.trim();
  const date = videoForm['video-date'].value;
  const tags = videoForm['video-tags'].value
    .split(',')
    .map(t => t.trim())
    .filter(t => t);
  const categories = Array.from(videoForm.querySelectorAll('input[name="categories"]:checked')).map(cb => cb.value);

  if (!title || !thumbnail || !doodstream || !terabox || !date) {
    statusMsg.textContent = 'Please fill all required fields.';
    statusMsg.style.color = 'var(--error-color)';
    return;
  }

  const videoData = {
    id,
    title,
    thumbnail,
    doodstream,
    terabox,
    date,
    tags,
    categories
  };

  database.ref('videos/' + id).set(videoData)
    .then(() => {
      statusMsg.textContent = 'Video saved successfully!';
      statusMsg.style.color = 'var(--success-color)';

      // Update local array
      const index = videos.findIndex(v => v.id === id);
      if (index === -1) {
        videos.push(videoData);
      } else {
        videos[index] = videoData;
      }

      toggleView('list');
      renderVideos(searchInput.value.toLowerCase());
    })
    .catch(err => {
      statusMsg.textContent = 'Failed to save video: ' + err.message;
      statusMsg.style.color = 'var(--error-color)';
    });
});

// Cancel button hides form, shows list
document.getElementById('cancel-btn').addEventListener('click', () => {
  toggleView('list');
});

// Toggle between views: 'list' or 'form'
function toggleView(view) {
  if (view === 'list') {
    videoListSection.style.display = 'block';
    videoFormSection.style.display = 'none';
    btnViewVideos.classList.add('active');
    btnAddVideo.classList.remove('active');
  } else {
    videoListSection.style.display = 'none';
    videoFormSection.style.display = 'block';
    btnViewVideos.classList.remove('active');
    btnAddVideo.classList.add('active');
    statusMsg.textContent = '';
  }
}
