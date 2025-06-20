// Consent management
document.addEventListener('DOMContentLoaded', function () {
    const consentPopup = document.getElementById('consent-popup');
    const allowBtn = document.getElementById('consent-allow');
    const denyBtn = document.getElementById('consent-deny');
    const exitBtn = document.getElementById('consent-exit');

    // Check existing consent
    const consent = getConsent();

    if (!consent) {
        // User has not yet made a choice — block site until they do
        document.body.classList.add('block-scroll', 'consent-not-accepted');
        setTimeout(() => {
            consentPopup.classList.remove('hidden');
        }, 500);
    } else {
        // Consent previously set
        document.body.classList.remove('block-scroll', 'consent-not-accepted');
        if (consent.adsAllowed) {
            initializeAds();
        } else {
            initializeMinimalAds();
        }
    }

    // Handle "I'm 18+" (Allow)
    allowBtn.addEventListener('click', () => {
        setConsent(true);
        consentPopup.classList.add('hidden');
        document.body.classList.remove('block-scroll', 'consent-not-accepted');
        initializeAds();
        showNotificationPermissionRequest();
    });

    // Handle "I'm Not 18+" (Deny)
    denyBtn.addEventListener('click', () => {
        setConsent(false);
        consentPopup.classList.add('hidden');
        document.body.classList.remove('block-scroll', 'consent-not-accepted');
        initializeMinimalAds();
    });

    // Handle "Exit" (optional extra button)
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            window.location.href = 'https://www.google.com';
        });
    }

    // Helpers
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
        if (consent && consent.adsAllowed && Notification && Notification.permission !== 'granted') {
            setTimeout(() => {
                const confirmResult = confirm('For a better experience, allow browser notifications. You can disable this anytime.');
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

    // Placeholder ad loading logic — replace with actual ad code if needed
    function initializeAds() {
        console.log("✅ Full Ads Enabled");
        // Your ad setup code here...
    }

    function initializeMinimalAds() {
        console.log("⚠️ Limited Ads Only");
        // Minimal ads or none at all...
    }
});
