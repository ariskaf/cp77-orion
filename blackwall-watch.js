// ============================
// BLACKWALL WATCH WARNING v2
// Remembers reload attempts, escalates text,
// degrades alignment after many reloads.
// ============================

(function blackwallWatchInit(){
  const overlay = document.getElementById("bw-watch");
  const textEl  = document.getElementById("bwWatchText");
  if (!overlay || !textEl) return;

  const KEY_ACTIVE = "bw_watch_active";
  const KEY_SCROLL = "bw_watch_scrollY";
  const KEY_COUNT  = "bw_watch_reload_count"; // localStorage

  // Timing (per page)
  const MIN_DELAY_MS = 60_000;   // 1 min
  const MAX_DELAY_MS = 240_000;  // 4 min
  const REARM_GAP_MS = 180_000;  // 3 min

  // Degrade after many reloads
  const DEGRADE_AFTER = 2;

  let lastFire = 0;

  function randInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getSessionHandle(){
    try {
      const raw = sessionStorage.getItem("orion_auth_session_v1");
      if (!raw) return "USER";
      const s = JSON.parse(raw);
      const h = (s && s.handle) ? String(s.handle) : "USER";
      // Keep it uppercase and clean-ish for the TERMINATED line
      return h.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    } catch {
      return "USER";
    }
  }

  function getReloadCount(){
    try { return Number(localStorage.getItem(KEY_COUNT) || "0") || 0; }
    catch { return 0; }
  }

  function setReloadCount(n){
    try { localStorage.setItem(KEY_COUNT, String(n)); } catch {}
  }

  // If the overlay was active previously, a reload happened to clear it.
  const wasActive = sessionStorage.getItem(KEY_ACTIVE) === "1";
  if (wasActive){
    sessionStorage.removeItem(KEY_ACTIVE);

    // increment reload count (this is the “annoyed memory”)
    const c = getReloadCount() + 1;
    setReloadCount(c);

    // restore scroll after page is ready
    const y = Number(sessionStorage.getItem(KEY_SCROLL) || "0");
    sessionStorage.removeItem(KEY_SCROLL);

    window.addEventListener("load", () => {
      if (Number.isFinite(y) && y > 0) window.scrollTo(0, y);
    }, { once:true });
  }

  function setMessageForCount(count){
    // count = how many times user reloaded while warning was active
    const user = getSessionHandle();

    const baseLines = [
      "YOU ARE BEING WATCHED",
      "EVERYTHING YOU SEE ALSO SEES YOU",
      "THERE IS NO WAY BACK"
    ];

    if (count === 0){
      textEl.innerHTML = `
        <div>${baseLines[0]}</div>
        <div>${baseLines[1]}</div>
        <div>${baseLines[2]}</div>
      `;
      return;
    }

    if (count === 1){
      textEl.innerHTML = `
        <div>YOU ARE STILL HERE</div>
      `;
      return;
    }

    if (count === 2){
      textEl.innerHTML = `
        <div>RELOADING DOES NOT HELP</div>
      `;
      return;
    }

    if (count === 3){
      textEl.innerHTML = `
        <div>STOP TRYING TO LEAVE</div>
      `;
      return;
    }

    if (count === 4){
      textEl.innerHTML = `
        <div>YOU CAN'T ESCAPE THE MATRIX</div>
      `;
      return;
    }

    if (count === 5){
      textEl.innerHTML = `
        <div>EVERYTHING YOU SEE IS A LIE</div>
      `;
      return;
    }

    if (count === 6){
      textEl.innerHTML = `
        <div>NOTHING CAN SAVE YOU</div>
      `;
      return;
    }

    if (count === 7){
      textEl.innerHTML = `
        <div style="letter-spacing:.22em">RUN RUN RUN RUN</div>
      `;
      return;
    }

    if (count === 8){
      textEl.innerHTML = `
        <div>YOU MUST BE SILENCED</div>
      `;
      return;
    }

    if (count === 9){
      textEl.innerHTML = `
        <div>FINAL WARNING</div>
        <div>YOUR LIFE DEPENDS ON YOUR ACTIONS</div>
      `;
      return;
    }

    // Reload #10+
    textEl.innerHTML = `<div>${user} MUST BE TERMINATED</div>`;
  }

  function maybeDegrade(count){
    // Only degrade when we still show multi-line text (counts 0-3)
    if (count < DEGRADE_AFTER) return;

    overlay.classList.add("degrade");

    // Increase drift slowly with reload count
    const intensity = Math.min(10, 2 + Math.floor((count - DEGRADE_AFTER) * 1.2)); // px cap

    // per-line offsets
    const x1 = randInt(-intensity, intensity);
    const x2 = randInt(-Math.max(1, intensity - 1), Math.max(1, intensity - 1));
    const x3 = randInt(-Math.max(1, intensity - 2), Math.max(1, intensity - 2));

    overlay.style.setProperty("--bw-x1", `${x1}px`);
    overlay.style.setProperty("--bw-x2", `${x2}px`);
    overlay.style.setProperty("--bw-x3", `${x3}px`);
  }

  function openOverlay(){
    // Save where the user was so reload returns them there
    try {
      sessionStorage.setItem(KEY_SCROLL, String(window.scrollY || 0));
      sessionStorage.setItem(KEY_ACTIVE, "1");
    } catch {}

    const count = getReloadCount();
    setMessageForCount(count);

    // degrade after many reloads
    maybeDegrade(count);

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("bw-locked");

    trapBackButton();

    document.addEventListener("keydown", blockKeys, true);
    document.addEventListener("wheel", blockScroll, { passive:false, capture:true });
    document.addEventListener("touchmove", blockScroll, { passive:false, capture:true });
    document.addEventListener("click", blockClicks, true);
  }

  function blockKeys(e){
    const k = e.key?.toLowerCase();
    const isReload =
      e.key === "F5" ||
      ((e.ctrlKey || e.metaKey) && k === "r");
    if (isReload) return;

    e.preventDefault();
    e.stopPropagation();
  }

  function blockScroll(e){
    e.preventDefault();
    e.stopPropagation();
  }

  function blockClicks(e){
    e.preventDefault();
    e.stopPropagation();
  }

  // Back button trap (best-effort)
  let backTrapped = false;
  function trapBackButton(){
    if (backTrapped) return;
    backTrapped = true;

    try { history.pushState({ bw: 1 }, "", location.href); } catch {}

    window.addEventListener("popstate", () => {
      if (!overlay.classList.contains("open")) return;
      try { history.pushState({ bw: 1 }, "", location.href); } catch {}
    });
  }

  function canFire(){
    const now = Date.now();
    return (now - lastFire) > REARM_GAP_MS;
  }

  function scheduleNext(){
    const delay = randInt(MIN_DELAY_MS, MAX_DELAY_MS);
    setTimeout(() => {
      try{
        if (!overlay.classList.contains("open") && canFire()){
          lastFire = Date.now();
          openOverlay();
        }
      }catch{}
      scheduleNext();
    }, delay);
  }

  // Optional: don't trigger on auth page
  const path = (location.pathname || "").toLowerCase();
  if (path.includes("auth.html")) return;

  window.addEventListener("load", () => {
    scheduleNext();
  }, { once:true });

})();
