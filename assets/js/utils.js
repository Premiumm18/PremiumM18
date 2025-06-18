/**
 * UTILS.JS - Shared utility functions for Premium 18+ Video Site
 * Central location for reusable helper functions
 */

// ====================== CONSENT MANAGEMENT ======================
export function getConsent() {
    try {
        const consent = localStorage.getItem('adultContentConsent');
        return consent ? JSON.parse(consent) : null;
    } catch (e) {
        console.error('Error reading consent:', e);
        return null;
    }
}

export function setConsent(adsAllowed) {
    const consent = {
        consented: true,
        adsAllowed: adsAllowed,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    localStorage.setItem('adultContentConsent', JSON.stringify(consent));
}

// ====================== URL HANDLING ======================
export function getUrlParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

export function updateUrlParams(newParams) {
    const params = new URLSearchParams(window.location.search);
    Object.entries(newParams).forEach(([key, value]) => {
        params.set(key, value);
    });
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
}

// ====================== DATE/TIME ======================
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    return 'Just now';
}

// ====================== UI HELPERS ======================
export function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    
    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            padding: 12px 20px;
            margin-bottom: 10px;
            color: white;
            border-radius: 4px;
            animation: fadeIn 0.3s, fadeOut 0.3s ${duration/1000 - 0.3}s;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .toast-info { background: #3498db; }
        .toast-success { background: #2ecc71; }
        .toast-warning { background: #f39c12; }
        .toast-error { background: #e74c3c; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } }
        @keyframes fadeOut { to { opacity: 0; transform: translateY(-10px); } }
    `;
    document.head.appendChild(style);

    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// ====================== PERFORMANCE HELPERS ======================
export function debounce(func, wait = 300) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export function throttle(func, limit = 300) {
    let lastFunc;
    let lastRan;
    return function(...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// ====================== MEDIA HELPERS ======================
export function preloadImages(imageUrls) {
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

export function checkWebPSupport() {
    return new Promise(resolve => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// ====================== VALIDATION HELPERS ======================
export function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ====================== MISC HELPERS ======================
export function generateId(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}

export function copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
}

export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}