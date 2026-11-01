# Astro CV Esquelete

A clean, fast, content-driven CV / resume website built with **Astro**, **Tailwind CSS** and **daisyUI**.

Every section of the page (about, work, studies, projects, certifications, blogs, contact) is a plain Markdown file. Edit Markdown — the page updates itself. No database, no CMS, no rebuild of components required.

- Light / dark daisyUI themes (`lofi`, `black`) with `localStorage` persistence
- Accordion-based single-page layout
- PDF resume viewer and download button
- Content collected automatically from `/src/pages/**/*.md` via `import.meta.glob`
- Static output deployed to GitHub Pages by a GitHub Actions workflow
- Optimized assets via `astro-compress`

## Demo

Live site: [girishlade111.github.io/astro-cv-esquelete](https://girishlade111.github.io/astro-cv-esquelete/)

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | [Astro 5](https://astro.build/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| Components | [daisyUI 4](https://daisyui.com/) |
| Icons | [astro-icon](https://github.com/natemoo-re/astro-icon) + `@iconify-json/carbon`, `@iconify-json/mdi` |
| Font | [DM Sans variable](https://fontsource.org/) via `@fontsource-variable/dm-sans` |
| Theming | [theme-change](https://github.com/benjazehr/theme-change) |
| Build extras | `astro-compress`, `@astrojs/tailwind` |
| Deployment | GitHub Pages via `actions/deploy-pages` |
| Runtime | Node.js >= 22 |

## Requirements

- **Node.js 22 or newer** (`engines.node` in `package.json`, also pinned in `.nvmrc`)
- npm (a `package-lock.json` is committed)

## Getting Started

```bash
git clone https://github.com/girishlade111/astro-cv-esquelete.git
cd astro-cv-esquelete
npm install
npm run dev
```

Dev server runs at `http://localhost:4321`.

## Available Scripts

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server with hot reload at `localhost:4321` |
| `npm run start` | Alias for `npm run dev` |
| `npm run build` | Build the static site to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro` | Run the raw Astro CLI (`npm run astro -- --help`) |

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # Build + deploy to GitHub Pages on push to main
├── public/                     # Static files served as-is
│   ├── cv-20240219.pdf         # Resume shown in the "Files" section
│   ├── favicon.webp
│   └── snap_*.png|webp         # Screenshots used in docs
├── src/
│   ├── assets/
│   │   ├── profile.webp        # Profile picture (optimized by Astro)
│   │   └── gl_flag_128x.png
│   ├── components/
│   │   ├── Card.astro          # Entry card (title, date, tags, link)
│   │   ├── ContactCard.astro   # Icon + link tile for the contact grid
│   │   ├── Container.astro     # Collects all markdown and renders accordions
│   │   ├── Footer.astro
│   │   └── Header.astro        # Avatar, name, role, theme toggle
│   ├── layouts/
│   │   ├── AccordionLayout.astro
│   │   └── BaseLayout.astro    # HTML shell, meta tags, global CSS
│   ├── pages/
│   │   ├── index.astro         # The single page of the site
│   │   ├── about/about.md
│   │   ├── works/*.md
│   │   ├── studies/*.md
│   │   ├── projects/*.md
│   │   ├── certificates/*.md
│   │   ├── blogs/*.md
│   │   └── contact/*.md
│   ├── scripts/theme.js
│   └── env.d.ts
├── astro.config.mjs            # Integrations, static output, site/base for Pages
├── tailwind.config.mjs         # daisyUI themes (lofi + black), fonts
├── tsconfig.json
└── vercel.json
```

## How Content Works

`src/components/Container.astro` globs each content folder at build time:

```ts
const works = Object.values(import.meta.glob("../pages/works/*.md", { eager: true }));
```

Each Markdown file's frontmatter becomes the card metadata, and the Markdown body becomes the card description. To add an entry, drop a new `.md` file into the matching folder. That is all.

### Frontmatter fields

```yaml
---
title: Frontend Developer
date: 2024 - Present
org: Acme Corp          # link label for works/blogs entries
url: https://acme.com   # link target
location: Pune, India
institute: Mumbai University   # link label for studies entries
url_name: Read article         # link label for blogs entries
tags: [Astro, TypeScript]
icon: carbon:email             # used by contact entries
---
Body text in Markdown becomes the card description.
```

Not every field is used by every section. Full mapping:

| Folder | Fields used |
| --- | --- |
| `works/` | `title`, `date`, `tags`, `url`, `org` (as label), `location` |
| `studies/` | `title`, `date`, `location`, `tags`, `url`, `institute` (as label) |
| `projects/` | `title`, `date`, `tags`, `url` (label fixed to "View project") |
| `certificates/` | `title`, `date`, `tags`, `url` (label fixed to "View Certificate") |
| `blogs/` | `title`, `date`, `url`, `url_name` (as label) |
| `contact/` | `title`, `url`, `icon` |
| `about/` | `name`, `designation`, `location`, `pronouns`, `website` (header) + body for the About section |

### Adding or removing a whole section

Open `src/components/Container.astro`:

- **Add:** copy an existing `<AccordionLayout>` block, give it a `title` and a Carbon icon name, and render the matching card component.
- **Remove:** delete or comment out the `<AccordionLayout>` block for that section. The related Markdown folder can then be deleted too.

### Replacing the resume PDF

Replace `public/cv-20240219.pdf` and update the `PDF` constant at the top of `src/components/Container.astro` if you rename it.

### Profile picture and header details

The header reads `name`, `designation`, `pronouns`, `location` and `website` from the frontmatter of `src/pages/about/about.md`. The avatar imports `src/assets/profile.webp` in `src/components/Header.astro`; swap that file to change the photo.

## Theming

Two daisyUI themes are configured in `tailwind.config.mjs`:

- `lofi` — light theme
- `black` — dark theme

Both customize `--rounded-box: 1rem`, `--rounded-btn: 0.5rem`, `--rounded-badge: 1.9rem`.

Theme selection happens in `src/layouts/BaseLayout.astro`: an inline script reads `localStorage.theme` and writes `data-theme` on `<html>`, defaulting to `lofi`. The `theme-change` package is initialised there too, and the toggle in `src/pages/index.astro` (`data-toggle-theme="black,lofi"`) switches themes and persists the choice. To add a theme, extend the `daisyui.themes` array and add its name to the toggle.

Fonts live under `tailwind.config.mjs` → `theme.extend.fontFamily.sans` (`DM Sans`, then `Inter`, then Tailwind defaults).

## Deployment

### GitHub Pages (default)

The site builds to static HTML and deploys with GitHub Actions.

- `astro.config.mjs` sets `output: "static"`, `site: "https://girishlade111.github.io"` and `base: "/astro-cv-esquelete"` for the project-page URL.
- `.github/workflows/deploy.yml` runs on every push to `main`: `npm ci` → `npm run build` → `actions/upload-pages-artifact` → `actions/deploy-pages`.
- Repository → **Settings → Pages → Build and deployment → Source** must be **GitHub Actions** (already configured for this repo).

The workflow needs these permissions, declared in the file:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

Live URL: `https://girishlade111.github.io/astro-cv-esquelete/`

Any asset referenced by an absolute path must include the base:

```astro
const PDF = `${import.meta.env.BASE_URL}/cv-20240219.pdf`;
```

### User or custom-domain Pages site

When serving from `https://<user>.github.io/` or a custom domain, remove `base` from `astro.config.mjs` (and update `site`). Absolute asset paths then resolve from the root.

### Other static hosts (Netlify, Cloudflare Pages, S3)

Run `npm run build` and deploy the generated `dist/` folder. Set `site` / `base` in `astro.config.mjs` to match the host URL and sub-path.

### Vercel

`vercel.json` and the `@astrojs/vercel` dependency are still present from the original template, but nothing requires them for a static build: import the repo in Vercel and it will run `npm run build` and serve `dist/`.

## Build Notes

- `astro-compress` minifies HTML, CSS and JS during build.
- `@astrojs/tailwind` applies Tailwind through the Astro pipeline; there is no separate PostCSS config to maintain.
- `node_modules/`, `dist/`, `.astro/`, `.vercel/` and `.env*` files are ignored by `.gitignore`.

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| `Unsupported engine` warning on install | Node is older than 22. Install Node 22+ or run `nvm use`. |
| A new Markdown file does not appear | File must be directly inside its section folder and use a `.md` extension; restart `npm run dev` if the glob cache is stale. |
| Card link renders without a label | The section expects a specific label field (`org`, `institute`, `url_name`). Check the field mapping table above. |
| Theme does not persist | `theme-change` must run client-side; ensure the toggle in `src/pages/index.astro` keeps `data-toggle-theme` and `localStorage` is not blocked. |
| Assets 404 after deploying to a sub-path | Absolute `/file.ext` paths bypass `base`. Build them from `import.meta.env.BASE_URL`. |
| Pages deploy job fails on permissions | Check **Settings → Pages → Source = GitHub Actions** and the `pages: write` + `id-token: write` permissions in `deploy.yml`. |

## License

Released under the MIT License. See [LICENSE](./LICENSE).

## Acknowledgments

Based on [Astro-Vitae](https://github.com/USKhokhar/astro-vitae) by [@USKhokhar](https://github.com/USKhokhar), and on the original [astro-cv-esquelete](https://github.com/mmouzo/astro-cv-esquelete) template by [@mmouzo](https://github.com/mmouzo).
