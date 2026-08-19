document.body.classList.add("is-enhanced");

const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (navToggle && primaryNav) {
  const setNavigationOpen = (isOpen, returnFocus = false) => {
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    primaryNav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    if (!isOpen && returnFocus) navToggle.focus();
  };

  navToggle.addEventListener("click", () => {
    setNavigationOpen(navToggle.getAttribute("aria-expanded") !== "true");
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setNavigationOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      setNavigationOpen(false, true);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1040 && navToggle.getAttribute("aria-expanded") === "true") {
      setNavigationOpen(false);
    }
  });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".primary-nav a").forEach((link) => {
  const linkPage = link.getAttribute("href");
  if (linkPage === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
  const summary = dropdown.querySelector("summary");
  const activeLink = dropdown.querySelector(`a[href^="${currentPage}"]`);
  if (summary && activeLink) {
    summary.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll("[data-filter-group]").forEach((group) => {
  const buttons = group.querySelectorAll("[data-filter]");
  const targetSelector = group.getAttribute("data-filter-target");
  const items = targetSelector ? document.querySelectorAll(targetSelector) : [];
  const status = document.querySelector("[data-filter-status]");

  const applyFilter = (filter, updateUrl = true) => {
    let visibleCount = 0;
    buttons.forEach((button) => {
      const isActive = button.getAttribute("data-filter") === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    items.forEach((item) => {
      const categories = item.getAttribute("data-category") || "";
      const shouldShow = filter === "all" || categories.split(" ").includes(filter);
      item.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow) visibleCount += 1;
    });

    if (status) status.textContent = `${visibleCount} project${visibleCount === 1 ? "" : "s"} shown`;
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (filter === "all") url.searchParams.delete("filter");
      else url.searchParams.set("filter", filter);
      window.history.replaceState({}, "", url);
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");
      applyFilter(filter);
    });
  });

  const requestedFilter = new URLSearchParams(window.location.search).get("filter") || "all";
  const initialFilter = Array.from(buttons).some((button) => button.getAttribute("data-filter") === requestedFilter)
    ? requestedFilter
    : "all";
  applyFilter(initialFilter, false);
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = document.getElementById(button.getAttribute("aria-controls"));
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    if (answer) {
      answer.classList.toggle("is-open", !isOpen);
      answer.hidden = isOpen;
    }
  });
});

document.querySelectorAll("[data-panel-select]").forEach((select) => {
  const container = select.closest(".archive-section");
  const panels = container ? container.querySelectorAll("[data-panel]") : [];

  const showPanel = (value) => {
    panels.forEach((panel) => {
      const isActive = panel.getAttribute("data-panel") === value;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
  };

  const activateFromHash = () => {
    const hashValue = window.location.hash.replace("#", "");
    if (hashValue && Array.from(select.options).some((option) => option.value === hashValue)) {
      select.value = hashValue;
      showPanel(hashValue);
    }
  };

  select.addEventListener("change", () => {
    showPanel(select.value);
  });

  activateFromHash();
  window.addEventListener("hashchange", activateFromHash);
});

document.querySelectorAll("[data-panel-group]").forEach((group) => {
  if (group.closest(".archive-section")?.querySelector("[data-panel-select]")) {
    return;
  }

  const panels = group.querySelectorAll("[data-panel]");
  const showPanelFromHash = () => {
    const links = document.querySelectorAll("[data-panel-link]");
    const requestedValue = window.location.hash.replace("#", "");
    const defaultValue = panels[0]?.getAttribute("data-panel");
    const activeValue = Array.from(panels).some((panel) => panel.getAttribute("data-panel") === requestedValue)
      ? requestedValue
      : defaultValue;

    panels.forEach((panel) => {
      const isActive = panel.getAttribute("data-panel") === activeValue;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });

    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeValue}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  showPanelFromHash();
  window.addEventListener("hashchange", showPanelFromHash);
});

document.querySelectorAll("[data-level-pathway]").forEach((pathway) => {
  const cards = pathway.querySelectorAll("[data-level-card]");

  cards.forEach((card) => {
    const activateCard = () => {
      cards.forEach((item) => item.classList.remove("is-active"));
      card.classList.add("is-active");
    };

    card.addEventListener("click", activateCard);
    card.addEventListener("focus", activateCard);
    card.addEventListener("pointerenter", activateCard);
  });
});

const revealItems = document.querySelectorAll(
  ".section, .project-card, .person-card, .card, .tier-card, .rule-panel, .flow-step, .guideline-artifact, .review-step, [data-motion-card]"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-motion-card]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.setProperty("--tilt-x", `${y.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${x.toFixed(2)}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  });
});
