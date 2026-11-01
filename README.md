# Astro CV Esquelete

A clean, fast, content-driven CV / resume website built with **Astro**, **Tailwind CSS** and **daisyUI**.

Every section of the page (about, work, studies, projects, certifications, blogs, contact) is a plain Markdown file. Edit Markdown — the page updates itself. No database, no CMS, no rebuild of components required.

- Light / dark daisyUI themes (`lofi`, `black`) applied from `localStorage`
- Accordion-based single-page layout
- PDF resume viewer and download button
- Content collected automatically from `/src/pages/**/*.md` via `import.meta.glob`
- Server output ready for Vercel, plus full static build support
- Optimized assets via `astro-compress`

## Demo

Live preview: [astro-cv-esquelete.vercel.app](https://astro-cv-esquelete.vercel.app/)

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | [Astro 5](https://astro.build/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| Components | [daisyUI 4](https://daisyui.com/) |
| Icons | [astro-icon](https://github.com/natemoo-re/astro-icon) + `@iconify-json/carbon`, `@iconify-json/mdi` |
| Font | [DM Sans variable](https://fontsource.org/) via `@fontsource-variable/dm-sans` |
| Theming | [theme-change](https://github.com/benjazehr/theme-change) |
| Build extras | `astro-compress`, `@astrojs/tailwind`, `@astrojs/vercel` |
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
| `npm run build` | Build production output (`./dist/` for static, Vercel function bundle for server) |
| `npm run preview` | Preview the production build locally |
| `npm run astro` | Run the raw Astro CLI (`npm run astro -- --help`) |

## Project Structure

```text
.
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
├── astro.config.mjs            # Integrations, adapter, output mode
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

Theme selection happens in `src/layouts/BaseLayout.astro`: an inline script reads `localStorage.theme` and writes `data-theme` on `<html>`, defaulting to `lofi`. The `theme-change` package is initialised there too, so any element using `data-toggle-theme` will switch themes and persist the choice. To add a theme, extend the `daisyui.themes` array and add its name to the switch.

Fonts live under `tailwind.config.mjs` → `theme.extend.fontFamily.sans` (`DM Sans`, then `Inter`, then Tailwind defaults).

## Deployment

### Vercel

`astro.config.mjs` uses `output: "server"` with the `@astrojs/vercel` adapter, and `vercel.json` declares the framework, install and build commands.

1. Push the repo to GitHub.
2. Import it in Vercel.
3. Deploy — no environment variables required.

### Static hosting (Netlify, GitHub Pages, Cloudflare Pages, S3)

The site does not use server-side rendering. Switch to static output:

```js
// astro.config.mjs
export default defineConfig({
  integrations: [tailwind(), icon(), compress()],
  output: "static",
});
```

Then run `npm run build` and deploy the generated `dist/` folder. Note that `site` / `base` may need to be set for project-style GitHub Pages URLs.

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
| Theme does not persist | `theme-change` must run client-side; ensure no `data-toggle-theme` element lost its attributes and `localStorage` is not blocked. |
| Vercel build fails on PDF or images | Confirm binary assets were committed (no Git LFS filter issues). |

## License

Released under the MIT License. See [LICENSE](./LICENSE).

## Acknowledgments

Based on [Astro-Vitae](https://github.com/USKhokhar/astro-vitae) by [@USKhokhar](https://github.com/USKhokhar), and on the original [astro-cv-esquelete](https://github.com/mmouzo/astro-cv-esquelete) template by [@mmouzo](https://github.com/mmouzo).
