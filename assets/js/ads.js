<!-- Ads Logic Script -->
<script>
// Initialize all full ads if user gave consent
function initializeAds() {
    const consent = getConsent();
    if (!consent || !consent.adsAllowed) return;

    loadAdsterraAds();       // Banner + Native
    loadPropellerAds();      // Push Notifications
    loadOGAds();             // CPA Lockers
    setupPopUnderAds();      // Pop-under
}

// Fallback minimal ads (e.g. banner only) for users who click "No"
function initializeMinimalAds() {
    loadAdsterraBanners();
}

// Load full Adsterra Ads (banner + native)
function loadAdsterraAds() {
    // 📌 Banner Ad (468x60) - Insert below header
    const bannerWrap = document.createElement('div');
    bannerWrap.innerHTML = `
        <script type="text/javascript">
            atOptions = {
                'key' : 'f234672bd928711136ab51db135f5ab6',
                'format' : 'iframe',
                'height' : 60,
                'width' : 468,
                'params' : {}
            };
        </script>
        <script type="text/javascript" src="//www.highperformanceformat.com/f234672bd928711136ab51db135f5ab6/invoke.js"></script>
    `;
    const header = document.querySelector('header');
    header.insertAdjacentElement('afterend', bannerWrap);

    // 📌 Native Ad - Insert above footer
    const nativeWrap = document.createElement('div');
    nativeWrap.innerHTML = `
        <script async="async" data-cfasync="false" src="//pl26954880.profitableratecpm.com/ee85fefa867541e1001a5881a71226ff/invoke.js"></script>
        <div id="container-ee85fefa867541e1001a5881a71226ff"></div>
    `;
    const footer = document.querySelector('footer');
    footer.insertAdjacentElement('beforebegin', nativeWrap);

    console.log('✅ Adsterra Banner + Native ads loaded');
}

// Load Adsterra banner only (for users who denied push/lockers)
function loadAdsterraBanners() {
    const bannerWrap = document.createElement('div');
    bannerWrap.innerHTML = `
        <script type="text/javascript">
            atOptions = {
                'key' : 'f234672bd928711136ab51db135f5ab6',
                'format' : 'iframe',
                'height' : 60,
                'width' : 468,
                'params' : {}
            };
        </script>
        <script type="text/javascript" src="//www.highperformanceformat.com/f234672bd928711136ab51db135f5ab6/invoke.js"></script>
    `;
    const header = document.querySelector('header');
    header.insertAdjacentElement('afterend', bannerWrap);

    console.log('✅ Minimal Adsterra banner loaded');
}

// Load PropellerAds Push Notification
function loadPropellerAds() {
    const pushScript = document.createElement('script');
    pushScript.src = "https://grookilteepsou.net/act/files/tag.min.js?z=9466241";
    pushScript.setAttribute('data-cfasync', 'false');
    pushScript.async = true;
    document.head.appendChild(pushScript);

    console.log('✅ PropellerAds push notifications initialized');
}

// Load OGAds content locker (placeholder script path)
function loadOGAds() {
    // Replace below with your real OGAds embed or JS locker
    const ogScript = document.createElement('script');
    ogScript.src = 'https://example.com/ogads.js';  // <-- Replace this when ready
    document.head.appendChild(ogScript);

    console.log('⚠️ OGAds locker loaded (placeholder)');
}

// Setup pop-under trigger on click
function setupPopUnderAds() {
    window.addEventListener('click', function(e) {
        if (e.target.closest('.watch-btn')) {
            const consent = getConsent();
            if (consent && consent.adsAllowed && Math.random() < 0.3) {
                triggerPopUnder();
            }
        }
    });
}

// Trigger pop-under (30% random chance)
function triggerPopUnder() {
    const popScript = document.createElement('script');
    popScript.innerHTML = `(function(s,u,z,p){
        s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);
    })(document.createElement('script'),
        'https://al5sm.com/tag.min.js',
        9466204,
        document.body||document.documentElement);`;
    document.body.appendChild(popScript);

    console.log('✅ Pop-under ad triggered');
}

// Get user's ad consent from localStorage
function getConsent() {
    const consentString = localStorage.getItem('adultContentConsent');
    return consentString ? JSON.parse(consentString) : null;
}
</script>
