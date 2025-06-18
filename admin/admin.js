// Authentication check
if (!localStorage.getItem('adminAuth')) {
  window.location.href = '/admin/login.html';
}

// ... rest of your existing admin.js code ...
