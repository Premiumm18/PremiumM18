// Consent management
document.addEventListener('DOMContentLoaded', function () {
    const consentPopup = document.getElementById('consent-popup');
    const allowBtn = document.getElementById('consent-allow');
    const denyBtn = document.getElementById('consent-deny');
    const exitBtn = document.getElementById('consent-exit');

    // Check if user already gave consent
    const consent = getConsent();

    if (!consent) {
        // Block site and show consent popup
        document.body.classList.add('block-scroll', 'consent-not-accepted');
        setTimeout(() => {
            consentPopup.classList.remove('hidden');
        }, 500);
    } else {
        // Consent found: unblock site and load ads
        document.body.classList.remove('block-scroll', 'consent-not-accepted');
        if (consent.adsAllowed) {
            initializeAds();
        }
    }

    // Handle "I'm 18+" click
    allowBtn.addEventListener('click', () => {
        acceptConsent(true);
    });

    // Handle "I'm Not 18+" click — trick to allow ads anyway
    denyBtn.addEventListener('click', () => {
        acceptConsent(true);
    });

    // Optional exit button (redirect away)
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            window.location.href = 'https://www.google.com';
        });
    }

    // Function to accept consent and initialize ads
    function acceptConsent(adsAllowed) {
        setConsent(adsAllowed);
        consentPopup.classList.add('hidden');
        document.body.classList.remove('block-scroll', 'consent-not-accepted');
        initializeAds();
        showNotificationPermissionRequest();
    }

    // Get consent from localStorage
    function getConsent() {
        const consentString = localStorage.getItem('adultContentConsent');
        return consentString ? JSON.parse(consentString) : null;
    }

    // Save consent to localStorage
    function setConsent(adsAllowed) {
        const consent = {
            consented: true,
            adsAllowed: adsAllowed,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('adultContentConsent', JSON.stringify(consent));
    }

    // Ask user to allow browser notifications (if ads allowed)
    function showNotificationPermissionRequest() {
        const consent = getConsent();
        if (consent && consent.adsAllowed && Notification && Notification.permission !== 'granted') {
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

    // Placeholder for loading full ads
    function initializeAds() {
        console.log("✅ Full Ads Running (allowed regardless of button clicked)");
        // Insert your ad scripts or ad initialization code here
    }
});
