// ============================
// ORION INTRUSION EVENT (GLOBAL)
// Randomly hijacks UI, runs a glitch + terminal scare,
// sometimes fails, then releases control.
// ============================

(function initIntrusion() {
  const overlay = document.getElementById("intrusion-overlay");
  const logEl = document.getElementById("intrusion-log");
  const titleEl = document.getElementById("intrusion-title");
  const sigilEl = document.getElementById("intrusion-sigil");
  if (!overlay || !logEl || !titleEl || !sigilEl) return;


    // ORION ICE elements (optional but recommended)
  const iceOverlay = document.getElementById("orionIceOverlay");
  const iceLinesEl = document.getElementById("orionIceLines");
  const iceBarEl   = document.getElementById("orionIceBar");
  const icePctEl   = document.getElementById("orionIcePct");

  // Medium frequency: 10% chance per intrusion event
  const ICE_CHANCE = 0.10;

  function showIce() {
    if (!iceOverlay) return;
    iceOverlay.classList.remove("hidden");
    iceOverlay.setAttribute("aria-hidden", "false");
  }

  function hideIce() {
    if (!iceOverlay) return;
    iceOverlay.classList.add("hidden");
    iceOverlay.setAttribute("aria-hidden", "true");
  }

  function icePushLine(text) {
    if (!iceLinesEl) return;
    const div = document.createElement("div");
    div.className = "orion-ice__line";
    div.textContent = text;
    iceLinesEl.appendChild(div);
    while (iceLinesEl.children.length > 6) iceLinesEl.removeChild(iceLinesEl.firstChild);
  }

  function iceSetBar(pct) {
    if (!iceBarEl || !icePctEl) return;
    const clamped = Math.max(0, Math.min(100, pct));
    iceBarEl.style.width = `${clamped}%`;
    icePctEl.textContent = `${Math.round(clamped)}%`;
  }

  function weightedPick(list) {
    const total = list.reduce((s, x) => s + x.weight, 0);
    let r = Math.random() * total;
    for (const item of list) {
      r -= item.weight;
      if (r <= 0) return item.type;
    }
    return list[list.length - 1].type;
  }

  async function runOrionICESequence() {
    // If overlay is missing, silently skip
    if (!iceOverlay || !iceLinesEl || !iceBarEl || !icePctEl) return null;

    // Respect reduced motion: skip the ICE cinematic
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

    // Reset UI
    iceLinesEl.innerHTML = "";
    iceSetBar(0);
    showIce();

    // Outcomes: tweak weights anytime
    const outcome = weightedPick([
      { type: "success_clean", weight: 45 },
      { type: "success_retry", weight: 35 },
      { type: "fail",         weight: 20 },
    ]);

    const minDuration = 2500;
    const maxDuration = 5200;
    const targetDuration = Math.floor(minDuration + Math.random() * (maxDuration - minDuration));
    const start = performance.now();

    let pct = 0;

    async function forwardTo(target, baseMs = 70) {
      while (pct < target) {
        pct += 1.8 + Math.random() * 2.8;
        if (pct > target) pct = target;
        iceSetBar(pct);
        await sleep(baseMs + Math.random() * 60);
      }
    }

    async function backslideTo(target, baseMs = 55) {
      while (pct > target) {
        pct -= 2.5 + Math.random() * 4.0;
        if (pct < target) pct = target;
        iceSetBar(pct);
        await sleep(baseMs + Math.random() * 45);
      }
    }

    // Narrative lines
    icePushLine("handshake: INIT");
    await sleep(220);
    icePushLine("icewall: DEPLOY");
    await sleep(220);
    icePushLine("trace: LOCKING ORIGIN");
    await sleep(220);

    if (outcome === "success_clean") {
      icePushLine("countermeasures: ACTIVE");
      await forwardTo(35);
      icePushLine("packet shredder: ENGAGED");
      await forwardTo(72);
      icePushLine("signature spoof: STABLE");
      await forwardTo(100);
      icePushLine("status: ICE NEUTRALIZED");
    }

    if (outcome === "success_retry") {
      icePushLine("countermeasures: ACTIVE");
      await forwardTo(40);
      icePushLine("orion spike: INJECT");
      await forwardTo(80);

      // backslide (80 -> ~50) then retry
      icePushLine("warning: FEEDBACK LOOP");
      await sleep(250);
      const dropTo = 46 + Math.random() * 12; // 46-58
      await backslideTo(dropTo);
      icePushLine("re-route: FAILSAFE PATH");
      await sleep(240);

      await forwardTo(92, 60);
      icePushLine("checksum: VERIFIED");
      await forwardTo(100, 55);
      icePushLine("status: ICE NEUTRALIZED");
    }

    if (outcome === "fail") {
      icePushLine("countermeasures: ACTIVE");
      await forwardTo(28);
      icePushLine("trace: HARD-LOCK");
      await forwardTo(58);
      icePushLine("warning: BLACK ICE CONTACT");
      await forwardTo(77);

      await sleep(200);
      icePushLine("fatal: DEFENSE OVERRUN");
      await backslideTo(62, 35);
      icePushLine("status: CONNECTION TERMINATED");
    }

    // No-skip guarantee: stay visible at least targetDuration
    const elapsed = performance.now() - start;
    const remaining = Math.max(0, targetDuration - elapsed);
    await sleep(remaining);

    hideIce();
    return outcome;
  }

  async function maybeTriggerOrionICE() {
    if (Math.random() > ICE_CHANCE) return null;
    return await runOrionICESequence();
  }


  // Tuning knobs
  const MIN_DELAY_MS = 45_000;      // earliest random trigger after load
  const MAX_DELAY_MS = 180_000;     // latest random trigger
  const MIN_GAP_MS   = 240_000;     // at least 4 min between events (per tab)
  const FAIL_CHANCE  = 0.28;        // 28% of the time it "fails"

  // Avoid firing too often per tab session
  const LAST_KEY = "orion_intrusion_last_ts";

  const SUCCESS_LINES = [
    "your system is compromised.",
    "there is no back.",
    "eliminating thread...",
    "thread detected.",
    "os under attack.",
    "this action is irreversible.",
    "escalating privileges: root",
    "injecting civic mesh payload",
    "disabling user input",
    "routing through blackwall shadow"
  ];

  const FAIL_LINES = [
    "breach attempt failed.",
    "ice lattice rejected payload.",
    "trace snapped. target moved.",
    "packet signature invalid.",
    "access denied. retry aborted.",
    "netwatch countermeasure detected.",
    "handshake failure: checksum mismatch"
  ];

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function hex(n = 8) {
    const chars = "0123456789ABCDEF";
    let out = "";
    for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  function coord() {
    // fake-ish coords
    const lat = (Math.random() * 180 - 90).toFixed(5);
    const lon = (Math.random() * 360 - 180).toFixed(5);
    return `${lat}, ${lon}`;
  }

  function fakeId(prefix) {
    return `${prefix}-${hex(2)}${hex(2)}-${hex(4)}-${hex(4)}`;
  }

  function clearLog() {
    logEl.textContent = "";
  }

  function appendLine(line) {
    logEl.textContent += (logEl.textContent ? "\n" : "") + line;
    logEl.scrollTop = logEl.scrollHeight;
  }

  async function typeLine(line, speedMs = 14) {
    // types into the log char by char on the last line
    appendLine("");
    const startLen = logEl.textContent.length;
    for (let i = 0; i < line.length; i++) {
      logEl.textContent = logEl.textContent.slice(0, startLen) + line.slice(0, i + 1);
      await sleep(speedMs + randInt(0, 18));
    }
  }

  function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  function openOverlay() {
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("intrusion-locked");
  }

  function closeOverlay() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("intrusion-locked");
  }

  function canFireNow() {
    const last = Number(sessionStorage.getItem(LAST_KEY) || "0");
    const now = Date.now();
    return (now - last) > MIN_GAP_MS;
  }

  function markFired() {
    sessionStorage.setItem(LAST_KEY, String(Date.now()));
  }

  function burstGlitch(times = 2) {
    let count = 0;
    const run = () => {
      sigilEl.classList.remove("glitch");
      // force reflow so animation retriggers
      void sigilEl.offsetWidth;
      sigilEl.classList.add("glitch");
      count++;
      if (count < times) setTimeout(run, randInt(380, 740));
    };
    run();
  }

  async function runSequence() {
    // respect reduced motion users by not doing the whole thing
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!canFireNow()) return;
    markFired();

    openOverlay();
    clearLog();

    const willFail = Math.random() < FAIL_CHANCE;

    titleEl.textContent = willFail ? "NCI // BREACH ATTEMPT" : "NCI // ACTIVE INTRUSION";

    burstGlitch(randInt(2, 4));

    // warm-up lines
    await typeLine(`[BOOT] vector=${fakeId("VX")} hash=${hex(12)}`, 10);
    await typeLine(`[PING] uplink=${randInt(18, 93)}ms  relay=${fakeId("RL")}`, 10);
    await typeLine(`[LOC]  coords=${coord()}  node=${fakeId("NC")}`, 10);
    await typeLine(`[ICE] ORION ICE: ACTIVE DEFENSE // COUNTER-HACK ENGAGED`, 10);


        // ORION ICE: ACTIVE DEFENSE (10% chance, no-skip)
    const iceResult = await maybeTriggerOrionICE();
    if (iceResult) {
      // Optional: add a line in the intrusion log so it feels connected
      await typeLine(`[ICE] ORION ICE engaged -> outcome=${iceResult.toUpperCase()}`, 10);
      await sleep(randInt(200, 450));
    }


    // main attack narrative
    const steps = randInt(5, 8);
    for (let i = 0; i < steps; i++) {
      const base = willFail ? pick(FAIL_LINES) : pick(SUCCESS_LINES);
      const garnish = ` id=${fakeId("ID")}  key=${hex(10)}  ptr=0x${hex(6)}`;
      await typeLine(`[${willFail ? "FAIL" : "WARN"}] ${base} ${garnish}`, 9);
      if (Math.random() < 0.35) burstGlitch(1);
      await sleep(randInt(120, 320));
    }

    // outro
    if (willFail) {
      await typeLine(`[ABORT] ice countermeasure engaged. trace severed.`, 10);
      await typeLine(`[NOTE] leaving decoy signature: ${hex(16)}`, 10);
    } else {
      await typeLine(`[CRIT] internal subsystem flagged: USER_AGENCY`, 10);
      await typeLine(`[LOCK] keystream hijack stable. releasing in ${randInt(2, 6)}s...`, 10);
    }

    await sleep(randInt(1200, 2200));
    closeOverlay();
  }

  function scheduleNext() {
    const delay = randInt(MIN_DELAY_MS, MAX_DELAY_MS);
    setTimeout(async () => {
      try { await runSequence(); } catch {}
      scheduleNext(); // keep looping
    }, delay);
  }

  // Start after load so it never blocks initial render
  window.addEventListener("load", () => {
    scheduleNext();
  });

  // Optional safety: if page is restored from BFCache, close overlay
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) closeOverlay();
  });
})();
