// ✅ Get consent info from localStorage
function getConsent() {
    const consentString = localStorage.getItem('adultContentConsent');
    return consentString ? JSON.parse(consentString) : null;
}

// ✅ Main ad init
function initializeAds() {
    const consent = getConsent();
    if (!consent || !consent.adsAllowed) return;

    loadAdsterraBanner();
    loadAdsterraNative();
    loadPropellerAds();
    loadOGAds();
    setupPopUnderAds();
}

function initializeMinimalAds() {
    loadAdsterraBanner();
}

// ✅ Load Adsterra Banner
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

    document.querySelector("header").insertAdjacentElement("afterend", adWrap);
}

// ✅ Load Adsterra Native Ad
function loadAdsterraNative() {
    const nativeScript = document.createElement("script");
    nativeScript.async = true;
    nativeScript.setAttribute("data-cfasync", "false");
    nativeScript.src = "//pl26954880.profitableratecpm.com/ee85fefa867541e1001a5881a71226ff/invoke.js";

    const nativeDiv = document.createElement("div");
    nativeDiv.id = "container-ee85fefa867541e1001a5881a71226ff";
    nativeDiv.style = "margin: 20px auto;";

    const footer = document.querySelector("footer");
    footer.insertAdjacentElement("beforebegin", nativeDiv);
    footer.insertAdjacentElement("beforebegin", nativeScript);
}

// ✅ Load Propeller Push Ads
function loadPropellerAds() {
    const push = document.createElement('script');
    push.src = 'https://grookilteepsou.net/act/files/tag.min.js?z=9466241';
    push.async = true;
    push.setAttribute('data-cfasync', 'false');
    document.body.appendChild(push);
}

// ✅ OGAds placeholder loader (replace when ready)
function loadOGAds() {
    const og = document.createElement("script");
    og.src = "https://example.com/ogads.js"; // Replace this with real locker script
    og.async = true;
    document.head.appendChild(og);
}

// ✅ Popunder on button click
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
