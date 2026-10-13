# PolyU FENG AI & Robotics Club Website

Static website of the PolyU FENG AI & Robotics Club, published with GitHub Pages. Plain HTML, one stylesheet and one script; no build step. The layout follows the [TAS Lab website](https://polyu-taslab.github.io/).

## Pages

- `index.html` - hero with the club logo and four robot platforms, key numbers, vision, project directions, latest news, competition videos, supporting parties and sponsors, links to leading robotics clubs worldwide and the visitor map.
- `about.html` - vision, mission, international and industry exchange, leadership and supervision, technical group cards (each opens its page in `groups/`), the shared workspace, member tiers and club rules.
- `groups/*.html` - one page per technical group: what it does, tasks, key equations, expectations by tier and photos.
- `projects.html` - cover photo, cards for the two confirmed 2026-27 projects and the three robot platforms (each opens its page in `projects/`), the longer-term RoboCup plan and a timeline of how projects run.
- `projects/*.html` - one page per project or platform. `robocon-2027.html` includes the 2027 game, Robocon history and PolyU's plan.
- `news.html` - one row per news item; each row opens its own page in `news/`. The photo archive of earlier seasons is `news/archive.html`.
- `team.html` - Director and Chief Supervisor, staff-level supervisors, PhD-level mentor team, technical group cards with mentors and student representatives, and supporting parties and sponsors.
- `qa.html` - questions and answers.
- `join.html` - September recruitment, joining steps, commitment and club rules, member tiers, promotion rules and reviews.
- `donate.html` - why to donate, what donations support, and industry partnership.
- `events.html`, `past-seasons.html` and `competition.html` - redirects so old links keep working.

Photos of former members appear only in news items.

## Folders

```text
assets/css/styles.css      shared styles
assets/js/site.js          navigation, Q&A accordion, video embeds, visitor map
assets/visitors/           world map data for the visitor map
news/                      one page per news item
groups/                    one page per technical group (equations use KaTeX from a CDN)
projects/                  one page per project or robot platform
images/logo/               club logo (1024 master, 512, 192, favicon, social image) and earlier design options
images/clubs/              screenshots of leading robotics club websites
images/platforms/          home page platform tiles
images/projects/           project cover and cards
images/groups/             technical group illustrations
images/news/               photos for news items
images/past-seasons/       2025-26 season photos (news items)
images/club/               earlier-season photos (photo archive)
images/people/             320 x 320 portraits for the team page
images/partners/           supporting-party logos and white banner logos
```

## Common edits

- **News item:** copy a page in `news/`, change the text and photos, and update the "Newer"/"Older" links of its neighbours. Add a matching `<li>` row at the top of the `news-rows` list in `news.html`, and replace the oldest row in the home page "Latest News" list.
- **Person:** add a 320 x 320 JPG to `images/people/` and copy an existing `<article class="person">` card in `team.html`. Mentors carry a group tag naming their technical group.
- **Student representatives:** update the matching card under "Technical Groups and Student Representatives" in `team.html` and the "Student representatives" row on the group's page in `groups/`.
- **Video:** copy a `<figure class="video">` block in `index.html` and change `data-youtube` to the YouTube video ID. The video loads only when clicked.
- **Robotics club link:** add a 640 x 360 screenshot to `images/clubs/` and copy a `<li>` in the `club-cards` list in `index.html`.
- **Technical group text:** the short card text is in `about.html` and `team.html`; the full description is on the group's page in `groups/`.
- **Page banner photo:** set `style="background-image: url('...')"` on the `page-banner` section, with the path relative to the page.
- **Supporting party:** add a white-background logo to `images/partners/` and an `<li>` to the `logos` lists in `index.html` and `team.html`.
- **Navigation or footer:** the header and footer are repeated in every page, including `news/`, `groups/` and `projects/`; update all pages together.

## Contact

The club's contact address is airoboticsclubpolyu@gmail.com, with Prof. Weisong Wen (welson.wen@polyu.edu.hk) in copy.

## Visitor map

The map on the home page uses [GoatCounter](https://www.goatcounter.com/), the same as the TAS Lab site. To turn it on, create a GoatCounter site, create an API key with only "Read statistics" permission, and fill in `goatcounter` and `apiKey` at the top of `assets/js/site.js`. Until then the map shows an empty world map.

## Running locally

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>.

## Deployment

`.github/workflows/deploy-pages.yml` publishes the repository root when changes are pushed to `main`. In **Settings > Pages**, the source must be **GitHub Actions**.
