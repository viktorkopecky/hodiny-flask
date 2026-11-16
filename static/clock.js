(() => {
  "use strict";

  const initial = JSON.parse(document.getElementById("bootstrap").textContent);

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

  const POLL_MS = 15000;

  let base = { hour: initial.hour, minute: initial.minute, second: initial.second };
  let t0 = performance.now();

  const pad = (value) => String(value).padStart(2, "0");

  function sync(payload) {
    base = { hour: payload.hour, minute: payload.minute, second: payload.second };
    t0 = performance.now();
    dateEl.textContent = payload.date;
    tzEl.textContent = payload.timezone;
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
    timeEl.textContent =
      pad(Math.floor(day / 3600)) + ":" +
      pad(Math.floor(day / 60) % 60) + ":" +
      pad(Math.floor(day) % 60);

    requestAnimationFrame(draw);
  }

  async function poll() {
    try {
      const response = await fetch("/api/time", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      sync(await response.json());
      setStatus("ok", "synchronizováno se serverem");
    } catch (error) {
      setStatus("error", "spojení se serverem přerušeno");
    }
  }

  sync(initial);
  requestAnimationFrame(draw);
  poll();
  setInterval(poll, POLL_MS);
})();
