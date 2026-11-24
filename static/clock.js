(() => {
  "use strict";

  const root = document.documentElement;
  const initial = JSON.parse(document.getElementById("bootstrap").textContent);

  const CATALOG = {
    dial: [
      { id: "neon", slot: "dial", name: "Vice Neon", desc: "Růžovo-kyanový ciferník, který svítí jako neon na Ocean Drive.", price: 0, swatch: "radial-gradient(circle at 40% 25%, #4b1b6b, #150c28 70%)" },
      { id: "gold", slot: "dial", name: "Sunset Gold", desc: "Zlatý ciferník pro ty, kdo v Vice City vozí jen nejlepší kousky.", price: 1500, swatch: "radial-gradient(circle at 40% 25%, #7a5314, #1d1305 70%)" },
      { id: "chrome", slot: "dial", name: "Midnight Chrome", desc: "Ocelově modrá elegance vhodná na noční jízdu po dálnici.", price: 3200, swatch: "radial-gradient(circle at 40% 25%, #48657f, #0d1622 70%)" },
      { id: "blood", slot: "dial", name: "Blood Red", desc: "Krváčervený ciferník inspirovaný obálkou GTA VI.", price: 5500, swatch: "radial-gradient(circle at 40% 25%, #8c1325, #1c0509 70%)" },
      { id: "prestige", slot: "dial", name: "Prestige Prism", desc: "Duhový ciferník vyhrazený těm, kdo už jednou začali znovu.", price: 0, requiredRebirth: 1, swatch: "conic-gradient(from 210deg, #ff4fa3, #ffd86b, #29e7e0, #a35cff, #ff4fa3)" },
    ],
    hands: [
      { id: "classic", slot: "hands", name: "Classic Metal", desc: "Klasické kovové ručičky. Spolehlivé, nic víc, nic míň.", price: 0, swatch: "linear-gradient(115deg, #2a1d3a, #d9c9e8 50%, #2a1d3a)" },
      { id: "glow", slot: "hands", name: "Neon Glow", desc: "Ružička a minuty září jako výlohy klubů na South Beach.", price: 2200, swatch: "linear-gradient(115deg, #16b8c4, #ff4fa3 55%, #16b8c4)" },
      { id: "gold-hands", slot: "hands", name: "Gold Digger", desc: "Zlaté ručičky pro majitele vlastního kasina.", price: 4200, swatch: "linear-gradient(115deg, #8a5a0d, #ffe08a 50%, #8a5a0d)" },
      { id: "rebirth", slot: "hands", name: "Rebirth Blades", desc: "Ručičky z přetaveného zlata. Třetí život se počítá.", price: 0, requiredRebirth: 3, swatch: "linear-gradient(115deg, #ff2d6f, #fff3bf 45%, #29e7e0)" },
    ],
    ui: [
      { id: "glass", slot: "ui", name: "Vice Glass", desc: "Průhledné panely s neonovými akcenty. Výchozí styl rozhraní.", price: 0, swatch: "linear-gradient(120deg, rgba(255,79,163,.5), rgba(41,231,224,.35))" },
      { id: "noir", slot: "ui", name: "Noir HUD", desc: "Tmavé rozhraní se zpěvnou červenou. Město, které nikdy nespí.", price: 2600, swatch: "linear-gradient(120deg, #120309, #ff3f59)" },
      { id: "minimal", slot: "ui", name: "Minimal", desc: "Potlačené panely, maximum prostoru pro výhled na město.", price: 3600, swatch: "linear-gradient(120deg, rgba(255,255,255,.08), rgba(255,255,255,.02))" },
      { id: "scanlines", slot: "fx", name: "Retro Scanlines", desc: "Retrosken přes obrazovku jako na starém krbu v motelu.", price: 900, swatch: "repeating-linear-gradient(180deg, #2a1a3a 0 3px, #0b0614 3px 6px)" },
      { id: "bloom", slot: "fx", name: "Neon Bloom", desc: "Rozmazané světelné halo po okrajích obrazovky.", price: 1800, swatch: "radial-gradient(circle, #120b24 35%, #ff4fa3 85%, #29e7e0 100%)" },
      { id: "royal", slot: "ui", name: "Royal HUD", desc: "Zlatem lemované rozhraní pro pátý život a vyšší.", price: 0, requiredRebirth: 5, swatch: "linear-gradient(120deg, #2a1a00, #ffd86b 50%, #2a1a00)" },
    ],
    extras: [
      { id: "magnet", slot: "extra", name: "Money Magnet", desc: "Bankovky se po chvíli samy přitáhnout k tvému účtu.", price: 7500, swatch: "linear-gradient(120deg, #0b3d1d, #45d673 60%, #0b3d1d)" },
      { id: "double", slot: "extra", name: "Double Dip", desc: "Každá sebraná bankovka má dvojnásobnou hodnotu.", price: 12000, swatch: "linear-gradient(120deg, #4a2e00, #ffd86b 60%, #4a2e00)" },
      { id: "nightclub", slot: "extra", name: "Nightclub", desc: "+3 GTA$ každou sekundu. Byznys přetrvá i rebirth.", price: 5000, passive: 3, swatch: "linear-gradient(120deg, #22103f, #a35cff 60%, #22103f)" },
      { id: "casino", slot: "extra", name: "Casino VIP", desc: "+12 GTA$ každou sekundu. Stálý příjem, který zůstává.", price: 18000, passive: 12, swatch: "linear-gradient(120deg, #3b0909, #ff4fa3 60%, #3b0909)" },
      { id: "lucky", slot: "extra", name: "Lucky Charm", desc: "Dvojnásobná šance na zlatou bankovku s 5× hodnotou.", price: 9000, swatch: "linear-gradient(120deg, #4a3400, #ffe07a 60%, #4a3400)" },
      { id: "combo", slot: "extra", name: "Combo Master", desc: "Combo se prodlužuje a každý stupeň přidává 20 % místo 10 %.", price: 14000, swatch: "linear-gradient(120deg, #002b30, #29e7e0 60%, #002b30)" },
    ],
    badges: [],
  };

  const ACHIEVEMENTS = [
    { id: "first", name: "První bankovka", desc: "Seber svou první bankovku.", reward: 250, test: (p) => p.stats.collected >= 1 },
    { id: "collector", name: "Sběrač", desc: "Seber celkem 50 bankovek.", reward: 1500, test: (p) => p.stats.collected >= 50 },
    { id: "combo", name: "Rychlá ruka", desc: "Získej combo 8×.", reward: 4000, test: (p) => p.stats.bestCombo >= 8 },
    { id: "jackpot", name: "Zlatá horečka", desc: "Chyť 5 zlatých bankovek.", reward: 5000, test: (p) => p.stats.jackpots >= 5 },
    { id: "tycoon", name: "Vice City tycoon", desc: "Celkem vydělej 100 000 GTA$.", reward: 10000, test: (p) => p.lifetimeEarned >= 100000 },
    { id: "rebirth1", name: "Nový život", desc: "Proveď první rebirth.", reward: 5000, test: (p) => p.rebirths >= 1 },
    { id: "rebirth5", name: "Nekonečný cyklus", desc: "Proveď pět rebirthů.", reward: 25000, test: (p) => p.rebirths >= 5 },
  ];

  const DEFAULT_EQUIPPED = { dial: "neon", hands: "classic", ui: "glass", fx: "none" };
  const DENOMINATIONS = [50, 100, 100, 100, 500, 500, 1000];
  const STORAGE_KEY = "gtaclock.profile";
  const MAX_VALUE = Number.MAX_SAFE_INTEGER / 4;
  const POLL_MS = 15000;
  const MAX_BILLS = 7;
  const DROP_COOLDOWN_MS = 12000;
  const COMBO_WINDOW_MS = 3200;
  const COMBO_MAX = 10;
  const REBIRTH_BASE = 25000;
  const JACKPOT_CHANCE = 0.08;

  const cashLayer = document.getElementById("cash-layer");
  const floatLayer = document.getElementById("float-layer");
  const moneyValue = document.getElementById("money-value");
  const shopMoney = document.getElementById("shop-money");
  const wallet = document.getElementById("wallet");
  const pulse = document.getElementById("pulse");
  const muteBtn = document.getElementById("mute-btn");
  const shop = document.getElementById("shop");
  const shopItems = document.getElementById("shop-items");
  const shopTabs = document.getElementById("shop-tabs");
  const shopClose = document.getElementById("shop-close");
  const dropBtn = document.getElementById("btn-drop");
  const toastEl = document.getElementById("toast");
  const rebirthModal = document.getElementById("rebirth");
  const rebirthClose = document.getElementById("rebirth-close");
  const rebirthConfirm = document.getElementById("rebirth-confirm");
  const btnRebirth = document.getElementById("btn-rebirth");
  const comboEl = document.getElementById("combo");
  const comboValue = document.getElementById("combo-value");
  const levelValue = document.getElementById("level-value");
  const multValue = document.getElementById("mult-value");
  const rebirthValue = document.getElementById("rebirth-value");
  const rebirthLabel = document.getElementById("rebirth-label");
  const rebirthProgressText = document.getElementById("rebirth-progress-text");
  const rebirthFill = document.getElementById("rebirth-fill");
  const xpLabel = document.getElementById("xp-label");
  const xpProgressText = document.getElementById("xp-progress-text");
  const xpFill = document.getElementById("xp-fill");
  const statCollected = document.getElementById("stat-collected");
  const statEarned = document.getElementById("stat-earned");
  const statCombo = document.getElementById("stat-combo");
  const statJackpots = document.getElementById("stat-jackpots");
  const shopFoot = document.getElementById("shop-foot");
  const hands = {
    hour: document.getElementById("hand-hour"),
    minute: document.getElementById("hand-minute"),
    second: document.getElementById("hand-second"),
  };
  const timeEl = document.getElementById("time-text");
  const dateEl = document.getElementById("date-text");
  const tzEl = document.getElementById("tz-text");
  const statusEl = document.getElementById("status");
  const statusText = statusEl.querySelector("span");

  const numberFormat = new Intl.NumberFormat("cs-CZ");
  const fmt = (value) => numberFormat.format(Math.floor(value));
  const clampInt = (value, min, max, fallback) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.floor(number))) : fallback;
  };

  /* --- Úložiště --------------------------------------------------------- */

  function rawGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function rawSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      /* hra funguje i bez localStorage */
    }
  }

  const ALL_ITEMS = Object.keys(CATALOG).reduce((list, tab) => list.concat(CATALOG[tab]), []);

  function loadProfile() {
    let stored = null;
    try {
      stored = JSON.parse(rawGet(STORAGE_KEY) || "null");
    } catch (error) {
      stored = null;
    }
    const migrated = !stored || typeof stored !== "object";
    if (migrated) stored = {};

    const legacyMoney = clampInt(rawGet("gtaclock.money"), 0, MAX_VALUE, 0);
    const money = clampInt(stored.money, 0, MAX_VALUE, legacyMoney);
    const rebirths = clampInt(stored.rebirths, 0, 100, 0);
    const lifetime = clampInt(stored.lifetimeEarned, 0, MAX_VALUE, money);
    const run = clampInt(stored.runEarned, 0, MAX_VALUE, lifetime);

    let legacyOwned = [];
    try {
      const parsed = JSON.parse(rawGet("gtaclock.owned") || "[]");
      if (Array.isArray(parsed)) legacyOwned = parsed;
    } catch (error) {
      /* poškozená data ignorujeme */
    }
    const sourceOwned = Array.isArray(stored.owned) ? stored.owned : legacyOwned;
    const owned = sourceOwned.filter((id) => ALL_ITEMS.some((item) => item.id === id));

    ALL_ITEMS.forEach((item) => {
      const unlocked = item.price === 0 && (!item.requiredRebirth || item.requiredRebirth <= rebirths);
      if (unlocked && owned.indexOf(item.id) === -1) owned.push(item.id);
    });

    let claimed = [];
    if (Array.isArray(stored.claimed)) {
      claimed = stored.claimed.filter((id) => ACHIEVEMENTS.some((achievement) => achievement.id === id));
    }

    const rawStats = stored.stats && typeof stored.stats === "object" ? stored.stats : {};
    const stats = {
      collected: clampInt(rawStats.collected, 0, MAX_VALUE, 0),
      jackpots: clampInt(rawStats.jackpots, 0, MAX_VALUE, 0),
      drops: clampInt(rawStats.drops, 0, MAX_VALUE, 0),
      spent: clampInt(rawStats.spent, 0, MAX_VALUE, 0),
      bestCombo: clampInt(rawStats.bestCombo, 0, COMBO_MAX, 0),
      playSeconds: clampInt(rawStats.playSeconds, 0, MAX_VALUE, 0),
    };

    const profile = {
      money,
      lifetimeEarned: Math.max(lifetime, money),
      runEarned: run,
      rebirths,
      xp: clampInt(stored.xp, 0, MAX_VALUE, 0),
      level: clampInt(stored.level, 1, 999, 1),
      owned,
      claimed,
      stats,
      equipped: Object.assign({}, DEFAULT_EQUIPPED),
      lastSeen: clampInt(stored.lastSeen, 0, Date.now(), Date.now()),
      muted: stored.muted === true || (migrated && rawGet("gtaclock.muted") === "1"),
    };

    Object.keys(DEFAULT_EQUIPPED).forEach((slot) => {
      const candidate = root.dataset[slot] || DEFAULT_EQUIPPED[slot];
      const item = ALL_ITEMS.find((entry) => entry.id === candidate && entry.slot === slot);
      profile.equipped[slot] = item && isOwnedBy(profile, item) ? candidate : DEFAULT_EQUIPPED[slot];
    });
    return profile;
  }

  function isOwnedBy(data, item) {
    if (item.requiredRebirth) return data.rebirths >= item.requiredRebirth;
    return data.owned.indexOf(item.id) !== -1;
  }

  const profile = loadProfile();

  function saveProfile() {
    profile.lastSeen = Date.now();
    rawSet(STORAGE_KEY, JSON.stringify(profile));
  }

  function isOwned(item) {
    return isOwnedBy(profile, item);
  }

  function isEquipped(item) {
    if (item.slot === "extra") return isOwned(item);
    return profile.equipped[item.slot] === item.id;
  }

  function multiplier() {
    return 1 + profile.rebirths * 0.5;
  }

  function rebirthTarget() {
    return REBIRTH_BASE * (profile.rebirths + 1);
  }

  function xpTarget(level) {
    return 120 + (level - 1) * 60;
  }

  function passivePerSecond() {
    return ALL_ITEMS.reduce((sum, item) => sum + (item.passive && isOwned(item) ? item.passive : 0), 0);
  }

  /* --- Zvuk ------------------------------------------------------------- */

  const sound = (() => {
    let ctx = null;
    let muted = profile.muted;

    function context() {
      if (muted) return null;
      if (!ctx) {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return null;
        ctx = new AudioCtor();
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }

    function tone(freq, at, duration, wave, level) {
      const audio = context();
      if (!audio) return;
      const start = audio.currentTime + at;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(level, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain).connect(audio.destination);
      osc.start(start);
      osc.stop(start + duration + 0.03);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    }

    function cash(big) {
      const notes = big ? [784, 1046, 1318] : [659, 880, 1175];
      notes.forEach((freq, index) => tone(freq, index * 0.055, 0.12, "triangle", 0.06));
    }

    function buy() {
      [523, 659, 784, 1046].forEach((freq, index) => tone(freq, index * 0.07, 0.16, "square", 0.045));
    }

    function deny() {
      tone(220, 0, 0.16, "sawtooth", 0.045);
      tone(165, 0.1, 0.2, "sawtooth", 0.04);
    }

    function drop() {
      const audio = context();
      if (!audio) return;
      const duration = 0.36;
      const buffer = audio.createBuffer(1, Math.floor(audio.sampleRate * duration), audio.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      }
      const source = audio.createBufferSource();
      source.buffer = buffer;
      const filter = audio.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 0.8;
      filter.frequency.setValueAtTime(300, audio.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2400, audio.currentTime + duration);
      const gain = audio.createGain();
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.09, audio.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
      source.connect(filter).connect(gain).connect(audio.destination);
      source.start();
      source.onended = () => {
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
    }

    function fanfare(notes) {
      notes.forEach((freq, index) => {
        tone(freq, index * 0.09, 0.3, "triangle", 0.055);
      });
    }

    return {
      cash,
      buy,
      deny,
      drop,
      levelup: () => fanfare([523, 659, 784]),
      achievement: () => fanfare([659, 880, 1175, 1568]),
      rebirth: () => {
        drop();
        fanfare([262, 392, 523, 784, 1046]);
      },
      isMuted: () => muted,
      toggle() {
        muted = !muted;
        profile.muted = muted;
        saveProfile();
        return muted;
      },
    };
  })();

  function paintMute() {
    const muted = sound.isMuted();
    muteBtn.classList.toggle("is-muted", muted);
    muteBtn.setAttribute("aria-pressed", String(muted));
    muteBtn.setAttribute("aria-label", muted ? "Zapnout zvuk" : "Ztlumit zvuk");
    muteBtn.title = muted ? "Zvuk vypnut (M)" : "Zvuk zapnut (M)";
  }

  /* --- Toast ------------------------------------------------------------- */

  const toastQueue = [];
  let toastTimer = 0;
  let toastActive = false;

  function nextToast() {
    if (!toastQueue.length) {
      toastActive = false;
      toastEl.classList.remove("is-visible");
      return;
    }
    toastActive = true;
    toastEl.textContent = toastQueue.shift();
    toastEl.classList.add("is-visible");
    toastTimer = window.setTimeout(nextToast, 2600);
  }

  function toast(message) {
    toastQueue.push(message);
    if (!toastActive) {
      window.clearTimeout(toastTimer);
      nextToast();
    }
  }

  /* --- Peníze, zkušenosti a odznaky -------------------------------------- */

  function renderMoney(bump) {
    moneyValue.textContent = fmt(profile.money);
    shopMoney.textContent = fmt(profile.money);
    if (!bump) return;
    wallet.classList.remove("is-bump");
    void wallet.offsetWidth;
    wallet.classList.add("is-bump");
    window.setTimeout(() => wallet.classList.remove("is-bump"), 400);
  }

  function addMoney(amount, earned, bump) {
    if (!Number.isFinite(amount) || amount === 0) return;
    profile.money = Math.min(MAX_VALUE, Math.max(0, profile.money + amount));
    if (earned) {
      profile.lifetimeEarned += amount;
      profile.runEarned += amount;
    }
    renderMoney(bump !== false && amount > 0);
    saveProfile();
  }

  function floatAmount(text, x, y) {
    const label = document.createElement("span");
    label.className = "float-amount";
    label.textContent = text;
    label.style.setProperty("--x", x + "px");
    label.style.setProperty("--y", y + "px");
    floatLayer.append(label);
    window.setTimeout(() => label.remove(), 1050);
  }

  function pulseClock(celebrate) {
    pulse.classList.remove("is-pulsing", "is-celebrating");
    void pulse.offsetWidth;
    pulse.classList.add(celebrate ? "is-celebrating" : "is-pulsing");
  }

  let combo = 0;
  let comboTimer = 0;

  function resetCombo() {
    combo = 0;
    comboEl.classList.remove("is-active");
  }

  function bumpCombo() {
    combo = Math.min(COMBO_MAX, combo + 1);
    profile.stats.bestCombo = Math.max(profile.stats.bestCombo, combo);
    comboValue.textContent = String(combo);
    comboEl.classList.add("is-active");
    comboEl.classList.remove("is-flash");
    void comboEl.offsetWidth;
    comboEl.classList.add("is-flash");
    window.clearTimeout(comboTimer);
    comboTimer = window.setTimeout(resetCombo, COMBO_WINDOW_MS * (isOwned({ id: "combo" }) ? 1.5 : 1));
  }

  function comboBonus() {
    const perStep = isOwned({ id: "combo" }) ? 0.2 : 0.1;
    return 1 + combo * perStep;
  }

  function gainXp(amount) {
    profile.xp += amount;
    let lastReward = 0;
    while (profile.xp >= xpTarget(profile.level) && profile.level < 999) {
      profile.xp -= xpTarget(profile.level);
      profile.level += 1;
      lastReward = Math.round(150 * profile.level * multiplier());
      addMoney(lastReward, true);
    }
    if (lastReward) {
      sound.levelup();
      pulseClock(true);
      toast("Úroveň " + profile.level + "! Odměna +$" + fmt(lastReward));
      checkAchievements();
    }
  }

  function checkAchievements() {
    let changed = false;
    let found = true;
    while (found) {
      found = false;
      ACHIEVEMENTS.forEach((achievement) => {
        if (found || profile.claimed.indexOf(achievement.id) !== -1 || !achievement.test(profile)) return;
        profile.claimed.push(achievement.id);
        addMoney(achievement.reward, false);
        sound.achievement();
        toast("Odznak: " + achievement.name + " · +$" + fmt(achievement.reward));
        found = true;
        changed = true;
      });
    }
    if (changed) {
      saveProfile();
      renderAll();
    }
  }

  function renderProgress() {
    const target = rebirthTarget();
    const pct = Math.min(100, (profile.runEarned / target) * 100);
    rebirthFill.style.width = pct.toFixed(1) + "%";
    rebirthLabel.textContent = "Rebirth " + (profile.rebirths + 1);
    rebirthProgressText.textContent = fmt(Math.min(profile.runEarned, target)) + " / " + fmt(target) + " GTA$";

    const needed = xpTarget(profile.level);
    xpFill.style.width = Math.min(100, (profile.xp / needed) * 100).toFixed(1) + "%";
    xpLabel.textContent = "Úroveň " + profile.level;
    xpProgressText.textContent = fmt(profile.xp) + " / " + fmt(needed) + " XP";
  }

  function renderStats() {
    statCollected.textContent = fmt(profile.stats.collected);
    statEarned.textContent = fmt(profile.lifetimeEarned);
    statCombo.textContent = String(profile.stats.bestCombo) + "×";
    statJackpots.textContent = String(profile.stats.jackpots);
  }

  function renderRank() {
    levelValue.textContent = "Lv " + profile.level;
    multValue.textContent = "×" + multiplier().toFixed(1).replace(/\.0$/, "");
    rebirthValue.textContent = "R" + profile.rebirths;
    root.dataset.rebirths = String(Math.min(profile.rebirths, 5));
  }

  function renderRebirth() {
    const ready = profile.runEarned >= rebirthTarget();
    btnRebirth.classList.toggle("is-ready", ready);
    btnRebirth.innerHTML = ready
      ? 'Rebirth <small>R</small>'
      : "Rebirth <small>" + fmt(rebirthTarget() - profile.runEarned) + " GTA$</small>";

    const target = rebirthTarget();
    const pct = Math.min(100, (profile.runEarned / target) * 100);
    document.getElementById("rebirth-modal-fill").style.width = pct.toFixed(1) + "%";
    document.getElementById("rebirth-modal-progress").textContent =
      fmt(Math.min(profile.runEarned, target)) + " / " + fmt(target) + " GTA$";
    document.getElementById("rebirth-mult").textContent = "×" + multiplier().toFixed(1).replace(/\.0$/, "");
    document.getElementById("rebirth-next").textContent = "×" + (multiplier() + 0.5).toFixed(1).replace(/\.0$/, "");
    document.getElementById("rebirth-count").textContent = profile.rebirths + " → " + (profile.rebirths + 1);
    rebirthConfirm.disabled = !ready;
    rebirthConfirm.textContent = ready ? "Provést rebirth" : "Ještě " + fmt(target - profile.runEarned) + " GTA$";
  }

  function syncEquipped() {
    Object.keys(profile.equipped).forEach((slot) => {
      root.dataset[slot] = profile.equipped[slot];
    });
  }

  function renderAll() {
    renderMoney(false);
    renderProgress();
    renderStats();
    renderRank();
    renderRebirth();
    renderShop();
    syncEquipped();
  }

  /* --- Bankovky ---------------------------------------------------------- */

  function collectCash(bill) {
    if (bill.dataset.done === "1") return;
    bill.dataset.done = "1";

    const base = Number(bill.dataset.value) || 50;
    const jackpot = bill.classList.contains("cash--jackpot");
    const box = bill.getBoundingClientRect();
    bumpCombo();
    const gain = Math.round(base * (jackpot ? 5 : 1) * multiplier() * comboBonus() * (isOwned({ id: "double" }) ? 2 : 1));

    bill.classList.remove("is-magnet");
    bill.classList.add("is-collected");
    window.setTimeout(() => bill.remove(), 420);

    profile.stats.collected += 1;
    if (jackpot) profile.stats.jackpots += 1;
    floatAmount("+$" + fmt(gain), box.left + box.width / 2, box.top + box.height / 2);
    pulseClock(jackpot);
    sound.cash(base >= 500 || jackpot);
    addMoney(gain, true);
    gainXp(Math.round(gain / 5));
    renderAll();
    saveProfile();
    toast(
      "+$" + fmt(gain) + " · GTA$ připsány" +
      (jackpot ? " · ZLATÁ BANKOVKA!" : combo > 1 ? " · combo " + combo + "×" : "")
    );
    checkAchievements();
  }

  function activeBills() {
    return cashLayer.querySelectorAll(".cash:not(.is-collected):not(.is-leaving)").length;
  }

  function spawnCash(options) {
    const settings = options || {};
    if (activeBills() >= MAX_BILLS) return null;

    const jackpot = settings.jackpot !== undefined
      ? settings.jackpot
      : Math.random() < (isOwned({ id: "lucky" }) ? JACKPOT_CHANCE * 2 : JACKPOT_CHANCE);
    const value = settings.value || DENOMINATIONS[Math.floor(Math.random() * DENOMINATIONS.length)];
    const edge = window.innerWidth < 500 ? 12 : 7;
    const x = settings.x !== undefined ? settings.x : edge + Math.random() * (100 - edge * 2);
    const y = settings.y !== undefined ? settings.y : 21 + Math.random() * 60;

    const bill = document.createElement("button");
    bill.type = "button";
    bill.className = "cash cash--" + value + (jackpot ? " cash--jackpot" : "");
    bill.dataset.value = String(value);
    bill.style.setProperty("--x", x.toFixed(2) + "%");
    bill.style.setProperty("--y", y.toFixed(2) + "%");
    bill.style.setProperty("--r", (Math.random() * 44 - 22).toFixed(1) + "deg");
    bill.style.zIndex = String(10 + Math.floor(Math.random() * 10));
    bill.setAttribute("aria-label", "Sebrat " + fmt(value * (jackpot ? 5 : 1)) + " GTA dolarů" + (jackpot ? " – zlatá bankovka" : ""));
    bill.textContent = "$" + fmt(value * (jackpot ? 5 : 1));
    cashLayer.append(bill);

    bill.addEventListener("click", () => collectCash(bill));

    window.setTimeout(() => {
      if (bill.dataset.done === "1" || !bill.isConnected) return;
      bill.classList.add("is-leaving");
      window.setTimeout(() => bill.remove(), 460);
    }, settings.life || 9000);

    if (isOwned({ id: "magnet" })) {
      bill.classList.add("is-magnet");
      window.setTimeout(() => collectCash(bill), 1400);
    }

    return bill;
  }

  function dropMoney() {
    sound.drop();
    const count = 4 + Math.min(2, Math.floor(profile.rebirths / 3));
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => {
        spawnCash({
          x: 32 + Math.random() * 36,
          y: 28 + Math.random() * 34,
          life: 7000,
        });
      }, i * 110);
    }
    toast("Peněžní shoz! Chyť bankovky, než zmizí.");
  }

  let dropReadyAt = 0;

  function dropCooldown() {
    return Math.max(6000, DROP_COOLDOWN_MS - profile.rebirths * 800);
  }

  function updateDropButton() {
    const left = Math.ceil((dropReadyAt - Date.now()) / 1000);
    dropBtn.disabled = left > 0;
    if (left > 0) {
      dropBtn.textContent = "Peníze za " + left + " s";
    } else {
      dropBtn.innerHTML = 'Shodit peníze <small>mezerník</small>';
    }
    renderRebirth();
  }

  function triggerDrop() {
    if (Date.now() < dropReadyAt || anyDialogOpen()) return;
    dropReadyAt = Date.now() + dropCooldown();
    profile.stats.drops += 1;
    updateDropButton();
    dropMoney();
    saveProfile();
  }

  function scheduleSpawn() {
    window.setTimeout(() => {
      if (!anyDialogOpen()) spawnCash();
      scheduleSpawn();
    }, 2600 + Math.random() * 3000);
  }

  /* --- Rebirth ----------------------------------------------------------- */

  function performRebirth() {
    if (profile.runEarned < rebirthTarget()) {
      sound.deny();
      return;
    }
    const level = profile.rebirths + 1;
    profile.rebirths = level;
    profile.money = 0;
    profile.runEarned = 0;
    profile.equipped = Object.assign({}, DEFAULT_EQUIPPED);
    resetCombo();
    window.clearTimeout(comboTimer);

    const permanent = profile.owned.filter((id) => {
      const item = ALL_ITEMS.find((entry) => entry.id === id);
      return item && item.slot === "extra";
    });
    profile.owned = ALL_ITEMS.filter((item) => item.price === 0 && !item.requiredRebirth).map((item) => item.id);
    permanent.forEach((id) => profile.owned.push(id));
    const unlocked = ALL_ITEMS.filter((item) => item.requiredRebirth === level).map((item) => item.name);
    ALL_ITEMS.forEach((item) => {
      if (item.requiredRebirth && item.requiredRebirth <= level && profile.owned.indexOf(item.id) === -1) {
        profile.owned.push(item.id);
      }
    });

    cashLayer.textContent = "";
    floatLayer.textContent = "";
    dropReadyAt = 0;
    closeRebirth();
    saveProfile();
    renderAll();
    updateDropButton();
    sound.rebirth();
    pulseClock(true);
    toast(
      "REBIRTH " + level + "! Násobek ×" + multiplier().toFixed(1).replace(/\.0$/, "") +
      (unlocked.length ? " · odemknuto: " + unlocked.join(", ") : "")
    );
    checkAchievements();
  }

  /* --- Obchod ------------------------------------------------------------ */

  let currentTab = "dial";

  function buttonState(item) {
    if (item.requiredRebirth && item.requiredRebirth > profile.rebirths) {
      return { label: "Rebirth " + item.requiredRebirth, cls: "is-locked", tag: "PRESTIŽ" };
    }
    if (item.slot === "extra") {
      return isOwned(item)
        ? { label: "Aktivní", cls: "is-equipped", tag: "AKTIVNÍ" }
        : { label: "$" + fmt(item.price), cls: profile.money < item.price ? "is-poor" : "", tag: "" };
    }
    if (item.price !== 0 && !isOwned(item)) {
      return { label: "$" + fmt(item.price), cls: profile.money < item.price ? "is-poor" : "", tag: "" };
    }
    if (isEquipped(item)) {
      const activeFx = item.slot === "fx";
      return {
        label: activeFx ? "Vypnout efekt" : "Nasazeno",
        cls: "is-equipped",
        tag: activeFx ? "ZAPNUTO" : "NASAZENO",
      };
    }
    return { label: "Nasadit", cls: "", tag: item.price === 0 ? "ZDARMA" : "VLASTNÍŠ" };
  }

  function renderShop() {
    shopMoney.textContent = fmt(profile.money);
    shopItems.textContent = "";

    if (currentTab === "badges") {
      ACHIEVEMENTS.forEach((achievement) => {
        const done = profile.claimed.indexOf(achievement.id) !== -1;
        const card = document.createElement("article");
        card.className = "item achievement" + (done ? " is-equipped" : "");
        card.innerHTML =
          '<div class="achievement__mark">' + (done ? "✓" : "?") + "</div>" +
          '<div class="item__name">' + achievement.name + "</div>" +
          '<div class="item__desc">' + achievement.desc + "</div>" +
          '<span class="achievement__reward">' + (done ? "ZÍSKÁNO" : "ODMĚNA $" + fmt(achievement.reward)) + "</span>";
        shopItems.append(card);
      });
    } else {
      CATALOG[currentTab].forEach((item) => {
        const state = buttonState(item);
        const card = document.createElement("article");
        card.className = "item" + (isEquipped(item) && item.slot !== "extra" ? " is-equipped" : "");
        card.innerHTML =
          '<div class="item__preview" style="--swatch: ' + item.swatch + '"></div>' +
          '<div class="item__name">' + item.name + "</div>" +
          '<div class="item__desc">' + item.desc + "</div>" +
          '<button class="item__buy ' + state.cls + '" type="button" data-id="' + item.id + '">' + state.label + "</button>" +
          (state.tag ? '<span class="item__tag">' + state.tag + "</span>" : "");
        shopItems.append(card);
      });
    }

    shopFoot.innerHTML =
      "Trvalý násobek <b>×" + multiplier().toFixed(1).replace(/\.0$/, "") + "</b> · " +
      "pasivní příjem <b>+$" + fmt(passivePerSecond()) + "/s</b> · " +
      "odznaky <b>" + profile.claimed.length + "/" + ACHIEVEMENTS.length + "</b> · " +
      "výdělky z byznysů a odznaků zůstávají i po rebirthu.";
  }

  function handleItemClick(id) {
    const item = ALL_ITEMS.find((entry) => entry.id === id);
    if (!item) return;

    if (item.requiredRebirth && item.requiredRebirth > profile.rebirths) {
      sound.deny();
      toast("Tento předmět odemkneš rebirthem " + item.requiredRebirth + ".");
      return;
    }

    if (!isOwned(item)) {
      if (profile.money < item.price) {
        sound.deny();
        toast("Máš málo GTA$ – sbírej další peníze.");
        return;
      }
      profile.money -= item.price;
      profile.stats.spent += item.price;
      profile.owned.push(item.id);
      if (item.slot !== "extra") profile.equipped[item.slot] = item.id;
      sound.buy();
      toast("Koupeno: " + item.name + " · -$" + fmt(item.price));
    } else if (item.slot === "extra") {
      toast(item.name + " už je aktivní.");
      return;
    } else if (item.slot === "fx" && isEquipped(item)) {
      profile.equipped.fx = "none";
      sound.buy();
      toast("Efekt " + item.name + " vypnut.");
    } else if (!isEquipped(item)) {
      profile.equipped[item.slot] = item.id;
      sound.buy();
      toast("Nasazeno: " + item.name);
    } else {
      return;
    }

    syncEquipped();
    saveProfile();
    renderAll();
  }

  /* --- Dialogy ----------------------------------------------------------- */

  let lastFocus = null;

  function anyDialogOpen() {
    return shop.classList.contains("is-open") || rebirthModal.classList.contains("is-open");
  }

  function openDialog(element) {
    lastFocus = document.activeElement;
    element.classList.add("is-open");
    element.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDialog(element, focusTarget) {
    element.classList.remove("is-open");
    element.setAttribute("aria-hidden", "true");
    if (!anyDialogOpen()) document.body.style.overflow = "";
    const target = focusTarget || lastFocus;
    if (target && typeof target.focus === "function") target.focus();
  }

  function trapFocus(event, container) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(container.querySelectorAll("button:not(:disabled), a[href], [tabindex]:not([tabindex='-1'])"));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openShop() {
    if (shop.classList.contains("is-open")) return;
    renderShop();
    openDialog(shop);
    shopClose.focus();
  }

  function closeShop() {
    if (!shop.classList.contains("is-open")) return;
    closeDialog(shop, document.getElementById("shop-btn"));
  }

  function openRebirth() {
    if (rebirthModal.classList.contains("is-open")) return;
    renderRebirth();
    openDialog(rebirthModal);
    rebirthClose.focus();
  }

  function closeRebirth() {
    if (!rebirthModal.classList.contains("is-open")) return;
    closeDialog(rebirthModal, btnRebirth);
  }

  shopItems.addEventListener("click", (event) => {
    const button = event.target.closest(".item__buy");
    if (button) handleItemClick(button.dataset.id);
  });

  shopTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-tab]");
    if (!button) return;
    currentTab = button.dataset.tab;
    Array.from(shopTabs.children).forEach((tab) => tab.classList.toggle("is-active", tab === button));
    renderShop();
  });

  shopClose.addEventListener("click", closeShop);
  shop.querySelector(".shop__backdrop").addEventListener("click", closeShop);
  rebirthClose.addEventListener("click", closeRebirth);
  rebirthModal.querySelector(".rebirth__backdrop").addEventListener("click", closeRebirth);
  rebirthConfirm.addEventListener("click", performRebirth);
  document.getElementById("shop-btn").addEventListener("click", openShop);
  document.getElementById("btn-shop").addEventListener("click", openShop);
  btnRebirth.addEventListener("click", openRebirth);

  /* --- Čas serveru ------------------------------------------------------- */

  const pad = (value) => String(value).padStart(2, "0");

  let baseEpoch = Number.isFinite(initial.epoch_ms) ? initial.epoch_ms : Date.now();
  let wallOffset = baseEpoch - ((initial.hour * 3600 + initial.minute * 60 + initial.second) * 1000);
  let t0 = performance.now();
  let lastTimeText = "";
  let lastHour = -1;

  function daypartFor(hour) {
    if (hour >= 5 && hour < 8) return "dawn";
    if (hour >= 8 && hour < 17) return "day";
    if (hour >= 17 && hour < 20) return "dusk";
    return "night";
  }

  function applyDaypart(hour) {
    if (hour === lastHour) return;
    lastHour = hour;
    root.dataset.daypart = daypartFor(hour);
  }

  function sync(payload) {
    if (Number.isFinite(payload.epoch_ms)) baseEpoch = payload.epoch_ms;
    wallOffset = baseEpoch - (payload.hour * 3600 + payload.minute * 60 + payload.second) * 1000;
    t0 = performance.now();
    dateEl.textContent = payload.date;
    tzEl.textContent = payload.timezone;
    applyDaypart(payload.hour);
  }

  function setStatus(state, text) {
    statusEl.dataset.state = state;
    statusText.textContent = text;
  }

  function draw() {
    const now = baseEpoch + performance.now() - t0;
    const wall = new Date(now - wallOffset);
    const hour = wall.getUTCHours();
    const minute = wall.getUTCMinutes();
    const second = wall.getUTCSeconds();
    const secondsTotal = hour * 3600 + minute * 60 + second + wall.getUTCMilliseconds() / 1000;

    hands.second.style.setProperty("--angle", ((secondsTotal % 60) * 6).toFixed(3) + "deg");
    hands.minute.style.setProperty("--angle", (((secondsTotal / 60) % 60) * 6).toFixed(3) + "deg");
    hands.hour.style.setProperty("--angle", (((secondsTotal / 3600) % 12) * 30).toFixed(3) + "deg");

    const text = pad(hour) + ":" + pad(minute) + ":" + pad(second);
    if (text !== lastTimeText) {
      lastTimeText = text;
      timeEl.textContent = text;
      applyDaypart(hour);
    }

    requestAnimationFrame(draw);
  }

  async function poll() {
    try {
      const response = await fetch("/api/time", { cache: "no-store" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      sync(await response.json());
      setStatus("ok", "synchronizováno se serverem");
    } catch (error) {
      setStatus("error", "spojení se serverem přerušeno");
    }
  }

  /* --- Pozadí ------------------------------------------------------------ */

  function buildBackdrop() {
    const stars = document.getElementById("stars");
    const starFragment = document.createDocumentFragment();
    for (let i = 0; i < 56; i += 1) {
      const star = document.createElement("span");
      const size = (Math.random() * 1.8 + 1).toFixed(1);
      star.style.cssText =
        "left:" + (Math.random() * 100).toFixed(2) + "%;" +
        "top:" + (Math.random() * 100).toFixed(2) + "%;" +
        "width:" + size + "px;height:" + size + "px;" +
        "--d:" + (Math.random() * 4).toFixed(2) + "s;" +
        "--t:" + (2.6 + Math.random() * 3.4).toFixed(2) + "s";
      starFragment.append(star);
    }
    stars.append(starFragment);

    [["skyline-far", 34, 18, 70], ["skyline-near", 24, 24, 88]].forEach(([id, count, min, max]) => {
      const container = document.getElementById(id);
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < count; i += 1) {
        const building = document.createElement("div");
        building.className = "building" + (Math.random() < 0.18 ? " building--antenna" : "");
        building.style.cssText =
          "height:" + (min + Math.random() * (max - min)).toFixed(1) + "%;" +
          "width:" + (18 + Math.random() * 46).toFixed(0) + "px;" +
          "--a:" + (12 + Math.random() * 26).toFixed(0) + "px";
        fragment.append(building);
      }
      container.append(fragment);
    });
  }

  /* --- Ovládání ---------------------------------------------------------- */

  function toggleMute() {
    const muted = sound.toggle();
    paintMute();
    toast(muted ? "Zvuk vypnut" : "Zvuk zapnut");
    renderAll();
  }

  dropBtn.addEventListener("click", triggerDrop);
  muteBtn.addEventListener("click", toggleMute);

  window.addEventListener("keydown", (event) => {
    const target = event.target;
    const tag = target && target.tagName ? target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || (target && target.isContentEditable)) return;

    if (rebirthModal.classList.contains("is-open")) {
      if (event.key === "Escape") closeRebirth();
      else trapFocus(event, rebirthModal.querySelector(".rebirth__card"));
      return;
    }
    if (shop.classList.contains("is-open")) {
      if (event.key === "Escape") closeShop();
      else trapFocus(event, shop.querySelector(".shop__card"));
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.code === "Space") {
      if (tag === "button") return;
      event.preventDefault();
      triggerDrop();
      return;
    }

    const key = event.key.toLowerCase();
    if (key === "b") {
      event.preventDefault();
      openShop();
    } else if (key === "m") {
      event.preventDefault();
      toggleMute();
    } else if (key === "r") {
      event.preventDefault();
      openRebirth();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) poll();
  });
  window.addEventListener("focus", poll);

  /* --- Start ------------------------------------------------------------- */

  paintMute();
  buildBackdrop();
  sync(initial);
  requestAnimationFrame(draw);
  poll();
  window.setInterval(poll, POLL_MS);
  updateDropButton();
  window.setInterval(updateDropButton, 500);
  scheduleSpawn();
  window.setTimeout(() => spawnCash({ x: 24, y: 38, value: 100 }), 1300);
  window.setTimeout(() => spawnCash({ x: 72, y: 47, value: 500 }), 2200);

  const awaySeconds = Math.min(4 * 3600, Math.max(0, Math.round((Date.now() - profile.lastSeen) / 1000)));
  if (awaySeconds > 10 && passivePerSecond() > 0) {
    const offline = Math.round(awaySeconds * passivePerSecond() * 0.5);
    addMoney(offline, true);
    toast("Váš byznys vydělal " + fmt(offline) + " GTA$ během vaší nepřítomnosti.");
  }
  saveProfile();

  window.setInterval(() => {
    profile.stats.playSeconds += 1;
    if (!document.hidden && passivePerSecond() > 0) addMoney(passivePerSecond(), true, false);
  }, 1000);

  renderAll();
  checkAchievements();
  window.setTimeout(() => toast("Vítej ve Vice City. Sbírej GTA$, kup byznys a zkus rebirth!"), 600);
})();
