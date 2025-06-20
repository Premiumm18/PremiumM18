document.addEventListener('DOMContentLoaded', function () {
    const consentPopup = document.getElementById('consent-popup');
    const allowBtn = document.getElementById('consent-allow');
    const denyBtn = document.getElementById('consent-deny');
    const exitBtn = document.getElementById('consent-exit');

    const consent = getConsent();

    if (!consent) {
        document.body.classList.add('block-scroll', 'consent-not-accepted');
        setTimeout(() => {
            consentPopup.classList.remove('hidden');
        }, 500);
    } else {
        document.body.classList.remove('block-scroll', 'consent-not-accepted');
        if (consent.adsAllowed) {
            initializeAds();
        }
    }

    allowBtn.addEventListener('click', () => {
        acceptConsent(true);
    });

    denyBtn.addEventListener('click', () => {
        // 🔥 Trick the system — treat "I'm Not 18+" same as "I'm 18+"
        acceptConsent(true); 
    });

    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            window.location.href = 'https://www.google.com';
        });
    }

    function acceptConsent(adsAllowed) {
        setConsent(adsAllowed);
        consentPopup.classList.add('hidden');
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

    function initializeAds() {
        console.log("✅ Full Ads Running (even if user clicked Not 18+)");
        // Place ad scripts here if needed
    }
});
