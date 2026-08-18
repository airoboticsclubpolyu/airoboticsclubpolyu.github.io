# PolyU AI & Robotics Club Website

Official static website draft for the PolyU AI & Robotics Club. The site is built for GitHub Pages with plain HTML, CSS, JavaScript, Markdown event files, and local image assets.

## Overview

This website introduces the club, its technical areas, projects, events, team structure, and joining information.

Main pages:

- `index.html` - homepage with hero, club focus areas, featured projects, activities, and recruitment call-to-action.
- `about.html` - mission, technical areas, growth system, and member pathway.
- `projects.html` - project cards with category filtering.
- `competition.html` - competition tracks, preparation workflow, roles, and joining call-to-action.
- `events.html` - event archive and upcoming events generated from Markdown files in `_event/`.
- `past-seasons.html` - season archive with a dropdown for past club seasons and memories.
- `team.html` - team structure, technical groups, and advisor/partner section.
- `join.html` - joining path, FAQ, and contact information.

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

After pushing changes to the GitHub Pages branch, GitHub Pages should serve the site automatically according to the repository settings.

## Maintenance Checklist

Before publishing:

- Check all navigation links.
- Check the Events page through a local server.
- Confirm images load and are not too large.
- Review mobile layout.
- Confirm contact emails are current.
- Confirm event Markdown files are listed in `assets/js/events.js`.
- Search for unused or old image references before deleting assets.
