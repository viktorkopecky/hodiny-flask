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
    ],
    hands: [
      { id: "classic", slot: "hands", name: "Classic Metal", desc: "Klasické kovové ručičky. Spolehlivé, nic víc, nic míň.", price: 0, swatch: "linear-gradient(115deg, #2a1d3a, #d9c9e8 50%, #2a1d3a)" },
      { id: "glow", slot: "hands", name: "Neon Glow", desc: "Ružička a minuty září jako výlohy klubů na South Beach.", price: 2200, swatch: "linear-gradient(115deg, #16b8c4, #ff4fa3 55%, #16b8c4)" },
      { id: "gold-hands", slot: "hands", name: "Gold Digger", desc: "Zlaté ručičky pro majitele vlastního kasina.", price: 4200, swatch: "linear-gradient(115deg, #8a5a0d, #ffe08a 50%, #8a5a0d)" },
    ],
    ui: [
      { id: "glass", slot: "ui", name: "Vice Glass", desc: "Průhledné panely s neonovými akcenty. Výchozí styl rozhraní.", price: 0, swatch: "linear-gradient(120deg, rgba(255,79,163,.5), rgba(41,231,224,.35))" },
      { id: "noir", slot: "ui", name: "Noir HUD", desc: "Tmavé rozhraní se zpěvnou červenou. Město, které nikdy nespí.", price: 2600, swatch: "linear-gradient(120deg, #120309, #ff3f59)" },
      { id: "minimal", slot: "ui", name: "Minimal", desc: "Potlačené panely, maximum prostoru pro výhled na město.", price: 3600, swatch: "linear-gradient(120deg, rgba(255,255,255,.08), rgba(255,255,255,.02))" },
      { id: "scanlines", slot: "fx", name: "Retro Scanlines", desc: "Retrosken přes obrazovku jako na starém krbu v motelu.", price: 900, swatch: "repeating-linear-gradient(180deg, #2a1a3a 0 3px, #0b0614 3px 6px)" },
      { id: "bloom", slot: "fx", name: "Neon Bloom", desc: "Rozmazané světelné halo po okrajích obrazovky.", price: 1800, swatch: "radial-gradient(circle, #120b24 35%, #ff4fa3 85%, #29e7e0 100%)" },
    ],
    extras: [
      { id: "magnet", slot: "extra", name: "Money Magnet", desc: "Bankovky se po chvíli samy přitáhnout k tvému účtu.", price: 7500, swatch: "linear-gradient(120deg, #0b3d1d, #45d673 60%, #0b3d1d)" },
      { id: "double", slot: "extra", name: "Double Dip", desc: "Každá sebraná bankovka má dvojnásobnou hodnotu.", price: 12000, swatch: "linear-gradient(120deg, #4a2e00, #ffd86b 60%, #4a2e00)" },
    ],
  };

  const DEFAULT_EQUIPPED = { dial: "neon", hands: "classic", ui: "glass", fx: "none" };
  const DENOMINATIONS = [50, 100, 100, 100, 500, 500, 1000];
  const POLL_MS = 15000;
  const MAX_BILLS = 7;
  const DROP_COOLDOWN_MS = 12000;

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
  const fmt = (value) => numberFormat.format(value);

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
    const money = Number.parseInt(rawGet("gtaclock.money"), 10);
    let owned = [];
    try {
      const parsed = JSON.parse(rawGet("gtaclock.owned") || "[]");
      if (Array.isArray(parsed)) owned = parsed.filter((id) => ALL_ITEMS.some((item) => item.id === id));
    } catch (error) {
      /* poškozená data ignorujeme */
    }

    const equipped = Object.assign({}, DEFAULT_EQUIPPED);
    Object.keys(DEFAULT_EQUIPPED).forEach((slot) => {
      const value = root.dataset[slot];
      if (value && ALL_ITEMS.some((item) => item.id === value && item.slot === slot)) {
        equipped[slot] = value;
      }
    });

    ALL_ITEMS.forEach((item) => {
      if (item.price === 0 && owned.indexOf(item.id) === -1) owned.push(item.id);
    });
    if (root.dataset.fx === "none") equipped.fx = "none";

    return { money: Number.isFinite(money) && money > 0 ? Math.floor(money) : 0, owned, equipped };
  }

  const profile = loadProfile();

  function saveProfile() {
    rawSet("gtaclock.money", String(profile.money));
    rawSet("gtaclock.owned", JSON.stringify(profile.owned));
    Object.keys(profile.equipped).forEach((slot) => {
      rawSet("gtaclock." + slot, profile.equipped[slot]);
    });
  }

  function isOwned(item) {
    return profile.owned.indexOf(item.id) !== -1;
  }

  function isEquipped(item) {
    if (item.slot === "extra") return isOwned(item);
    return profile.equipped[item.slot] === item.id;
  }

  /* --- Zvuk ------------------------------------------------------------- */

  const sound = (() => {
    let ctx = null;
    let muted = rawGet("gtaclock.muted") === "1";

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

    return {
      cash,
      buy,
      deny,
      drop,
      isMuted: () => muted,
      toggle() {
        muted = !muted;
        rawSet("gtaclock.muted", muted ? "1" : "0");
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

  let toastTimer = 0;

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove("is-visible"), 2800);
  }

  /* --- Peníze ------------------------------------------------------------ */

  function renderMoney(bump) {
    moneyValue.textContent = fmt(profile.money);
    shopMoney.textContent = fmt(profile.money);
    if (!bump) return;
    wallet.classList.remove("is-bump");
    void wallet.offsetWidth;
    wallet.classList.add("is-bump");
    window.setTimeout(() => wallet.classList.remove("is-bump"), 400);
  }

  function addMoney(amount) {
    profile.money += amount;
    renderMoney(true);
    saveProfile();
    renderShop();
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

  function pulseClock() {
    pulse.classList.remove("is-pulsing");
    void pulse.offsetWidth;
    pulse.classList.add("is-pulsing");
  }

  function collectCash(bill) {
    if (bill.dataset.done === "1") return;
    bill.dataset.done = "1";

    const base = Number(bill.dataset.value) || 50;
    const gain = base * (profile.owned.indexOf("double") !== -1 ? 2 : 1);
    const box = bill.getBoundingClientRect();

    bill.classList.remove("is-magnet");
    bill.classList.add("is-collected");
    window.setTimeout(() => bill.remove(), 420);

    floatAmount("+$" + fmt(gain), box.left + box.width / 2, box.top + box.height / 2);
    pulseClock();
    sound.cash(base >= 500);
    addMoney(gain);
    toast("+$" + fmt(gain) + " · GTA$ připsány na účet");
  }

  function activeBills() {
    return cashLayer.querySelectorAll(".cash:not(.is-collected):not(.is-leaving)").length;
  }

  function spawnCash(options) {
    const settings = options || {};
    if (activeBills() >= MAX_BILLS) return null;

    const value = settings.value || DENOMINATIONS[Math.floor(Math.random() * DENOMINATIONS.length)];
    const x = settings.x !== undefined ? settings.x : 7 + Math.random() * 86;
    const y = settings.y !== undefined ? settings.y : 21 + Math.random() * 60;

    const bill = document.createElement("button");
    bill.type = "button";
    bill.className = "cash cash--" + value;
    bill.dataset.value = String(value);
    bill.style.setProperty("--x", x.toFixed(2) + "%");
    bill.style.setProperty("--y", y.toFixed(2) + "%");
    bill.style.setProperty("--r", (Math.random() * 44 - 22).toFixed(1) + "deg");
    bill.style.zIndex = String(10 + Math.floor(Math.random() * 10));
    bill.setAttribute("aria-label", "Sebrat " + fmt(value) + " GTA dolarů");
    bill.textContent = "$" + fmt(value);
    cashLayer.append(bill);

    bill.addEventListener("click", () => collectCash(bill));

    window.setTimeout(() => {
      if (bill.dataset.done === "1" || !bill.isConnected) return;
      bill.classList.add("is-leaving");
      window.setTimeout(() => bill.remove(), 460);
    }, settings.life || 9000);

    if (profile.owned.indexOf("magnet") !== -1) {
      bill.classList.add("is-magnet");
      window.setTimeout(() => collectCash(bill), 1400);
    }

    return bill;
  }

  function dropMoney() {
    sound.drop();
    for (let i = 0; i < 4; i += 1) {
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

  function updateDropButton() {
    const left = Math.ceil((dropReadyAt - Date.now()) / 1000);
    dropBtn.disabled = left > 0;
    if (left > 0) {
      dropBtn.textContent = "Peníze za " + left + " s";
    } else {
      dropBtn.innerHTML = 'Shodit peníze <small>mezerník</small>';
    }
  }

  function triggerDrop() {
    if (Date.now() < dropReadyAt) return;
    dropReadyAt = Date.now() + DROP_COOLDOWN_MS;
    updateDropButton();
    dropMoney();
  }

  function scheduleSpawn() {
    window.setTimeout(() => {
      if (!shop.classList.contains("is-open")) spawnCash();
      scheduleSpawn();
    }, 2600 + Math.random() * 3000);
  }

  /* --- Obchod ------------------------------------------------------------ */

  let currentTab = "dial";

  function buttonState(item) {
    if (item.slot === "extra") {
      return isOwned(item) ? { label: "Aktivní", cls: "is-equipped", tag: "AKTIVNÍ" } : { label: "$" + fmt(item.price), cls: "", tag: "" };
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

    CATALOG[currentTab].forEach((item) => {
      const state = buttonState(item);
      const card = document.createElement("article");
      card.className = "item" + (isEquipped(item) && item.slot !== "extra" ? " is-equipped" : "");
      card.innerHTML =
        '<div class="item__preview" style="--swatch: ' + item.swatch + '"></div>' +
        '<div class="item__name">' + item.name + '</div>' +
        '<div class="item__desc">' + item.desc + '</div>' +
        '<button class="item__buy ' + state.cls + '" type="button" data-id="' + item.id + '">' + state.label + '</button>' +
        (state.tag ? '<span class="item__tag">' + state.tag + '</span>' : '');
      shopItems.append(card);
    });
  }

  function handleItemClick(id) {
    const item = ALL_ITEMS.find((entry) => entry.id === id);
    if (!item) return;

    if (!isOwned(item)) {
      if (profile.money < item.price) {
        sound.deny();
        toast("Máš málo GTA$ – sbírej další peníze.");
        return;
      }
      profile.money -= item.price;
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

    Object.keys(profile.equipped).forEach((slot) => {
      root.dataset[slot] = profile.equipped[slot];
    });
    saveProfile();
    renderMoney(false);
    renderShop();
  }

  function openShop() {
    if (shop.classList.contains("is-open")) return;
    shop.classList.add("is-open");
    shop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    renderShop();
    shopClose.focus();
  }

  function closeShop() {
    if (!shop.classList.contains("is-open")) return;
    shop.classList.remove("is-open");
    shop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.getElementById("shop-btn").focus();
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
  document.getElementById("shop-btn").addEventListener("click", openShop);
  document.getElementById("btn-shop").addEventListener("click", openShop);

  /* --- Čas serveru ------------------------------------------------------- */

  const pad = (value) => String(value).padStart(2, "0");

  let base = { hour: initial.hour, minute: initial.minute, second: initial.second };
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
    base = { hour: payload.hour, minute: payload.minute, second: payload.second };
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
    const elapsed = (performance.now() - t0) / 1000;
    const total = base.hour * 3600 + base.minute * 60 + base.second + elapsed;

    hands.second.style.setProperty("--angle", ((total % 60) * 6).toFixed(3) + "deg");
    hands.minute.style.setProperty("--angle", (((total / 60) % 60) * 6).toFixed(3) + "deg");
    hands.hour.style.setProperty("--angle", (((total / 3600) % 12) * 30).toFixed(3) + "deg");

    const day = total % 86400;
    const text =
      pad(Math.floor(day / 3600)) + ":" +
      pad(Math.floor(day / 60) % 60) + ":" +
      pad(Math.floor(day) % 60);

    if (text !== lastTimeText) {
      lastTimeText = text;
      timeEl.textContent = text;
      applyDaypart(Math.floor(day / 3600));
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
  }

  dropBtn.addEventListener("click", triggerDrop);
  muteBtn.addEventListener("click", toggleMute);

  window.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target;
    const tag = target && target.tagName ? target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || (target && target.isContentEditable)) return;

    if (event.key === "Escape") {
      closeShop();
      return;
    }
    if (shop.classList.contains("is-open")) return;

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
    }
  });

  /* --- Start ------------------------------------------------------------- */

  Object.keys(profile.equipped).forEach((slot) => {
    root.dataset[slot] = profile.equipped[slot];
  });
  paintMute();
  renderMoney(false);
  renderShop();
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
  window.setTimeout(() => toast("Vítej ve Vice City. Sbírej GTA$ a vylepši hodiny!"), 600);
})();
