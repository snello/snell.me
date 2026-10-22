# oliver.snell.me

The source for my personal homepage, career history, projects and writing, built with [Hexo](https://hexo.io) and the Snell theme in `themes/snell`.

## Getting started

Clone with the theme submodule:

```sh
git clone --recurse-submodules <repository-url>
cd oliver.snell.me
npm install
```

If you already cloned without submodules:

```sh
git submodule update --init --recursive
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run server` | Serves the site locally at http://localhost:3000 with live reload |
| `npm run build` | Generates the static site into `public/` |
| `npm run clean` | Deletes `public/` and Hexo's cache |

Run `npm run clean` before `npm run build` if you want a fresh output.

> **Warning:** `public/` is generated and gitignored. Do not keep anything you care about in it, because `npm run clean` deletes the whole folder. Put images and other static files in `source/images/` instead, and Hexo copies them into `public/` on each build.

## Content

All content lives in `source/`. Each file's front matter sets its `layout`, which determines how it is rendered.

| Content | Location | Layout | Notes |
| --- | --- | --- | --- |
| Blog posts | `source/_posts/*.md` | `post` (default) | Listed on `/posts/`, newest first |
| Career roles | `source/_posts/*.md` | `job` | Needs `company`, `job_title`, `company_url`, `location`, `date_start`, optional `date_end`, `current_status`, `logo`. Logo files go in `source/images/` |
| Projects | `source/_posts/*.md` | `project` | Listed on `/projects/` |
| Pages | `source/<name>/index.md` | `career`, `projects`, `posts` or `page` | `about`, `career`, `projects` and `posts` are top-level pages |

Post URLs follow `:year/:month/:day/:title/`, so the date in front matter sets the URL.

The homepage is built by the theme from `_config.snell.yml` (hero, intro, highlights, skills) plus the project and role posts. Featured roles are listed by company name under `home.featured_roles`.

### New post

```sh
npx hexo new post "Post title"
```

This creates a file in `source/_posts/` from the template in `scaffolds/post.md`.

### Images

Put images in `source/images/` and reference them with an absolute path:

```markdown
![Alt text](/images/example.jpg)
```

## Navigation

The dock and top bar are set in `theme_config.nav` in `_config.yml`. Labels come from `themes/snell/languages/en.yml`.

## Theme

The site uses the Snell theme in `themes/snell`, built from the "Oliver Snell" design system. It is part of this repository, so commit theme changes here directly. See `themes/snell/README.md` for which front matter each layout reads.

Site content for the theme lives in `_config.snell.yml`. The previous theme, hexo-theme-cactus, is still a submodule at `themes/hexo-theme-cactus`; set `theme: hexo-theme-cactus` in `_config.yml` to switch back.
