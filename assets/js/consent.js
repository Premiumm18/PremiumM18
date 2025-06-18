// Consent management
document.addEventListener('DOMContentLoaded', function() {
    const consentPopup = document.getElementById('consent-popup');
    const allowBtn = document.getElementById('consent-allow');
    const denyBtn = document.getElementById('consent-deny');
    const exitBtn = document.getElementById('consent-exit');
    
    // Check if consent has already been given
    const consent = getConsent();
    
    if (!consent) {
        // Show consent popup if no consent has been given yet
        setTimeout(() => {
            consentPopup.classList.remove('hidden');
        }, 1000);
    } else if (consent.adsAllowed) {
        // Initialize ads if allowed
        initializeAds();
    }
    
    // Event listeners for consent buttons
    allowBtn.addEventListener('click', () => {
        setConsent(true);
        consentPopup.classList.add('hidden');
        initializeAds();
        showNotificationPermissionRequest();
    });
    
    denyBtn.addEventListener('click', () => {
        setConsent(false);
        consentPopup.classList.add('hidden');
        initializeMinimalAds();
    });
    
    exitBtn.addEventListener('click', () => {
        // Redirect away or close the site
        window.location.href = 'https://www.google.com';
    });
    
    // Functions
    function getConsent() {
        const consentString = localStorage.getItem('adultContentConsent');
        return consentString ? JSON.parse(consentString) : null;
    }
    
    function setConsent(adsAllowed) {
        const consent = {
            consented: true,
            adsAllowed: adsAllowed,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('adultContentConsent', JSON.stringify(consent));
    }
    
    function showNotificationPermissionRequest() {
        // Only show if ads are allowed
        const consent = getConsent();
        if (consent && consent.adsAllowed) {
            setTimeout(() => {
                const shouldShow = confirm('For a better experience, allow notifications. You can change this later in your browser settings.');
                if (shouldShow) {
                    // Request notification permission
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            console.log('Notification permission granted');
                            // You can now show notifications
                        }
                    });
                }
            }, 2000);
        }
    }
});