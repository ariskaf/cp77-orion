// ========== THIS IS THE MAIN JAVASCRIPT FILE FOR THE HOMEPAGE ==========
// ========== IT WAS CREATED BY ME WITH LOTS OF HARD WORK ==========
// ========== PLEASE DO NOT REMOVE THIS COMMENT ==========
// *********************************************



function go(id, url) {
  const el = document.getElementById(id);
  if (!el) return; // prevents crashes if button doesn't exist on some pages
  el.onclick = () => (window.location.href = url);
}

go('btn-videos', 'videos.html');
go('btn-char', 'characters.html');
// Gallery removed on purpose
go('btn-about', 'about.html');
go('btn-support', 'support.html');



// Demo data for news
    let newsData = [
      {title: 'Open roles in Poland, Canada and US, remote and onsite. Check it out bonbons 😌', date: '2025-09-11', src: 'https://x.com/PaweSasko/status/1991982382522790308'},
      {title: 'Project Orion enters pre-production — CDPR', date: '2025-06-01', src: 'https://x.com/CDPROJEKTRED'}
    ];

    const newsEl = document.getElementById('news');
    function renderNews(){
      newsEl.innerHTML = '';
      newsData.forEach(n => {
        const node = document.createElement('div'); node.className='news-item';
        node.innerHTML = `<strong>${n.title}</strong><div class="subtitle">${n.date} — <a href="${n.src}" target="_blank" rel="noopener" style="color:var(--neon)">source</a></div>`;
        newsEl.appendChild(node);
      });
    }
    renderNews();


    

    // Gallery modal
    const modal = document.getElementById('modal'); const modalImg = modal.querySelector('img');
    document.getElementById('gallery').addEventListener('click', e=>{
      const t = e.target.closest('img'); if(!t) return; modalImg.src = t.dataset.full || t.src; modal.classList.add('open');
    });
    modal.addEventListener('click', ()=>{ modal.classList.remove('open') });

    // Body count
    //const bc = document.getElementById('body-count'); const btn = document.getElementById('kill-btn');
    //const key = 'cp2077_bodycount_v1';
    //function loadCount(){ const n = parseInt(localStorage.getItem(key)||'0',10); bc.textContent = n; }
    //btn.addEventListener('click', ()=>{ const n = parseInt(localStorage.getItem(key)||'0',10)+1; localStorage.setItem(key,n); loadCount(); });
    //loadCount();

        // --- Body counter (dynamic Trauma Team version) ---
    const counterEl = document.getElementById("counter-number");
    const alertEl = document.getElementById("counter-alert");
    let counter = 456; // starting value
    function formatCounter(num) {
      return num.toString().padStart(6, "0");
    }

    // update every 2 minutes (+1 to +100)
    setInterval(() => {
      let increase = Math.floor(Math.random() * 100) + 1; 
      counter += increase;
      counterEl.textContent = formatCounter(counter);
    }, 60000);




    // Utility: easy content injection point for real feeds
    window.__INJECT_NEWS = function(arr){ if(Array.isArray(arr)){ newsData = arr; renderNews(); }}

    // External JSON feed loader (for auto-updating news)
    async function loadExternalNews(){
      try{
        const res = await fetch('news.json');
        if(res.ok){
          const arr = await res.json();
          if(Array.isArray(arr)){ window.__INJECT_NEWS(arr); }
        }
      }catch(e){ console.warn('Could not fetch news.json', e); }
    }
    loadExternalNews();




// *********************************************





$(document).ready(function() {
  const modal = $("#galleryModal");
  const closeBtn = $("#closeGallery");

  // open modal when clicking "View Gallery →"
  $("#view-gallery").on("click", function() {
    if ($(".gallery-container").is(":empty")) {
      let numberOfImages = 61;
      let ul = $("<ul>").css({
        "display": "grid",
        "grid-template-columns": "repeat(auto-fit,minmax(120px,1fr))",
        "gap": "10px",
        "list-style": "none",
        "padding": "0",
        "margin": "0"
      });

      for (let i = 1; i <= numberOfImages; i++) {
        let li = $("<li>").addClass("gallery-item").attr("data-aos", "fade-up");
        let link = $("<a>").attr({
          href: "media/modal/" + i + ".png",
          "data-lightbox": "mygallery",
          "data-title": "Image " + i
        });
        let img = $("<img>").attr({
          src: "media/modal/" + i + ".png",
          alt: "Image " + i
        }).css({
          "width": "100%",
          "border-radius": "8px",
          "cursor": "pointer"
        });
        link.append(img);
        li.append(link);
        ul.append(li);
      }
      $(".gallery-container").append(ul);

      AOS.init();
      lightbox.option({ 'resizeDuration': 200, 'wrapAround': true });
    }

    modal.addClass("open");
    $("body").css("overflow", "hidden"); // lock background scroll
  });

  // close modal
  closeBtn.on("click", function() {
    modal.removeClass("open");
    $("body").css("overflow", "auto");
  });
});





// *********************************************





document.addEventListener('DOMContentLoaded', function() {

    // Disable right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        alert('Right-click is disabled!');
    });

    // Disable specific key combinations
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            alert('F12 is disabled!');
        }
        // Ctrl+U
        if (e.ctrlKey && e.key.toLowerCase() === 'u') {
            e.preventDefault();
            alert('View source is disabled!');
        }
        // Ctrl+Shift+I (optional, dev tools)
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') {
            e.preventDefault();
            alert('Dev tools are disabled!');
        }
    });

});







// ************************************************8







document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = document.querySelectorAll('.gallery-item img');

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            // Create the full-screen overlay
            const overlay = document.createElement('div');
            overlay.className = 'fullscreen-overlay';

            // Create the image element for the full-screen view
            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.alt = img.alt;

            // Append the image to the overlay
            overlay.appendChild(fullImg);

            // Append the overlay to the body
            document.body.appendChild(overlay);

            // Show the overlay
            overlay.style.display = 'flex';

            // Hide the overlay on click
            overlay.addEventListener('click', () => {
                overlay.remove();
            });
        });
    });
});












// ========== HACKER CONSOLE TOGGLE ( ~ and ESC ) ==========

(function() {
  const consoleEl = document.getElementById('hacker-console');
  const logEl = document.getElementById('hc-log');
  if (!consoleEl || !logEl) return;

  let openedOnce = false;

  function appendLog(line) {
    logEl.textContent += '\n' + line;
    logEl.scrollTop = logEl.scrollHeight;
  }

  function openConsole() {
    consoleEl.classList.add('active');
    consoleEl.setAttribute('aria-hidden', 'false');

    if (!openedOnce) {
      openedOnce = true;
      // some fun fake logs on first open
      const lines = [
        '[AUTH] Terminal fingerprint mismatch. Mirrored instance engaged.',
        '[TRACE] ORION uplink ghosted through Dogtown relay.',
        '[LOG]  NUSA watchdog flagged multiple illegal read attempts.',
        '[WARN] Redacted segments remain encrypted: ██████████████',
      ];
      lines.forEach((l, i) => {
        setTimeout(() => appendLog(l), 200 * (i + 1));
      });
    }
  }

  function closeConsole() {
    consoleEl.classList.remove('active');
    consoleEl.setAttribute('aria-hidden', 'true');
  }

  function toggleConsole() {
    if (consoleEl.classList.contains('active')) {
      closeConsole();
    } else {
      openConsole();
    }
  }

  document.addEventListener('keydown', function(e) {
    // ignore if user is typing in an input/textarea (future-proof)
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    // ~ or ` toggles console
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      toggleConsole();
    }

    // ESC closes
    if (e.key === 'Escape') {
      if (consoleEl.classList.contains('active')) {
        e.preventDefault();
        closeConsole();
      }
    }
  });
})();









// ========== VSTH ADVANCED INTERACTIONS ==========

(function() {
  const wrap = document.getElementById('recon-map-wrap');
  const lockEl = wrap ? wrap.querySelector('.vsth-lock') : null;
  const reconCard = document.querySelector('.recon-card');

  if (!wrap || !lockEl || !reconCard) return;

  // Click to lock target on map
  wrap.addEventListener('click', function(e) {
    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lockEl.style.left = x + 'px';
    lockEl.style.top = y + 'px';

    // retrigger animation
    lockEl.classList.remove('active');
    void lockEl.offsetWidth; // force reflow
    lockEl.classList.add('active');
  });

  // Press "N" to toggle Night Vision
  document.addEventListener('keydown', function(e) {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      reconCard.classList.toggle('nv-active');
    }
  });
})();








// ============================
// GLOBAL BOOT SEQUENCE (NIGHT CORP SIGIL)
// Show ONLY on fresh entry to index.html
// Skip on internal nav + browser back/forward
// + LOW POWER MODE Easter egg (AND)
// ============================

(function initBootOverlay() {
  const overlay = document.getElementById("boot-overlay");
  if (!overlay) return;

  const randomEl = document.getElementById("boot-random-text");

  const BOOT_MESSAGES = [
    "[NCI ICE GRID ONLINE — PASSIVE TAP ONLY]",
    "[ROUTING TRAFFIC THROUGH CIVIC MESH…]",
    "[MIRROR NODE HANDSHAKE: ORION//FAN-ARCHIVE]",
    "[NETWATCH TELEMETRY: SPOOFED]",
    "[BLACKWALL ACTIVITY: BELOW REPORTING THRESHOLD]",
    "[ARASAKA LEGAL RISK: ACCEPTABLE]",
    "[LOGGING VISITOR FINGERPRINT… JUST KIDDING. PROBABLY.]",

    // --- LOW POWER MODE Easter eggs (AND) ---
    "[WARN] INTERNAL POWER CELL: NON-RESPONSIVE. CONTINUING ANYWAY.]",
    "[SYS] LOW POWER MODE // ORION THROTTLED]",
    "[NOTE] AC TETHER DETECTED. MOBILITY COMPROMISED.]"
  ];

  function fillRandomLines() {
    if (!randomEl) return;
    const shuffled = [...BOOT_MESSAGES].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 3);
    randomEl.innerHTML = chosen
      .map(txt => `<span class="boot-line">${txt}</span>`)
      .join("<br>");
  }

  function appendLowPowerLine() {
    // Extra spice line that shows sometimes (30%)
    if (!randomEl) return;
    if (Math.random() < 0.3) {
      randomEl.innerHTML += `<br><span class="boot-line">[WARN] INTERNAL POWER CELL: NON-RESPONSIVE. CONTINUING ANYWAY.]</span>`;
    }

    // Optional: if you added the badge element in HTML, show it sometimes too
    const lp = document.getElementById("boot-low-power");
    if (lp && Math.random() < 0.3) {
      lp.style.opacity = "1";
    }
  }

  function finishBoot() {
    if (!overlay.classList.contains("hide")) {
      overlay.classList.add("hide");
      document.body.classList.add("boot-complete");
    }
  }

  // --- decision: should we show the boot overlay? ---
  function navType() {
    // Modern browsers
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    if (nav?.type) return nav.type; // "navigate" | "reload" | "back_forward" | "prerender"

    // Fallback (older)
    // 2 = back/forward in legacy API
    const legacy = performance.navigation?.type;
    if (legacy === 2) return "back_forward";
    if (legacy === 1) return "reload";
    return "navigate";
  }

  function isSameOriginReferrer() {
    try {
      if (!document.referrer) return false;
      return new URL(document.referrer).origin === location.origin;
    } catch {
      return false;
    }
  }

  function shouldShowBoot() {
    const type = navType();

    // If user used browser Back/Forward, DO NOT show boot
    if (type === "back_forward") return false;

    // If we set an internal flag before navigating to index, DO NOT show boot
    if (sessionStorage.getItem("orion_skip_boot") === "1") {
      sessionStorage.removeItem("orion_skip_boot");
      return false;
    }

    // If arriving from another page on the same site, DO NOT show boot
    // (referrer can be empty sometimes, so this is a bonus signal, not the only one)
    if (isSameOriginReferrer()) return false;

    // Otherwise (direct entry / external / new tab / reload) show it
    return true;
  }

  // Always ensure that if page is restored from BFCache, overlay stays hidden
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) finishBoot(); // bfcache restore
  });

  // Run
  if (!shouldShowBoot()) {
    // Hide immediately (no flash)
    overlay.classList.add("hide");
    document.body.classList.add("boot-complete");
    return;
  }

  window.addEventListener("load", () => {
    fillRandomLines();
    appendLowPowerLine();

    const timer = setTimeout(finishBoot, 3000);

    function skip() {
      clearTimeout(timer);
      finishBoot();
    }

    overlay.addEventListener("click", skip);
    document.addEventListener("keydown", () => {
      if (!overlay.classList.contains("hide")) skip();
    });
  });
})();













// ============================
// TYPEWRITER FOR .boot-text
// ============================

(function initBootText() {
  function typeElement(el, speed) {
    const full = el.textContent;
    el.textContent = "";
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += full[i];
      i++;
      if (i >= full.length) {
        clearInterval(timer);
      }
    }, speed);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // wait until boot overlay is gone
    const startTyping = () => {
      const targets = document.querySelectorAll(".boot-text");
      let delay = 0;
      targets.forEach(el => {
        setTimeout(() => typeElement(el, 18), delay);
        delay += 120; // small stagger
      });
    };

    if (document.body.classList.contains("boot-complete")) {
      startTyping();
    } else {
      // boot overlay will add this class when it finishes
      const observer = new MutationObserver(() => {
        if (document.body.classList.contains("boot-complete")) {
          observer.disconnect();
          startTyping();
        }
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    }
  });
})();




  document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // open modal when clicking a terminal card
    document.querySelectorAll("[data-terminal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-terminal");
        const modal = document.getElementById("terminal-" + id);
        if (!modal) return;
        modal.classList.add("open");
        body.classList.add("body-terminal-open");
      });
    });

    // close when clicking X button
    document.querySelectorAll("[data-terminal-close]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".terminal-modal-backdrop");
        if (!modal) return;
        modal.classList.remove("open");
        body.classList.remove("body-terminal-open");
      });
    });

    // close on backdrop click
    document.querySelectorAll(".terminal-modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target !== backdrop) return; // ignore clicks inside modal
        backdrop.classList.remove("open");
        body.classList.remove("body-terminal-open");
      });
    });

    // ESC closes any open terminal
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const openModal = document.querySelector(".terminal-modal-backdrop.open");
      if (openModal) {
        openModal.classList.remove("open");
        body.classList.remove("body-terminal-open");
      }
    });
  });















// ============================
// ORION ICE INTRUSION SIMULATION
// ============================



  const ORION_ICE = {
  chance: 0.10,              // medium = 10%
  minDurationMs: 2500,       // no-skip: ensure it feels substantial
  maxDurationMs: 5200,
  // outcome weights: tweak if you want more/less failure
  outcomes: [
    { type: "success_clean", weight: 45 },
    { type: "success_retry", weight: 35 },
    { type: "fail",         weight: 20 },
  ],
};

function weightedPick(list) {
  const total = list.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const item of list) {
    r -= item.weight;
    if (r <= 0) return item.type;
  }
  return list[list.length - 1].type;
}

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

function setBar(pct) {
  const bar = document.getElementById("orionIceBar");
  const pctEl = document.getElementById("orionIcePct");
  const clamped = Math.max(0, Math.min(100, pct));
  bar.style.width = `${clamped}%`;
  pctEl.textContent = `${Math.round(clamped)}%`;
}

function pushLine(text) {
  const lines = document.getElementById("orionIceLines");
  const div = document.createElement("div");
  div.className = "orion-ice__line";
  div.textContent = text;
  lines.appendChild(div);
  // keep last ~6 lines visible
  while (lines.children.length > 6) lines.removeChild(lines.firstChild);
}

function showOrionICE() {
  const overlay = document.getElementById("orionIceOverlay");
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
}

function hideOrionICE() {
  const overlay = document.getElementById("orionIceOverlay");
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

async function runOrionICESequence() {
  // reset UI
  document.getElementById("orionIceLines").innerHTML = "";
  setBar(0);
  showOrionICE();

  const outcome = weightedPick(ORION_ICE.outcomes);
  const targetDuration = Math.floor(
    ORION_ICE.minDurationMs + Math.random() * (ORION_ICE.maxDurationMs - ORION_ICE.minDurationMs)
  );

  // Intro lines
  pushLine("handshake: INIT");
  await sleep(220);
  pushLine("icewall: DEPLOY");
  await sleep(220);
  pushLine("trace: LOCKING ORIGIN");
  await sleep(220);

  const start = performance.now();
  let pct = 0;

  // helper: smooth-ish forward progress with jitter
  async function forwardTo(target, speedMs = 70) {
    while (pct < target) {
      pct += 1.8 + Math.random() * 2.8;
      if (pct > target) pct = target;
      setBar(pct);
      await sleep(speedMs + Math.random() * 60);
    }
  }

  // helper: backslide
  async function backslideTo(target, speedMs = 55) {
    while (pct > target) {
      pct -= 2.5 + Math.random() * 4.0;
      if (pct < target) pct = target;
      setBar(pct);
      await sleep(speedMs + Math.random() * 45);
    }
  }

  if (outcome === "success_clean") {
    pushLine("countermeasures: ACTIVE");
    await forwardTo(35);
    pushLine("packet shredder: ENGAGED");
    await forwardTo(72);
    pushLine("signature spoof: STABLE");
    await forwardTo(100);
    pushLine("status: ICE NEUTRALIZED");
  }

  if (outcome === "success_retry") {
    pushLine("countermeasures: ACTIVE");
    await forwardTo(40);
    pushLine("orion spike: INJECT");
    await forwardTo(80);

    // Backslide moment (80 -> 50-ish)
    pushLine("warning: FEEDBACK LOOP");
    await sleep(250);
    const dropTo = 46 + Math.random() * 12; // 46-58
    await backslideTo(dropTo);
    pushLine("re-route: FAILSAFE PATH");
    await sleep(240);

    // Retry forward and succeed
    await forwardTo(92, 60);
    pushLine("checksum: VERIFIED");
    await forwardTo(100, 55);
    pushLine("status: ICE NEUTRALIZED");
  }

  if (outcome === "fail") {
    pushLine("countermeasures: ACTIVE");
    await forwardTo(28);
    pushLine("trace: HARD-LOCK");
    await forwardTo(58);
    pushLine("warning: BLACK ICE CONTACT");
    await forwardTo(77);

    // Fail slam
    await sleep(200);
    pushLine("fatal: DEFENSE OVERRUN");
    // quick wobble + partial drop
    await backslideTo(62, 35);
    pushLine("status: CONNECTION TERMINATED");
  }

  // Ensure no-skip: always completes a minimum duration “presence”
  const elapsed = performance.now() - start;
  const remaining = Math.max(0, targetDuration - elapsed);
  await sleep(remaining);

  // hide overlay
  hideOrionICE();

  // Return outcome so your app can react (optional)
  return outcome;
}

/**
 * Call this at moments you want a chance to trigger.
 * Example: after user sends a message, or after a fake "breach" starts.
 */
async function maybeTriggerOrionICE() {
  if (Math.random() > ORION_ICE.chance) return null;
  return await runOrionICESequence();
}







// =======================
// auth button name change 
// =======================

(function authButtonInit(){
  const btn = document.getElementById("btn-log");
  if (!btn) return;

  const sessRaw = sessionStorage.getItem("orion_auth_session_v1");
  if (!sessRaw) {
    // Not logged in: button goes to auth page
    btn.textContent = "Login";
    btn.onclick = () => window.location.href = "auth.html", "_self";
    return;
  }

  let sess;
  try { sess = JSON.parse(sessRaw); } catch { sess = null; }
  if (!sess || !sess.handle) {
    btn.textContent = "Login";
    btn.onclick = () => window.location.href = "auth.html";
    return;
  }

  // Render handle with gold 077 (digits only)
  const handle = String(sess.handle);
  const parts = handle.split("-");
  const last = parts[parts.length - 1] || "";
  const base = parts.slice(0, -1).join("-");

  if (last === "077") {
    btn.innerHTML = `${escapeHtml(base)}-<span class="handle-gold">077</span>`;
  } else {
    btn.textContent = handle;
  }

  // Optional: click shows a tiny menu behavior (for now just logout)
  btn.onclick = () => {
    const ok = confirm(`Signed in as: ${handle}\n\nLog out?`);
    if (ok) {
      sessionStorage.removeItem("orion_auth_session_v1");
      window.location.reload();
    }
  };

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, (c) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }
})();
