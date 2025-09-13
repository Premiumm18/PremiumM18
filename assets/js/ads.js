// ✅ Get consent info from localStorage (optional, unused here)
function getConsent() {
    const consentString = localStorage.getItem('adultContentConsent');
    return consentString ? JSON.parse(consentString) : null;
}

// ✅ Main ad initializer (ALWAYS load ads, ignore consent)
function initializeAds() {
    loadAdsterraBanner();
    loadAdsterraNativeFooter();
    loadPropellerAds();
    loadOGAds();
    setupPopUnderAds();
    setupSearchClickAd();
    loadSocialBar();
}

// ✅ Minimal ads fallback (optional)
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

    const mainElement = document.querySelector("main") || document.body;
    mainElement.insertAdjacentElement("afterbegin", adWrap);
}

// ✅ Load Compact Native Banner in Footer
function loadAdsterraNativeFooter() {
    const container = document.createElement("div");
    container.id = "native-footer-compact";
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

    const label = document.createElement("h4");
    label.innerText = "Sponsored";
    label.style = "margin: 0 0 4px; color: #f1f1f1; font-size: 13px;";
    container.appendChild(label);

    const nativeDiv = document.createElement("div");
    nativeDiv.id = "container-ee85fefa867541e1001a5881a71226ff";
    container.appendChild(nativeDiv);

    const script = document.createElement("script");
    script.src = "//pl26954880.profitableratecpm.com/ee85fefa867541e1001a5881a71226ff/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    const footer = document.querySelector("footer") || document.body;
    footer.insertAdjacentElement("beforebegin", container);
    document.body.appendChild(script);
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
    og.src = "https://example.com/ogads.js"; // Replace with your real OGAds locker script URL
    og.async = true;
    document.head.appendChild(og);
}

// ✅ Popunder on "Watch Now" Click
function setupPopUnderAds() {
    document.addEventListener("click", function (e) {
        if (e.target.closest(".watch-btn")) {
            if (Math.random() < 0.3) {
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

// ✅ Trigger Direct Link Ad when user clicks search input
function setupSearchClickAd() {
    const input = document.getElementById('search-input');
    if (!input) return;

    input.addEventListener('focus', function () {
        window.open('https://pantomimemailman.com/nq2pdpgc0b?key=a4fe8f18599f1f5188a8538a88cb7fb0', '_blank');
    }, { once: true });
}

// ✅ Load Social Bar Ad
function loadSocialBar() {
    const barScript = document.createElement("script");
    barScript.type = "text/javascript";
    barScript.src = "//pl26955824.profitableratecpm.com/75/e1/ce/75e1ce895f2268e593dacfa74eff73e2.js";
    document.body.appendChild(barScript);
}

