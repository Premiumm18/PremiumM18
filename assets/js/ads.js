<script>
// Main ad initialization
function initializeAds() {
    const consent = getConsent();
    if (!consent || !consent.adsAllowed) return;

    loadAdsterraAds();
    loadPropellerAds();
    loadOGAds();
    setupPopUnderAds();
}

function initializeMinimalAds() {
    loadAdsterraBannerOnly();
}

function loadAdsterraAds() {
    // ✅ Banner
    const bannerScript = document.createElement('script');
    bannerScript.type = 'text/javascript';
    bannerScript.innerHTML = `
        atOptions = {
            'key' : 'f234672bd928711136ab51db135f5ab6',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : {}
        };
    `;
    const bannerSrc = document.createElement('script');
    bannerSrc.src = '//www.highperformanceformat.com/f234672bd928711136ab51db135f5ab6/invoke.js';
    const header = document.querySelector('header');
    header.insertAdjacentElement('afterend', bannerScript);
    header.insertAdjacentElement('afterend', bannerSrc);

    // ✅ Native
    const nativeScript = document.createElement('script');
    nativeScript.async = true;
    nativeScript.setAttribute('data-cfasync', 'false');
    nativeScript.src = '//pl26954880.profitableratecpm.com/ee85fefa867541e1001a5881a71226ff/invoke.js';

    const nativeDiv = document.createElement('div');
    nativeDiv.id = 'container-ee85fefa867541e1001a5881a71226ff';

    const footer = document.querySelector('footer');
    footer.insertAdjacentElement('beforebegin', nativeDiv);
    footer.insertAdjacentElement('beforebegin', nativeScript);
}

function loadAdsterraBannerOnly() {
    const bannerScript = document.createElement('script');
    bannerScript.type = 'text/javascript';
    bannerScript.innerHTML = `
        atOptions = {
            'key' : 'f234672bd928711136ab51db135f5ab6',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : {}
        };
    `;
    const bannerSrc = document.createElement('script');
    bannerSrc.src = '//www.highperformanceformat.com/f234672bd928711136ab51db135f5ab6/invoke.js';
    const header = document.querySelector('header');
    header.insertAdjacentElement('afterend', bannerScript);
    header.insertAdjacentElement('afterend', bannerSrc);
}

function loadPropellerAds() {
    const push = document.createElement('script');
    push.src = 'https://grookilteepsou.net/act/files/tag.min.js?z=9466241';
    push.setAttribute('data-cfasync', 'false');
    push.async = true;
    document.head.appendChild(push);
}

function loadOGAds() {
    // Placeholder for your real OGAds locker script
    const ogScript = document.createElement('script');
    ogScript.src = 'https://example.com/ogads.js';
    document.head.appendChild(ogScript);
}

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

function triggerPopUnder() {
    const popScript = document.createElement('script');
    popScript.innerHTML = `(function(s,u,z,p){
        s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);
    })(document.createElement('script'),
        'https://al5sm.com/tag.min.js',
        9466204,
        document.body||document.documentElement);`;
    document.body.appendChild(popScript);
}

function getConsent() {
    const consentString = localStorage.getItem('adultContentConsent');
    return consentString ? JSON.parse(consentString) : null;
}
</script>
