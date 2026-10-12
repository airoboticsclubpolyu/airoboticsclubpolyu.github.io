# PolyU AI & Robotics Club Website

Official static website draft for the PolyU AI & Robotics Club. The site is built for GitHub Pages with plain HTML, CSS, JavaScript, Markdown event files, and local image assets.

## Overview

This website introduces the club, its technical areas, projects, events, team structure, and joining information.

Main pages:

- `index.html` - homepage with hero, key numbers, club focus areas, featured projects, club life photos, popular questions, and recruitment call-to-action.
- `about.html` - vision, technical areas, club structure, and a short summary of the three membership levels.
- `projects.html` - project tracks with category filtering, plus competition tracks, preparation workflow, and roles.
- `events.html` - upcoming and past events generated from Markdown files in `_event/`, plus the season-by-season archive.
- `team.html` - faculty leadership, supervisors, mentors, student committee, technical groups, alumni, and supporting labs.
- `qa.html` - questions and answers grouped by joining, time and levels, projects and competitions, and events and contact.
- `join.html` - joining steps, full membership and review rules, and contact information.
- `competition.html` and `past-seasons.html` - redirects to `projects.html#competitions` and `events.html#past-seasons` so old links keep working.

Each piece of content lives on one page only. The full membership rules are on `join.html`; other pages link there instead of repeating them. Add new questions to `qa.html` rather than to individual pages.

## Folder Structure

```text
.
├── index.html
├── about.html
├── projects.html
├── competition.html
├── events.html
├── past-seasons.html
├── team.html
├── join.html
├── _event/
│   ├── _template.md
│   └── *.md
├── assets/
│   ├── css/styles.css
│   └── js/
│       ├── site.js
│       └── events.js
├── images/
│   ├── robotic_logo.svg
│   ├── robotic_logo.jpg
│   └── club/
└── _config.yml
```

## Editing Pages

Each page is a standalone HTML file. Shared styling lives in `assets/css/styles.css`, and shared interaction behavior lives in `assets/js/site.js`.

Common edits:

- Update navigation in each HTML page if a new page is added.
- Update footer links in each HTML page if contact details change.
- Update global colors, spacing, cards, buttons, and responsive layouts in `assets/css/styles.css`.
- Update mobile navigation, filters, and FAQ behavior in `assets/js/site.js`.

## Events Workflow

Events are stored as Markdown files in `_event/`. The Events page loads the files listed in `assets/js/events.js`, reads each front matter block, generates event cards, and opens full details in a dialog.

To add a new event:

1. Copy `_event/_template.md`.
2. Rename it, for example `_event/robotics-demo-day.md`.
3. Fill in the front matter:

```yaml
---
title: Robotics Demo Day
date: TBC
location: PolyU campus
image: images/club/promotion-table.jpg
tags: Events, Recruitment
category: upcoming recruitment
order: 50
---
```

4. Write the brief description immediately after the front matter. This first paragraph appears on the event card.
5. Add the detailed body below it.
6. Add the new file path to `EVENT_FILES` in `assets/js/events.js`.

Useful event categories:

- `upcoming`
- `training`
- `competition`
- `recruitment`
- `past`

The `category` field can contain multiple filter words, for example:

```yaml
category: upcoming training
```

## Images

Main image folders:

- `images/robotic_logo.svg` - primary logo for header, footer, and favicon.
- `images/robotic_logo.jpg` - social preview image.
- `images/club/` - optimized club photos used across the site.

Recommended image practice:

- Use JPG for photos.
- Keep large website images around 1200-1600 px wide.
- Use descriptive filenames.
- Always add meaningful `alt` text in HTML.
- Prefer real club photos over generic graphics.

## Running Locally

Because the site loads event Markdown with `fetch()`, open it through a local server rather than directly from the filesystem when testing Events.

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000/
```

Directly opening `index.html` works for most pages, but `events.html` needs a server for Markdown loading.

## GitHub Pages Notes

This project is designed for GitHub Pages.

Important files:

- `.nojekyll` keeps GitHub Pages from hiding folders that start with `_`, including `_event/`.
- `_config.yml` includes `_event/` for compatibility.

The `.github/workflows/deploy-pages.yml` workflow publishes the repository root when changes are pushed to `main`. It can also be started manually from the Actions tab.

In the repository's **Settings > Pages > Build and deployment** section, set **Source** to **GitHub Actions**. After the workflow succeeds, GitHub Pages serves the uploaded static site artifact.

## Maintenance Checklist

Before publishing:

- Check all navigation links.
- Check the Events page through a local server.
- Confirm images load and are not too large.
- Review mobile layout.
- Confirm contact emails are current.
- Confirm event Markdown files are listed in `assets/js/events.js`.
- Search for unused or old image references before deleting assets.
