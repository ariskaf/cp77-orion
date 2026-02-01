// ============================
// ORION LOCAL AD ROTATOR (cp-ad-banner)
// ============================

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cp-ad-banner");
  const img = document.getElementById("cp-ad-image");
  const closeBtn = document.getElementById("cp-ad-close");

  if (!banner || !img || !closeBtn) {
    console.warn("[ADS] Missing #cp-ad-banner / #cp-ad-image / #cp-ad-close on this page.");
    return;
  }

  // ---- CONFIG ----
  const COUNT = 14;      // 1..14
  const EXT = "jpg";     // "jpg" or "png"
  const SHOW_DELAY_MS = 900;
  const ROTATE_EVERY_MS = 15000; // rotate while open (15s)
  const SHOW_ONCE_PER_SESSION = true; // set false if you want it every refresh

  // Try multiple base paths so it works on ALL pages no matter folder depth
  const CANDIDATE_BASES = [
    "ads",
    "media/ads",
    "../ads",
    "../media/ads",
    "../../ads",
    "../../media/ads"
  ];

  const SESSION_KEY = "ORION_AD_SHOWN";
  const BASE_KEY = "ORION_AD_BASE";

  let rotateTimer = null;
  let resolvedBase = sessionStorage.getItem(BASE_KEY) || null;

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function buildSrc(base, n) {
    return `${base}/${n}.${EXT}`;
  }

  function tryLoad(src) {
    return new Promise((resolve) => {
      const test = new Image();
      test.onload = () => resolve({ ok: true, src });
      test.onerror = () => resolve({ ok: false, src });
      test.src = src;
    });
  }

  async function resolveBasePath() {
    if (resolvedBase) return resolvedBase;

    // test with image 1 (or any)
    for (const base of CANDIDATE_BASES) {
      const probe = buildSrc(base, 1);
      const res = await tryLoad(probe);
      if (res.ok) {
        resolvedBase = base;
        sessionStorage.setItem(BASE_KEY, base);
        console.log("[ADS] Using base path:", base);
        return base;
      }
    }

    console.warn("[ADS] Could not resolve ads folder. Tried:", CANDIDATE_BASES);
    return null;
  }

  function setImage(base) {
    const n = randInt(1, COUNT);
    const src = buildSrc(base, n);

    img.onload = null;
    img.onerror = null;

    img.onload = () => {
      // loaded ok
    };

    img.onerror = () => {
      console.warn("[ADS] Failed to load:", src);
    };

    img.src = src;
    img.alt = `ad ${n}`;
  }

  function openBanner() {
    banner.style.display = "block";
  }

  function closeBanner() {
    banner.style.display = "none";
    if (rotateTimer) {
      clearInterval(rotateTimer);
      rotateTimer = null;
    }
  }

  // Close button: hard bind + stop propagation just in case
  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeBanner();
  });

  // ESC closes too
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && banner.style.display !== "none") closeBanner();
  });

  // Main boot
  window.addEventListener("load", async () => {
    if (SHOW_ONCE_PER_SESSION && sessionStorage.getItem(SESSION_KEY) === "1") return;
    sessionStorage.setItem(SESSION_KEY, "1");

    const base = await resolveBasePath();
    if (!base) return; // nothing to show if folder can’t be found

    setTimeout(() => {
      setImage(base);
      openBanner();

      // Rotate while open
      rotateTimer = setInterval(() => setImage(base), ROTATE_EVERY_MS);
    }, SHOW_DELAY_MS);
  });
});





(() => {
  const ADS_PATH = "media/ads";   // change to "media/ads" if that's your folder
  const ADS_COUNT = 14;
  const ADS_EXT = "jpg";

  const SHOW_DELAY_MS = 4500;
  const ROTATE_EVERY_MIN = 10;     // shared globally (UTC)
  const MAX_SHOWS_PER_DAY = 3;     // per device
  const SNOOZE_DAYS = 7;

  const modal = document.getElementById("ad-modal");
  const modalImg = document.getElementById("ad-image");
  const modalClose = document.getElementById("ad-close-btn");
  const modalId = document.getElementById("ad-id");
  const snoozeChk = document.getElementById("ad-snooze-7d");

  const banner = document.getElementById("cp-ad-banner");
  const bannerImg = document.getElementById("cp-ad-image");
  const bannerClose = document.getElementById("cp-ad-close");

  const MODE = modal && modalImg ? "modal" : (banner && bannerImg ? "banner" : null);
  if (!MODE) return;

  let isOpen = false;

  const pad3 = (n) => String(n).padStart(3, "0");
  const buildSrc = (idx1) => `${ADS_PATH}/${idx1}.${ADS_EXT}`;

  function todayKeyUTC() {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, "0");
    const d = String(now.getUTCDate()).padStart(2, "0");
    return `${y}${m}${d}`;
  }

  function getTimeSlotKey() {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, "0");
    const d = String(now.getUTCDate()).padStart(2, "0");
    const hh = String(now.getUTCHours()).padStart(2, "0");
    const slot = Math.floor(now.getUTCMinutes() / ROTATE_EVERY_MIN);
    return `${y}${m}${d}-${hh}-S${slot}`;
  }

  function seededIndex(seedStr, max) {
    let h = 2166136261;
    for (let i = 0; i < seedStr.length; i++) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h) % max;
  }

  function getSnoozeUntil() {
    return Number(localStorage.getItem("orion_ads_snooze_until") || "0");
  }

  function isSnoozed() {
    return Date.now() < getSnoozeUntil();
  }

  function setSnooze(days) {
    const until = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem("orion_ads_snooze_until", String(until));
  }

  function canShowToday() {
    if (isSnoozed()) return false;
    const key = `orion_ads_shown_${todayKeyUTC()}`;
    const count = Number(localStorage.getItem(key) || "0");
    return count < MAX_SHOWS_PER_DAY;
  }

  function markShown() {
    const key = `orion_ads_shown_${todayKeyUTC()}`;
    const count = Number(localStorage.getItem(key) || "0");
    localStorage.setItem(key, String(count + 1));
  }

  function setAd() {
    const seed = getTimeSlotKey();
    const idx1 = seededIndex(seed, ADS_COUNT) + 1;
    const src = buildSrc(idx1);

    if (MODE === "modal") {
      modalImg.src = src;
      modalImg.alt = `Sponsored content ${idx1}`;
      if (modalId) modalId.textContent = `ADS-${pad3(idx1)}`;
    } else {
      bannerImg.src = src;
      bannerImg.alt = `Sponsored content ${idx1}`;
    }
  }

  function openAd() {
    if (!canShowToday()) return;

    setAd();

    // preload to avoid “box only”
    const pre = new Image();
    pre.onload = () => {
      if (MODE === "modal") {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
      } else {
        banner.style.display = "block";
      }
      isOpen = true;
      markShown();
    };
    pre.src = (MODE === "modal") ? modalImg.src : bannerImg.src;
  }

  function closeAd() {
    // apply snooze if checked
    if (snoozeChk && snoozeChk.checked) setSnooze(SNOOZE_DAYS);

    if (MODE === "modal") {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      if (snoozeChk) snoozeChk.checked = false;
    } else {
      banner.style.display = "none";
    }
    isOpen = false;
  }

  function bindClose() {
    if (MODE === "modal" && modalClose) modalClose.addEventListener("click", closeAd);
    if (MODE === "banner" && bannerClose) bannerClose.addEventListener("click", closeAd);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) closeAd();
    });

    if (MODE === "modal") {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeAd();
      });
    }
  }

  window.addEventListener("load", () => {
    bindClose();
    setTimeout(openAd, SHOW_DELAY_MS);
  });
})();
