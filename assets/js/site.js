// GoatCounter site code (the "xxx" in https://xxx.goatcounter.com) and a key with
// only "Read statistics" permission. The key is public, so never give it write access.
const VISITOR_MAP = {
  goatcounter: "",
  apiKey: "",
  since: "2026-10-13",
};

const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (navToggle && primaryNav) {
  const setOpen = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    primaryNav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  };

  navToggle.addEventListener("click", () => setOpen(navToggle.getAttribute("aria-expanded") !== "true"));
  primaryNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      navToggle.focus();
    }
  });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".primary-nav a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) link.setAttribute("aria-current", "page");
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = document.getElementById(button.getAttribute("aria-controls"));
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    if (answer) answer.hidden = open;
  });
});

document.querySelectorAll(".video-frame[data-youtube]").forEach((frame) => {
  const id = frame.dataset.youtube;
  frame.style.backgroundImage = `url("https://i.ytimg.com/vi/${id}/hqdefault.jpg")`;
  frame.addEventListener("click", () => {
    if (frame.classList.contains("is-playing")) return;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = frame.getAttribute("aria-label") || "YouTube video";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    frame.classList.add("is-playing");
    frame.appendChild(iframe);
  });
});

if (VISITOR_MAP.goatcounter && window.location.protocol === "https:") {
  const counter = document.createElement("script");
  counter.async = true;
  counter.src = "https://gc.zgo.at/count.js";
  counter.dataset.goatcounter = `https://${VISITOR_MAP.goatcounter}.goatcounter.com/count`;
  document.head.appendChild(counter);
}

(function visitorMap() {
  const root = document.querySelector(".visitors");
  if (!root) return;

  const svg = root.querySelector(".visitors-map svg");
  const list = root.querySelector(".visitors-list");
  const groups = { HK: "HMT", MO: "HMT", TW: "HMT" };
  const names = { HMT: "Hong Kong, Macau & Taiwan", CN: "Mainland China" };
  // the 110m map has no polygons for Hong Kong and Macau
  const mapAlias = { HK: "CN", MO: "CN" };

  const code = (row) => {
    const id = String(row.id || row.code || "").split("-")[0].toUpperCase();
    return /^[A-Z]{2}$/.test(id) ? id : "";
  };

  const tally = (rows, keyFn) => {
    const out = {};
    rows.forEach((row) => {
      const c = code(row);
      if (!c) return;
      const key = keyFn(c);
      out[key] = out[key] || { name: names[key] || row.name || key, count: 0 };
      out[key].count += Number(row.count) || 0;
    });
    return out;
  };

  const loadRows = () => {
    const { goatcounter, apiKey, since } = VISITOR_MAP;
    if (!goatcounter || !apiKey) return Promise.resolve([]);
    const url = `https://${goatcounter}.goatcounter.com/api/v0/stats/locations?limit=200${since ? `&start=${since}T00:00:00Z` : ""}`;
    return fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } })
      .then((r) => (r.ok ? r.json() : { stats: [] }))
      .then((data) => data.stats || [])
      .catch(() => []);
  };

  const renderList = (byCountry) => {
    const ranked = Object.values(byCountry).sort((a, b) => b.count - a.count);
    if (!ranked.length) {
      list.innerHTML = '<li class="visitors-empty">Visitor statistics will appear here soon.</li>';
      return;
    }
    const max = ranked[0].count;
    list.innerHTML = ranked
      .map((r) => {
        const pct = Math.max(2, Math.round((r.count / max) * 100));
        return `<li><span>${r.name}</span><span class="visitors-count">${r.count.toLocaleString("en")}</span>` +
          `<span class="visitors-bar" aria-hidden="true"><span style="width:${pct}%"></span></span></li>`;
      })
      .join("");
  };

  const shade = (count, max) => {
    if (!count) return "#e6e8ec";
    const t = Math.max(0.2, Math.min(1, Math.sqrt(count / max)));
    const lo = [246, 226, 231];
    const hi = [160, 35, 55];
    return `rgb(${lo.map((v, i) => Math.round(v + (hi[i] - v) * t)).join(",")})`;
  };

  const load = (src) => new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

  const renderMap = (byShape) => {
    Promise.all([
      load("https://cdn.jsdelivr.net/npm/d3-array@3"),
      load("https://cdn.jsdelivr.net/npm/topojson-client@3"),
      fetch(root.dataset.base + "countries-110m.json").then((r) => r.json()),
    ])
      .then((res) => load("https://cdn.jsdelivr.net/npm/d3-geo@3").then(() => res[2]))
      .then((topo) => {
        const projection = d3.geoNaturalEarth1().fitSize([960, 480], { type: "Sphere" });
        const path = d3.geoPath(projection);
        const max = Math.max(0, ...Object.values(byShape).map((v) => v.count));
        const ns = "http://www.w3.org/2000/svg";
        const sphere = document.createElementNS(ns, "path");
        sphere.setAttribute("class", "visitors-sphere");
        sphere.setAttribute("d", path({ type: "Sphere" }));
        svg.appendChild(sphere);
        topojson.feature(topo, topo.objects.countries).features.forEach((f) => {
          if (f.properties.name === "Antarctica") return;
          const hit = byShape[f.properties.a2];
          const p = document.createElementNS(ns, "path");
          p.setAttribute("d", path(f));
          p.setAttribute("fill", shade(hit ? hit.count : 0, max));
          const title = document.createElementNS(ns, "title");
          title.textContent = hit ? `${hit.name}: ${hit.count.toLocaleString("en")}` : f.properties.name;
          p.appendChild(title);
          svg.appendChild(p);
        });
      })
      .catch(() => svg.parentNode.classList.add("visitors-map-failed"));
  };

  const start = () => loadRows().then((rows) => {
    renderList(tally(rows, (c) => groups[c] || c));
    renderMap(tally(rows, (c) => mapAlias[c] || c));
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        start();
      }
    }, { rootMargin: "300px" });
    io.observe(root);
  } else {
    start();
  }
})();
