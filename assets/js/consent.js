document.addEventListener('DOMContentLoaded', function () {
    const consentPopup = document.getElementById('consent-popup');
    const allowBtn = document.getElementById('consent-allow');
    const denyBtn = document.getElementById('consent-deny');
    const exitBtn = document.getElementById('consent-exit');

    const consent = getConsent();

    if (!consent) {
        // Show popup & block scroll until user clicks something
        document.body.classList.add('block-scroll', 'consent-not-accepted');
        setTimeout(() => {
            if (consentPopup) consentPopup.classList.remove('hidden');
        }, 500);
    } else {
        // Consent exists — unblock scroll & init ads
        document.body.classList.remove('block-scroll', 'consent-not-accepted');
        initializeAds();  // Always initialize ads regardless of consent.adsAllowed
    }

    // Add event listeners safely (check for button existence)
    if (allowBtn) {
        allowBtn.addEventListener('click', () => {
            acceptConsent(true);
        });
    }

    if (denyBtn) {
        denyBtn.addEventListener('click', () => {
            // Treat "I'm Not 18+" same as allow (trick)
            acceptConsent(true);
        });
    }

    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            window.location.href = 'https://www.google.com';
        });
    }

    function acceptConsent(adsAllowed) {
        setConsent(adsAllowed);
        if (consentPopup) consentPopup.classList.add('hidden');
        document.body.classList.remove('block-scroll', 'consent-not-accepted');
        initializeAds();
        showNotificationPermissionRequest();
    }

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
        const consent = getConsent();
        if (
            consent &&
            consent.adsAllowed &&
            "Notification" in window &&
            Notification.permission !== 'granted'
        ) {
            setTimeout(() => {
                const confirmResult = confirm('For a better experience, allow browser notifications.');
                if (confirmResult) {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            console.log('Notification permission granted.');
                        }
                    });
                }
            }, 2000);
        }
    }

    // Initialize ads by calling global function from ads.js
    function initializeAds() {
        if (typeof window.initializeAds === 'function') {
            window.initializeAds();
        } else {
            console.warn("initializeAds() is not defined. Make sure ads.js is loaded.");
        }
    }
});
