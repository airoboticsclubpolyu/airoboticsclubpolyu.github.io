# PolyU FENG AI & Robotics Club Website

Static website of the PolyU FENG AI & Robotics Club, published with GitHub Pages. Plain HTML, one stylesheet and one script; no build step. The layout follows the [TAS Lab website](https://polyu-taslab.github.io/).

## Pages

- `index.html` - hero with the four robot platforms, key numbers, vision, project directions, latest news, competition videos, supporting parties and the visitor map.
- `about.html` - vision, mission, international and industry exchange, leadership and supervision, technical groups, member tiers and club rules.
- `projects.html` - cover photo, all projects (application and competition) and how projects run.
- `news.html` - one row per news item; each row opens its own page in `news/`. The photo archive of earlier seasons is `news/archive.html`.
- `team.html` - Director and Chief Supervisor, staff-level supervisors, PhD-level mentor team, technical groups with student representatives, and supporting parties.
- `qa.html` - questions and answers.
- `join.html` - September recruitment, joining steps, commitment and club rules, member tiers, promotion rules and reviews.
- `events.html`, `past-seasons.html` and `competition.html` - redirects so old links keep working.

Photos of former members appear only in news items.

## Folders

```text
assets/css/styles.css      shared styles
assets/js/site.js          navigation, Q&A accordion, video embeds, visitor map
assets/visitors/           world map data for the visitor map
news/                      one page per news item
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
- **Student representatives:** list them in the matching group card under "Technical Groups and Student Representatives" in `team.html`.
- **Video:** copy a `<figure class="video">` block in `index.html` and change `data-youtube` to the YouTube video ID. The video loads only when clicked.
- **Supporting party:** add a white-background logo to `images/partners/` and an `<li>` to the `logos` lists in `index.html` and `team.html`.
- **Navigation or footer:** the header and footer are repeated in every page, including `news/`; update all pages together.

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
