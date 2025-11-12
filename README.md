## Developer Portfolio Template (Hugo + PaperMod)

Clean, production-friendly Hugo + PaperMod starter for a personal site (Landing / Blog / Projects / CV). Includes dynamic blog sidebar, environment-based baseURL, and extensible theming.

### Features
* Dynamic blog sidebar: auto-traverses every directory under `content/blog/` (just add folders + `_index.md`).
* Environment-based baseURL: set `SITE_BASE_URL` in `.env` or compose build args; no hardcoded domain.
* Under-construction blog landing placeholder out of the box.
* Collapsible CV sections driven by headings (see `assets/js/cv.js`).
* Optional animated home background.
* Minimal, extensible CSS (`assets/css/extended/`).

### Quick Start

Option A (Hugo CLI):
```bash
hugo server -D
```
Visit: http://localhost:1313

Option B (Docker):
```bash
cp .env.example .env   # then edit SITE_BASE_URL
docker compose up -d --build
```
Visit: http://localhost:1313 (Hugo dev server)

### Production Build
Generate static site:
```bash
hugo --minify
```
Output in `public/`. Serve with any static host (Netlify, GitHub Pages, Nginx, etc.).

### Configuration Overview
File: `hugo.toml`
* `baseURL` is a fallback; Docker run overrides via `SITE_BASE_URL`.
* `[params.profileMode]` controls landing page banner.
* `[[menu.main]]` manages navigation items.
* `[[params.socialIcons]]` add/remove social links.

Env file (`.env.example`):
```
SITE_BASE_URL=https://example.com/
```
Copy to `.env` and adjust domain (must end with slash). Do NOT commit `.env`.

### Dynamic Blog Sidebar
Partial: `layouts/partials/blog/sidebar.html`
Logic:
1. Loads `/blog` section.
2. Iterates all child sections (`Sections.ByTitle`).
3. Renders nested directories and regular pages recursively.
Add new folder:
```bash
mkdir -p content/blog/new-area
cat > content/blog/new-area/_index.md <<'EOF'
---
title: "New Area"
---
EOF
```
Restart dev server — it appears automatically.

### Blog Landing Placeholder
Edit or remove `content/blog/_index.md` to publish real posts. The layout (`layouts/blog/list.html`) shows custom landing content when present; otherwise lists posts.

### CV Page
`content/cv/_index.md` — Use `##` headings. Each becomes a collapsible panel. Behavior implemented in `assets/js/cv.js`.

### Projects Section
Add project folders under `content/projects/` each with its own `_index.md` or Markdown pages. Update menu if you remove the section.

### Theming & Assets
* Colors: `assets/css/extended/custom-colors.css`
* Extra UI tweaks: add new files under `assets/css/extended/`
* JS enhancements: `assets/js/`

### Docker Workflow
Compose file passes `SITE_BASE_URL` for consistent local vs production URL rendering:
```bash
SITE_BASE_URL=https://example.com/ docker compose up -d --build
```
For local dev keep `SITE_BASE_URL=/` (relative) or a staging domain.

### Cleaning / Ignored Artifacts
`.gitignore` excludes: `public/`, `resources/_gen/`, `_build_preview/`, `.env*`. Avoid committing generated output unless you need a non-build host.

### Common Tasks
Rebuild after changing theme or config:
```bash
docker compose up -d --build --force-recreate
```
List sections (debug):
```bash
hugo list all | grep content/blog
```

### Troubleshooting
Sidebar empty? Ensure each folder has an `_index.md` (section front matter). Draft posts (`draft: true`) are excluded unless you run with `-D`.
BaseURL wrong? Confirm `SITE_BASE_URL` has trailing slash and container restarted.
Stale assets? Clear caches: delete `resources/_gen/` and restart.

### License
MIT (adapt as needed).

### Contributing / Forking
1. Fork repo.
2. Replace identity fields in `hugo.toml`.
3. Search and replace any leftover placeholder text.
4. Start writing content.

### Next Ideas
* Add search (Fuse.js integration) indexing real posts.
* Tag cloud partial.
* RSS feed customization.
* Dark/light theme palette tuning.

Enjoy building! PRs welcome.

Customize

1) Site config (hugo.toml)
   - baseURL: set your production URL
   - title: site title
   - [params.profileMode]: landing page title/subtitle and optional image
   - [menu.main]: controls Blog, Projects, About links
   - [params.socialIcons]: uncomment and add your GitHub/LinkedIn/Email

2) Content
   - About/CV: content/cv/_index.md
     - Use second-level headings (##) to create collapsible sections
     - The script at assets/js/cv.js auto-builds collapsible bodies
   - Blog: content/blog/
     - Add Markdown files with front matter (see sample-post.md)
   - Projects: content/projects/
     - Add pages per project (see sample-project.md)

3) Theming and styles
   - Colors: assets/css/extended/custom-colors.css
     - Edit CSS variables under :root and [data-theme="light"]
     - Headings use a gradient accent in dark mode
   - Extra CSS: assets/css/extended/

4) Animated background (home page)
   - JS: assets/js/animated-bg.js
   - CSS: assets/css/extended/animated-bg.css
   - Enable/disable: The script only runs on the home page when a .profile element exists
   - Tuning (in animated-bg.js):
     - lineSpacing: horizontal distance between vertical streams
     - speed: animation speed
     - fontSizeMin/Max: size range per character
     - charSpacingMin/Max: vertical distance between characters (higher = fewer chars)
     - Color logic: each char picks a static color blended between the light theme primary and secondary

5) CV collapsible behavior
   - JS: assets/js/cv.js
   - Author sections with H2 (##) headings. Each becomes a toggleable section.
   - Click to lock open; hover to peek when not locked.

Project structure

- content/
  - blog/      # posts
  - projects/  # project pages
  - cv/        # about/CV page
- assets/
  - css/extended/   # custom CSS
  - js/             # custom JS (animated background, CV)
- layouts/partials/ # theme extensions and asset injection
- static/           # images and static files (profile.jpg optional)

Deploy

- Hugo: hugo --minify
- GitHub Pages / Netlify / Vercel: deploy public/ output
- Docker: build a static image that serves public/ with Nginx (optional)

Housekeeping

- Update .gitignore as needed; generated folders like public/ and resources/_gen are ignored by default.
- Remove sample content in content/blog/sample-post.md and content/projects/sample-project.md when you’re ready.

License

- MIT for this template (update if you prefer another license)
