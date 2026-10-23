/* ==========================================================================
   Askapade — prototype behaviours
   Small, dependency-free helpers that bring the static frames to life.
   Each behaviour is opt-in via a data-attribute so the coding agent can see
   exactly which element owns which interaction.
   ========================================================================== */

(() => {
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- Status bar  [data-sb] --------------------------------------- */
  const SB = `
    <span>9:41</span>
    <span class="icons">
      <svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
      <svg viewBox="0 0 16 12"><path d="M8 2.3c2.2 0 4.2.9 5.7 2.3l1.1-1.1A9.6 9.6 0 0 0 8 .7 9.6 9.6 0 0 0 1.2 3.5l1.1 1.1A8 8 0 0 1 8 2.3Zm0 3.2c1.3 0 2.5.5 3.4 1.3l1.1-1.1A6.4 6.4 0 0 0 8 3.9a6.4 6.4 0 0 0-4.5 1.8l1.1 1.1c.9-.8 2.1-1.3 3.4-1.3Zm0 3.2c-.5 0-1 .2-1.3.5L8 10.5l1.3-1.3c-.3-.3-.8-.5-1.3-.5Z"/></svg>
      <svg viewBox="0 0 27 12"><rect x=".5" y=".5" width="22" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="17" height="8" rx="2"/><rect x="24" y="4" width="2" height="4" rx="1" opacity=".4"/></svg>
    </span>`;
  $$("[data-sb]").forEach((el) => (el.innerHTML = SB));

  /* ---------- Bunny ears mark  [data-ears] --------------------------------
     Inline (not <use>) so each ear can be animated independently.
     Variants via class: .wiggle (idle/loading), .hop (working), .perk (success). */
  const EAR_L = "M 164.6 176.1 L 170.3 176.8 C 179 176.1 197.3 189.4 225.1 216.6 C 231.5 222.9 238.3 230.9 245.5 240.4 C 261.7 262.7 270.9 276.1 273.2 280.9 C 297.7 316.6 318.5 375 335.5 456.3 C 350.8 533.6 359 625.9 360.2 733.1 L 291.3 761 C 287.3 758.7 282.4 754 276.5 747 C 260.3 725.5 249.4 709.8 243.9 699.9 C 226.6 671.9 205.6 634.6 180.9 588 C 148.7 525.1 128.4 471.7 120.2 427.9 L 117.4 411.2 C 115.7 400 114.5 388.5 113.7 376.8 C 113 365.1 112.7 353.1 112.8 340.9 C 112.9 316.7 115.4 291.2 120.1 264.5 L 123.8 246.6 C 126.4 235.3 129.1 225.4 132 216.8 C 135 208.2 138.1 200.9 141.4 195 C 147.6 182.9 155.3 176.6 164.6 176.1 Z";
  const EAR_R = "M 645.2 176.1 L 639.6 176.8 C 630.8 176.1 612.5 189.4 584.8 216.6 C 578.3 222.9 571.5 230.9 564.3 240.4 C 548.1 262.7 538.9 276.1 536.6 280.9 C 512.1 316.6 491.3 375 474.3 456.3 C 459 533.6 450.8 625.9 449.6 733.1 L 518.5 761 C 522.5 758.7 527.4 754 533.3 747 C 549.5 725.5 560.4 709.8 565.9 699.9 C 583.2 671.9 604.2 634.6 628.9 588 C 661.1 525.1 681.4 471.7 689.6 427.9 L 692.4 411.2 C 694.1 400 695.3 388.5 696.1 376.8 C 696.9 365.1 697.1 353.1 697 340.9 C 696.9 316.7 694.4 291.2 689.7 264.5 L 686 246.6 C 683.4 235.3 680.7 225.4 677.8 216.8 C 674.9 208.2 671.7 200.9 668.4 195 C 662.2 182.9 654.5 176.6 645.2 176.1 Z";
  const EARS = `<svg viewBox="100 165 610 610" fill="currentColor" aria-hidden="true"><path class="ear-l" d="${EAR_L}"/><path class="ear-r" d="${EAR_R}"/></svg>`;
  $$("[data-ears]").forEach((el) => (el.innerHTML = EARS));

  /* Verified tick on avatars  <span class="verified"></span> */
  $$(".verified:empty").forEach((el) => (el.innerHTML = '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>'));

  /* ---------- Tab bar  [data-tabbar="map|activity|wallet|you"] ------------ */
  const TABS = [
    ["map", "Explore", '<path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z"/><path d="M9 4v13M15 6.5v13"/>'],
    ["activity", "Activity", '<path d="M4 5h16v11H8l-4 4V5Z"/><path d="M8 10h8M8 13h5"/>'],
    ["ask"],
    ["wallet", "Wallet", '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16 14.5h2"/><path d="M6 6V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/>'],
    ["you", "You", '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20c1.4-3.5 4.2-5 7.5-5s6.1 1.5 7.5 5"/>'],
  ];
  $$("[data-tabbar]").forEach((el) => {
    const on = el.dataset.tabbar;
    const badge = el.dataset.badge;
    el.innerHTML = TABS.map(([id, label, path]) =>
      id === "ask"
        ? `<div class="ask-btn" title="Post an ask"><svg viewBox="0 0 24 24" fill="none" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></div>`
        : `<div class="tab ${id === on ? "on" : ""}"><svg viewBox="0 0 24 24">${path}</svg>${label}${
            badge && id === "activity" ? `<span class="badge">${badge}</span>` : ""
          }</div>`
    ).join("");
  });

  /* ---------- Map  [data-map="seed"] ---------------------------------------
     Procedural, Apple-Maps-ish light basemap. In the real app this is
     MapKit / Mapbox with a custom style using the --map-* tokens.          */
  const rng = (seed) => () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const css = getComputedStyle(document.documentElement);
  const tok = (n) => css.getPropertyValue(n).trim();

  function buildMap(seed, W = 470, H = 924) {
    const r = rng(seed);
    const ang = -12 + r() * 24;
    let minor = "";
    for (let x = -300; x < W + 300; x += 38 + r() * 34) minor += `<line x1="${x}" y1="-300" x2="${x}" y2="${H + 300}" stroke-width="${r() > 0.8 ? 7 : 4.5}"/>`;
    for (let y = -300; y < H + 300; y += 42 + r() * 40) minor += `<line x1="-300" y1="${y}" x2="${W + 300}" y2="${y}" stroke-width="${r() > 0.8 ? 7 : 4.5}"/>`;

    let parks = "";
    for (let i = 0; i < 3; i++) {
      const px = r() * W, py = r() * H, pw = 70 + r() * 120, ph = 60 + r() * 110;
      parks += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="${18 + r() * 20}" transform="rotate(${ang} ${px} ${py})"/>`;
    }
    const rx = r() * W;
    const river = `<path d="M${rx - 200} -40 C ${rx + 60} ${H * 0.25}, ${rx - 120} ${H * 0.55}, ${rx + 160} ${H + 40}" />`;

    let major = "";
    for (let i = 0; i < 2; i++) {
      const y0 = r() * H, y1 = r() * H;
      major += `<path d="M -40 ${y0} C ${W * 0.3} ${y0 + (r() - 0.5) * 200}, ${W * 0.7} ${y1 + (r() - 0.5) * 200}, ${W + 40} ${y1}"/>`;
    }
    const x0 = W * (0.2 + r() * 0.6);
    major += `<path d="M ${x0} -40 C ${x0 + 80} ${H * 0.35}, ${x0 - 90} ${H * 0.6}, ${x0 + 30} ${H + 40}"/>`;

    const names = ["HARROW", "WEALDSTONE", "GREENHILL", "HEADSTONE", "ROXETH"];
    const lbl = [0, 1].map((i) => {
      const n = names[Math.floor(r() * names.length)];
      return `<text x="${60 + r() * (W - 200)}" y="${120 + i * 380 + r() * 200}">${n}</text>`;
    }).join("");

    return `<svg class="map-tiles" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="${W}" height="${H}" fill="${tok("--map-block")}"/>
      <g stroke="${tok("--map-road")}" transform="rotate(${ang} ${W / 2} ${H / 2})">${minor}</g>
      <g fill="${tok("--map-park")}">${parks}</g>
      <g fill="none" stroke="${tok("--map-water")}" stroke-width="34" stroke-linecap="round">${river}</g>
      <g fill="none" stroke-linecap="round"><g stroke="#E8DDB5" stroke-width="15">${major}</g><g stroke="${tok("--map-road-major")}" stroke-width="12">${major}</g></g>
      <g font-family="Figtree" font-weight="800" font-size="11" letter-spacing="2.5" fill="#9AA59B">${lbl}</g>
    </svg>`;
  }
  $$("[data-map]").forEach((el) => el.insertAdjacentHTML("afterbegin", buildMap(+el.dataset.map || 1)));

  /* ---------- Countdown  [data-countdown="seconds"][data-format] ---------- */
  const fmt = (s, f) => {
    s = Math.max(0, s);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
    const p = (n) => String(n).padStart(2, "0");
    if (f === "short") return h ? `${h}h ${p(m)}m` : `${m}m ${p(sec)}s`;
    if (f === "hms") return `${h}:${p(m)}:${p(sec)}`;
    return `${p(m + h * 60)}:${p(sec)}`;
  };
  const timers = $$("[data-countdown]").map((el) => ({ el, s: +el.dataset.countdown, f: el.dataset.format }));
  const tick = () => timers.forEach((t) => { t.s -= 1; t.el.textContent = fmt(t.s, t.f); });
  timers.forEach((t) => (t.el.textContent = fmt(t.s, t.f)));
  setInterval(tick, 1000);

  /* ---------- Rotating copy  [data-rotate='["a","b"]'] -------------------- */
  $$("[data-rotate]").forEach((el) => {
    const lines = JSON.parse(el.dataset.rotate);
    let i = 0;
    setInterval(() => {
      i = (i + 1) % lines.length;
      el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-8px)" }], { duration: 160, easing: "ease-in", fill: "forwards" })
        .onfinish = () => {
          el.textContent = lines[i];
          el.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
        };
    }, +el.dataset.interval || 2200);
  });

  /* ---------- Count-up  [data-countup="248.50"][data-prefix="£"] ---------- */
  const countUp = (el) => {
    const end = +el.dataset.countup, dec = (el.dataset.countup.split(".")[1] || "").length, pre = el.dataset.prefix || "";
    const t0 = performance.now(), D = +el.dataset.duration || 1100;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 4);
      el.textContent = pre + (end * e).toLocaleString("en-GB", { minimumFractionDigits: dec, maximumFractionDigits: dec });
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- Confetti  <canvas data-confetti> ---------------------------- */
  const COLORS = ["#008000", "#C8F560", "#FFB800", "#FFFFFF", "#0B130C", "#7BD389"];
  function confetti(cv) {
    const ctx = cv.getContext("2d"), dpr = 2;
    cv.width = cv.offsetWidth * dpr; cv.height = cv.offsetHeight * dpr;
    const W = cv.width, H = cv.height;
    const ox = (+cv.dataset.x || 0.5) * W, oy = (+cv.dataset.y || 0.35) * H;
    const parts = Array.from({ length: 120 }, () => {
      const a = Math.random() * Math.PI * 2, v = (6 + Math.random() * 14) * dpr;
      return { x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 8 * dpr, w: (5 + Math.random() * 6) * dpr, h: (8 + Math.random() * 8) * dpr,
        r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: COLORS[(Math.random() * COLORS.length) | 0], life: 1 };
    });
    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = 0;
      for (const p of parts) {
        p.vy += 0.55 * dpr; p.vx *= 0.985; p.vy *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= 0.006;
        if (p.life <= 0 || p.y > H + 40) continue;
        alive++;
        ctx.save(); ctx.globalAlpha = Math.min(1, p.life * 2); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.scale(1, Math.abs(Math.cos(p.r * 2)) + 0.2); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      }
      if (alive) requestAnimationFrame(frame);
    };
    frame();
  }

  /* Replay entrance animations whenever a frame scrolls into view, so every
     screen can be reviewed "live" without a click-through prototype. */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const ph = en.target;
    $$("[data-countup]", ph).forEach(countUp);
    $$("canvas[data-confetti]", ph).forEach((c) => setTimeout(() => confetti(c), +c.dataset.delay || 250));
  }), { threshold: 0.45 });
  $$(".phone").forEach((p) => io.observe(p));

  /* Click a frame label to replay that screen's animations. */
  $$(".frame-label").forEach((lbl) => {
    lbl.style.cursor = "pointer";
    lbl.title = "Click to replay animations";
    lbl.addEventListener("click", () => {
      const ph = lbl.parentElement.querySelector(".phone");
      $$("*", ph).forEach((n) => n.getAnimations?.().forEach((a) => { if (a.effect?.getTiming().iterations !== Infinity) { a.cancel(); a.play(); } }));
      $$("[data-countup]", ph).forEach(countUp);
      $$("canvas[data-confetti]", ph).forEach((c) => confetti(c));
    });
  });

  /* ---------- Boost radius  [data-boost] ----------------------------------
     Steps are product values — BTS decides actual reach + price per market. */
  const BOOST = [
    { km: 1, people: 8, eta: "~6 min", fee: 0 },
    { km: 2, people: 19, eta: "~4 min", fee: 1 },
    { km: 3, people: 31, eta: "~3 min", fee: 1.5 },
    { km: 5, people: 46, eta: "~2 min", fee: 2 },
  ];
  $$("[data-boost]").forEach((root) => {
    const ph = root.closest(".phone");
    const range = root.querySelector(".range"), thumb = range.querySelector(".thumb"), fill = range.querySelector(".fill");
    const ticks = $$(".ticks span", range);
    const ring = ph.querySelector("[data-boost-ring]");
    const out = (k) => root.querySelector(`[data-out="${k}"]`);
    const set = (i, animate = true) => {
      const b = BOOST[i], pct = (i / (BOOST.length - 1)) * 100;
      thumb.style.left = fill.style.width = pct + "%";
      ticks.forEach((t, j) => t.classList.toggle("on", j === i));
      out("km").textContent = b.km + " km";
      out("people").textContent = "~" + b.people;
      out("eta").textContent = b.eta;
      out("fee").textContent = b.fee ? "£" + b.fee.toFixed(2) : "Free";
      out("cta").textContent = b.fee ? `Boost to ${b.km} km · £${b.fee.toFixed(2)}` : "Keep at 1 km";
      if (ring) { const d = 120 + b.km * 52; ring.style.width = ring.style.height = d + "px"; ring.querySelector(".tag").textContent = b.km + " km"; }
      if (animate && navigator.vibrate) navigator.vibrate(8);
    };
    const fromX = (x) => {
      const r = range.getBoundingClientRect();
      return Math.round(Math.min(1, Math.max(0, (x - r.left) / r.width)) * (BOOST.length - 1));
    };
    let drag = false;
    thumb.addEventListener("pointerdown", (e) => { drag = true; thumb.setPointerCapture(e.pointerId); });
    thumb.addEventListener("pointermove", (e) => drag && set(fromX(e.clientX)));
    thumb.addEventListener("pointerup", () => (drag = false));
    ticks.forEach((t, i) => t.addEventListener("click", () => set(i)));
    set(+root.dataset.boost || 3, false);
  });

  /* ---------- Slide to confirm  [data-slide] ------------------------------ */
  $$("[data-slide]").forEach((el) => {
    const knob = el.querySelector(".knob"), fill = el.querySelector(".fill"), label = el.querySelector(".label");
    const max = () => el.offsetWidth - knob.offsetWidth - 12;
    let x0 = null, dx = 0;
    knob.addEventListener("pointerdown", (e) => { x0 = e.clientX; knob.setPointerCapture(e.pointerId); knob.style.transition = "none"; });
    knob.addEventListener("pointermove", (e) => {
      if (x0 === null) return;
      dx = Math.min(max(), Math.max(0, e.clientX - x0));
      knob.style.transform = `translateX(${dx}px)`; fill.style.width = dx + 40 + "px";
    });
    knob.addEventListener("pointerup", () => {
      knob.style.transition = "transform .35s cubic-bezier(.34,1.56,.64,1)";
      if (dx > max() * 0.85) {
        knob.style.transform = `translateX(${max()}px)`; el.classList.add("done"); label.textContent = el.dataset.slide;
        setTimeout(() => { el.classList.remove("done"); knob.style.transform = ""; fill.style.width = 0; label.textContent = el.dataset.label; }, 1800);
      } else { knob.style.transform = ""; fill.style.width = 0; }
      x0 = null; dx = 0;
    });
    el.dataset.label = label.textContent;
  });

  /* ---------- Holographic ID card tilt  [data-tilt] ----------------------- */
  $$("[data-tilt]").forEach((card) => {
    const ph = card.closest(".phone");
    ph.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--rx", (-y * 14).toFixed(2) + "deg");
      card.style.setProperty("--ry", (x * 18).toFixed(2) + "deg");
      card.style.setProperty("--mx", ((x + 0.5) * 100).toFixed(1) + "%");
      card.style.setProperty("--my", ((y + 0.5) * 100).toFixed(1) + "%");
    });
    ph.addEventListener("pointerleave", () => { ["--rx", "--ry"].forEach((p) => card.style.setProperty(p, "0deg")); });
  });

  /* ---------- Price stepper  [data-stepper] ------------------------------- */
  $$("[data-stepper]").forEach((el) => {
    const v = el.querySelector("[data-value]");
    let n = +v.dataset.value;
    const render = (dir) => {
      v.textContent = "£" + n;
      v.animate([{ transform: `translateY(${dir * 10}px)`, opacity: 0.2 }, { transform: "none", opacity: 1 }], { duration: 220, easing: "cubic-bezier(.34,1.56,.64,1)" });
      const cta = el.closest(".phone").querySelector("[data-post-cta]");
      if (cta) cta.textContent = `Post ask · £${n}`;
    };
    el.querySelector("[data-dec]").addEventListener("click", () => { if (n > 3) { n--; render(-1); } });
    el.querySelector("[data-inc]").addEventListener("click", () => { n++; render(1); });
  });

  /* ---------- Chip groups  [data-chips] (single select) ------------------- */
  $$("[data-chips]").forEach((g) => $$(".chip", g).forEach((c) => c.addEventListener("click", () => {
    $$(".chip", g).forEach((x) => x.classList.remove("on")); c.classList.add("on");
  })));

  /* ---------- Star rating  [data-stars] ----------------------------------- */
  $$("[data-stars]").forEach((g) => {
    const stars = $$("button", g);
    stars.forEach((s, i) => s.addEventListener("click", () => stars.forEach((x, j) => {
      x.classList.toggle("on", j <= i);
      if (j <= i) x.animate([{ transform: "scale(.6) rotate(-20deg)" }, { transform: "scale(1.25)" }, { transform: "none" }], { duration: 420, delay: j * 50, easing: "cubic-bezier(.34,1.56,.64,1)" });
    })));
  });

  /* ---------- Auto-detected ask icon  [data-icon-cycle] -------------------
     Mirrors BTS: as the user types, the classifier picks a 3D icon. */
  $$("[data-icon-cycle]").forEach((img) => {
    const list = JSON.parse(img.dataset.iconCycle);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      if (i === list.length - 1) clearInterval(timer); // settle on the final guess
      img.animate([{ transform: "scale(1)" }, { transform: "scale(.5) rotate(-15deg)", opacity: 0 }], { duration: 140, fill: "forwards" }).onfinish = () => {
        img.src = `assets/icons/${list[i][0]}.png`;
        const lbl = img.closest(".phone").querySelector("[data-icon-label]");
        if (lbl) lbl.textContent = list[i][1];
        img.animate([{ transform: "scale(.5) rotate(15deg)", opacity: 0 }, { transform: "scale(1.12)" }, { transform: "none", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "forwards" });
      };
    }, 1400);
  });
})();
