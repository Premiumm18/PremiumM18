// ✅ Get consent info from localStorage
function getConsent() {
    const consentString = localStorage.getItem('adultContentConsent');
    return consentString ? JSON.parse(consentString) : null;
}

// ✅ Main ad initializer
function initializeAds() {
    const consent = getConsent();
    if (!consent || !consent.adsAllowed) return;

    loadAdsterraBanner();
    loadAdsterraNativeCompact(); // Short native banner
    loadPropellerAds();
    loadOGAds();
    setupPopUnderAds();
    setupSearchClickAd();        // Direct link on search bar
    loadSocialBar();             // Load Social Bar
}

// ✅ Minimal (for non-consent users)
function initializeMinimalAds() {
    loadAdsterraBanner();
}

// ✅ Load Adsterra Banner (Main Mid-Banner)
function loadAdsterraBanner() {
    const atScript = document.createElement("script");
    atScript.innerHTML = `
        atOptions = {
            'key' : 'f234672bd928711136ab51db135f5ab6',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : {}
        };
    `;
    const loadScript = document.createElement("script");
    loadScript.src = "//www.highperformanceformat.com/f234672bd928711136ab51db135f5ab6/invoke.js";
    loadScript.async = true;

    const adWrap = document.createElement("div");
    adWrap.id = "adsterra-banner";
    adWrap.style = "margin: 20px auto; text-align: center;";
    adWrap.appendChild(atScript);
    adWrap.appendChild(loadScript);

    document.querySelector("main").insertAdjacentElement("afterbegin", adWrap);
}

// ✅ Load Compact Native Banner in Header
function loadAdsterraNativeCompact() {
    const container = document.createElement("div");
    container.id = "native-header-compact";
    container.style = `
        max-width: 320px;
        margin: 10px auto;
        padding: 6px;
        background-color: #2f2f2f;
        border-radius: 8px;
        text-align: center;
        color: #ccc;
        font-size: 12px;
    `;
    container.innerHTML = `
        <h4 style="margin: 0 0 4px; color: #f1f1f1; font-size: 13px;">Sponsored</h4>
        <div id="container-ee85fefa867541e1001a5881a71226ff"></div>
        <script async="async" data-cfasync="false" src="//pl26954880.profitableratecpm.com/ee85fefa867541e1001a5881a71226ff/invoke.js"></script>
    `;

    const header = document.querySelector("header");
    header.insertAdjacentElement("beforeend", container);
}

// ✅ Load Propeller Push Ads
function loadPropellerAds() {
    const push = document.createElement('script');
    push.src = 'https://grookilteepsou.net/act/files/tag.min.js?z=9466241';
    push.async = true;
    push.setAttribute('data-cfasync', 'false');
    document.body.appendChild(push);
}

// ✅ Load OGAds Locker Placeholder
function loadOGAds() {
    const og = document.createElement("script");
    og.src = "https://example.com/ogads.js"; // Replace with your locker
    og.async = true;
    document.head.appendChild(og);
}

// ✅ Popunder on "Watch Now" Click
function setupPopUnderAds() {
    document.addEventListener("click", function (e) {
        if (e.target.closest(".watch-btn")) {
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

// ✅ Trigger Direct Link Ad when user clicks search
function setupSearchClickAd() {
    const input = document.getElementById('search-input');
    if (!input) return;

    input.addEventListener('focus', function () {
        window.open('https://www.profitableratecpm.com/bt6i7nqhpa?key=620d2b4b78f1a6dd2a09de39f9d8f3a7', '_blank');
    }, { once: true });
}

// ✅ Load Social Bar Ad
function loadSocialBar() {
    const barScript = document.createElement("script");
    barScript.type = "text/javascript";
    barScript.src = "//pl26955824.profitableratecpm.com/75/e1/ce/75e1ce895f2268e593dacfa74eff73e2.js";
    document.body.appendChild(barScript);
}
