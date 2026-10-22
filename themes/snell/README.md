# Snell

A Hexo theme for oliver.snell.me, built from the "Oliver Snell" design system: grayscale, editorial type in DM Sans and DM Mono, one blue accent, a floating dock for navigation.

## Use

In the site's `_config.yml`:

```yaml
theme: snell
```

Site-specific content (hero statement, highlights, skills, intros) lives in `_config.snell.yml` at the site root. `nav` and `social_links` are read from `theme_config` in `_config.yml`.

## What each layout renders

| Content | Front matter | Rendered by |
| --- | --- | --- |
| Home (`/`) | `home:` in `_config.snell.yml` | `index.ejs`. `source/index.md` renders the same page, so either route gives the same result |
| Pages (`source/<name>/index.md`) | `title` | `page.ejs`. If the Markdown starts with `# Heading`, that heading is the page title |
| Career list | `layout: career` | every post with `job_title`, newest `date_start` first |
| Role | `layout: job`, `company`, `job_title`, `company_url`, `location`, `date_start`, `date_end`, `current_status`, `logo`, `tags` | `job.ejs`. A role with no `date_end`, or one in the future, shows "Present" |
| Projects list | `layout: projects` | every post with `layout: project`, newest first |
| Project | `layout: project`, `description`, `repository`, `live_url`, optional `image` | `project.ejs`. Without `image`, its card is typographic |
| Writing list | `layout: posts` | every post that is neither a role nor a project |
| Post | `title`, `date`, `tags`, optional `description`, `photos` | `post.ejs` |
| Tags, archives, 404 | | `tag.ejs`, `archive.ejs`, `404.ejs` |

Intros for the career, projects and writing pages come from `career.intro`, `projects.intro` and `posts.intro` in `_config.snell.yml`; when empty, the page's own Markdown body is used.

## Styles

`source/css/tokens.css` mirrors the design system's `tokens.json`. Change a value in the design system first, then here. `source/css/theme.css` uses only those custom properties.

Icons are drawn by the `snell_icon(name, size)` helper in `scripts/helpers.js`. `user` and `briefcase` were added for the About and Career dock buttons and are not yet in the design system.
