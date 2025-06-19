// Ad management system
function initializeAds() {
    // Only initialize if ads are allowed
    const consent = getConsent();
    if (!consent || !consent.adsAllowed) return;
    
    // Load Adsterra ads
    loadAdsterraAds();
    
    // Load PropellerAds
    loadPropellerAds();
    
    // Load OGAds
    loadOGAds();
    
    // Set up pop-under ads
    setupPopUnderAds();
}

function initializeMinimalAds() {
    // Load only essential ads when user denies full consent
    loadAdsterraBanners();
}

function loadAdsterraAds() {
    // Banner Ad
    const bannerAd = document.createElement('div');
    bannerAd.id = 'adsterra-banner';
    bannerAd.style.width = '728px';
    bannerAd.style.height = '90px';
    bannerAd.style.margin = '20px auto';
    bannerAd.style.backgroundColor = '#2f3542';
    bannerAd.style.display = 'flex';
    bannerAd.style.justifyContent = 'center';
    bannerAd.style.alignItems = 'center';
    bannerAd.style.color = 'white';
    bannerAd.innerHTML = '<p>Adsterra Banner Ad</p>';
    
    // Insert after header
    const header = document.querySelector('header');
    header.insertAdjacentElement('afterend', bannerAd);
    
    // Native Ad
    const nativeAd = document.createElement('div');
    nativeAd.id = 'adsterra-native';
    nativeAd.style.margin = '20px auto';
    nativeAd.style.padding = '15px';
    nativeAd.style.backgroundColor = '#2f3542';
    nativeAd.style.borderRadius = '8px';
    nativeAd.style.maxWidth = '300px';
    nativeAd.innerHTML = 
        <h3>Recommended Content</h3>
        <p>Native ad content would appear here</p>
    ;
    
    // Insert before footer
    const footer = document.querySelector('footer');
    footer.insertAdjacentElement('beforebegin', nativeAd);
    
    console.log('Adsterra ads loaded');
}

function loadPropellerAds() {
    // Push notification ads
    console.log('Initializing PropellerAds push notifications');
    
    // This would be replaced with actual PropellerAds code
    const pushScript = document.createElement('script');
    pushScript.src = 'https://example.com/propellerads.js';
    document.head.appendChild(pushScript);
}

function loadOGAds() {
    // CPA content locker
    console.log('Initializing OGAds content locker');
    
    // This would be replaced with actual OGAds code
    const ogScript = document.createElement('script');
    ogScript.src = 'https://example.com/ogads.js';
    document.head.appendChild(ogScript);
}

function setupPopUnderAds() {
    // Pop-under ad logic
    window.addEventListener('click', function(e) {
        // Check if the clicked element is a watch button
        if (e.target.closest('.watch-btn')) {
            // Only trigger popunder if ads are allowed
            const consent = getConsent();
            if (consent && consent.adsAllowed) {
                // Random chance to show popunder (e.g., 30% chance)
                if (Math.random() < 0.3) {
                    triggerPopUnder();
                }
            }
        }
    });
}

function triggerPopUnder() {
    // This would be replaced with actual popunder code
    console.log('Popunder ad triggered');
    const popunder = window.open('https://example.com/popunder', '_blank', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1,height=1');
    if (popunder) {
        setTimeout(() => {
            popunder.close();
        }, 100);
    }
}

function getConsent() {
    const consentString = localStorage.getItem('adultContentConsent');
    return consentString ? JSON.parse(consentString) : null;
}
