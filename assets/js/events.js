const EVENT_FILES = [
  "_event/recruitment-orientation.md",
  "_event/robot-platform-demo.md",
  "_event/robotics-starter-workshop.md",
  "_event/ai-vision-slam-tutorial.md",
  "_event/competition-team-planning.md",
  "_event/club-recruitment-campaign.md",
  "_event/peer-learning-sessions.md",
];

const eventGrid = document.querySelector("[data-event-grid]");
const eventStatus = document.querySelector("[data-event-status]");
const eventDialog = document.querySelector("[data-event-dialog]");
const eventDialogContent = document.querySelector("[data-event-dialog-content]");
const eventDialogClose = document.querySelector("[data-event-dialog-close]");
const eventFilterButtons = document.querySelectorAll("[data-event-filter]");

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const parseFrontMatterValue = (value = "") => {
  const trimmed = value.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return trimmed.replace(/^['"]|['"]$/g, "");
};

const parseEventFile = (source, path) => {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) {
    return { meta: { title: path }, body: source.trim(), path };
  }

  const meta = {};
  match[1].split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separator = trimmed.indexOf(":");
    if (separator === -1) return;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1);
    meta[key] = parseFrontMatterValue(value);
  });

  return { meta, body: match[2].trim(), path };
};

const inlineEventText = (text) =>
  escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

const eventContentToHtml = (content) => {
  const lines = content.split(/\r?\n/);
  const html = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("<!--")) {
      closeList();
      return;
    }

    if (trimmed.startsWith("## ")) {
      closeList();
      html.push(`<h3>${inlineEventText(trimmed.slice(3))}</h3>`);
      return;
    }

    if (trimmed.startsWith("### ")) {
      closeList();
      html.push(`<h4>${inlineEventText(trimmed.slice(4))}</h4>`);
      return;
    }

    if (trimmed.startsWith("- ")) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inlineEventText(trimmed.slice(2))}</li>`);
      return;
    }

    closeList();
    html.push(`<p>${inlineEventText(trimmed)}</p>`);
  });

  closeList();
  return html.join("");
};

const getSummary = (body) =>
  body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("<!--") && !block.startsWith("#") && !block.startsWith("- "))
    ?.replace(/\s+/g, " ") || "";

const renderEventCard = (event, index) => {
  const { meta, body } = event;
  const tags = Array.isArray(meta.tags) ? meta.tags : String(meta.tags || "").split(",");
  const tagText = tags.map((tag) => tag.trim()).filter(Boolean);
  const category = meta.category || tagText.join(" ").toLowerCase();
  const image = meta.image || "images/club/promotion-table.jpg";
  const summary = getSummary(body);

  return `
    <article class="event-card" data-filter-item data-category="${escapeHtml(category)}">
      <button class="event-card-button" type="button" data-event-index="${index}" aria-label="Open details for ${escapeHtml(meta.title)}">
        <span class="event-card-cover" style="background-image: url('${escapeHtml(image)}')"></span>
        <span class="event-card-content">
          <span class="event-icon" aria-hidden="true"><svg class="icon"><use href="assets/icons.svg#icon-calendar"></use></svg></span>
          <span class="eyebrow">${escapeHtml(tagText[0] || "Event")}</span>
          <h3>${escapeHtml(meta.title || "Untitled Event")}</h3>
          <p>${inlineEventText(summary)}</p>
          <span class="event-meta">
            <span>Date: ${escapeHtml(meta.date || "TBC")}</span>
            <span>Location: ${escapeHtml(meta.location || "TBC")}</span>
          </span>
        </span>
      </button>
    </article>
  `;
};

const openEventDialog = (event) => {
  const { meta, body } = event;
  const tags = Array.isArray(meta.tags) ? meta.tags.join(", ") : meta.tags || "Event";

  eventDialogContent.innerHTML = `
    <img class="event-detail-image" src="${escapeHtml(meta.image || "images/club/promotion-table.jpg")}" alt="">
    <div class="event-detail-body">
      <span class="eyebrow">${escapeHtml(tags)}</span>
      <h2>${escapeHtml(meta.title || "Untitled Event")}</h2>
      <div class="event-meta">
        <span>Date: ${escapeHtml(meta.date || "TBC")}</span>
        <span>Location: ${escapeHtml(meta.location || "TBC")}</span>
      </div>
      <div class="event-rich-text">${eventContentToHtml(body)}</div>
    </div>
  `;

  eventDialog.showModal();
};

const applyEventFilter = (filter) => {
  document.querySelectorAll("[data-event-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-event-filter") === filter);
  });

  document.querySelectorAll("[data-filter-item]").forEach((item) => {
    const categories = item.getAttribute("data-category") || "";
    const shouldShow = filter === "all" || categories.split(" ").includes(filter);
    item.classList.toggle("is-hidden", !shouldShow);
  });
};

const loadEvents = async () => {
  if (!eventGrid) return;

  try {
    const events = await Promise.all(
      EVENT_FILES.map(async (path) => {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Unable to load ${path}`);
        return parseEventFile(await response.text(), path);
      })
    );

    events.sort((a, b) => Number(a.meta.order || 999) - Number(b.meta.order || 999));
    eventGrid.innerHTML = events.map(renderEventCard).join("");
    eventGrid.querySelectorAll("[data-event-index]").forEach((button) => {
      button.addEventListener("click", () => openEventDialog(events[Number(button.dataset.eventIndex)]));
    });

    if (eventStatus) {
      eventStatus.hidden = true;
    }

    applyEventFilter("all");
  } catch (error) {
    if (eventStatus) {
      eventStatus.hidden = false;
      eventStatus.textContent = "Event details could not be loaded right now. Please contact the club for the latest event information.";
    }
  }
};

eventFilterButtons.forEach((button) => {
  button.addEventListener("click", () => applyEventFilter(button.getAttribute("data-event-filter")));
});

if (eventDialog && eventDialogClose) {
  eventDialogClose.addEventListener("click", () => eventDialog.close());
  eventDialog.addEventListener("click", (event) => {
    if (event.target === eventDialog) {
      eventDialog.close();
    }
  });
}

loadEvents();
