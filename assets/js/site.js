document.body.classList.add("is-enhanced");

const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    primaryNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navToggle.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
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

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");
      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      items.forEach((item) => {
        const categories = item.getAttribute("data-category") || "";
        const shouldShow = filter === "all" || categories.split(" ").includes(filter);
        item.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = document.getElementById(button.getAttribute("aria-controls"));
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    if (answer) {
      answer.classList.toggle("is-open", !isOpen);
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
    const hashValue = window.location.hash.replace("#", "");
    if (!hashValue) {
      return;
    }

    let matchedPanel = false;
    panels.forEach((panel) => {
      const isActive = panel.getAttribute("data-panel") === hashValue;
      matchedPanel = matchedPanel || isActive;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });

    if (!matchedPanel) {
      panels.forEach((panel, index) => {
        panel.hidden = index !== 0;
        panel.classList.toggle("is-active", index === 0);
      });
    }
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
