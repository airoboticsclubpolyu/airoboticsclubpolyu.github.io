# PolyU AI & Robotics Club Website

Static website of the PolyU FENG AI & Robotics Club, published with GitHub Pages. Plain HTML, one stylesheet and one script; no build step. The layout follows the [TAS Lab website](https://polyu-taslab.github.io/).

## Pages

- `index.html` - hero with the four robot platforms, key numbers, research directions, latest news, competition videos, supporting parties and the visitor map.
- `about.html` - who we are, what we do, technical groups and member tiers.
- `projects.html` - cover photo, current projects and how projects are reviewed.
- `news.html` - dated news items with captioned photos, and the photo archive of earlier seasons.
- `team.html` - leadership, co-supervisors, the TAS Lab mentor team, student committee and supporting parties.
- `qa.html` - questions and answers.
- `join.html` - joining steps, member tiers, promotion rules and reviews.
- `events.html`, `past-seasons.html` and `competition.html` - redirects so old links keep working.

Photos of former members appear only on `news.html`.

## Folders

```text
assets/css/styles.css      shared styles
assets/js/site.js          navigation, Q&A accordion, video embeds, visitor map
assets/visitors/           world map data for the visitor map
images/platforms/          home page platform tiles
images/projects/           project cover and cards
images/news/               photos for news items
images/past-seasons/       2025-26 season photos (news page)
images/club/               earlier-season photos (photo archive)
images/people/             320 x 320 portraits for the team page
images/partners/           supporting-party logos and white banner logos
```

## Common edits

- **News item:** add an `<article class="article" id="...">` at the top of the list in `news.html`, add a matching link to the index pills at the top of the page, and replace the oldest item in the home page "Latest News" list.
- **Person:** add a 320 x 320 JPG to `images/people/` and copy an existing `<article class="person">` card in `team.html`. Add the `key` class and the "Lead mentor" tag for lead mentors.
- **Video:** copy a `<figure class="video">` block in `index.html` and change `data-youtube` to the YouTube video ID. The video loads only when clicked.
- **Supporting party:** add a white-background logo to `images/partners/` and an `<li>` to the `logos` lists in `index.html` and `team.html`.
- **Navigation or footer:** the header and footer are repeated in every page; update all pages together.

## Visitor map

The map on the home page uses [GoatCounter](https://www.goatcounter.com/), the same as the TAS Lab site. To turn it on, create a GoatCounter site, create an API key with only "Read statistics" permission, and fill in `goatcounter` and `apiKey` at the top of `assets/js/site.js`. Until then the map shows an empty world map.

## Running locally

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>.

## Deployment

`.github/workflows/deploy-pages.yml` publishes the repository root when changes are pushed to `main`. In **Settings > Pages**, the source must be **GitHub Actions**.
