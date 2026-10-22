/* global hexo */
'use strict';

/*
 * Helpers for the Snell theme.
 * Icons are the design system's line set: 24px grid, 1.5px stroke, drawn in currentColor.
 */

const ICONS = {
  home: '<path d="M4 10.5 12 4l8 6.5V20h-5v-5.5H9V20H4z"/>',
  terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="m7 10 2.5 2L7 14M12 14.5h5"/>',
  layers: '<path d="M12 3.5 20 8l-8 4.5L4 8z"/><path d="m4 12 8 4.5 8-4.5"/><path d="m4 16 8 4.5 8-4.5"/>',
  file: '<path d="M6 3.5h8l4 4V20.5H6z"/><path d="M14 3.5v4h4M9 12.5h6M9 16h6"/>',
  code: '<path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
  user: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c1.2-3.8 4-5.5 7.5-5.5s6.3 1.7 7.5 5.5"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
  'arrow-down-right': '<path d="M7 7l10 10M17 8.5V17H8.5"/>',
  'arrow-right': '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  'arrow-left': '<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>'
};

// Dock icon for a nav key; anything unknown gets an arrow.
const NAV_ICONS = {
  home: 'home', about: 'user', career: 'briefcase', projects: 'layers', work: 'layers',
  posts: 'file', articles: 'file', writing: 'file', code: 'code', contact: 'mail'
};

hexo.extend.helper.register('snell_icon', function (name, size, title) {
  const s = size || 20;
  const body = ICONS[name] || ICONS['arrow-right'];
  const a11y = title ? `role="img" aria-label="${title}"` : 'aria-hidden="true"';
  return `<svg class="sn-icon" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${body}</svg>`;
});

hexo.extend.helper.register('snell_nav_icon', function (key) {
  return NAV_ICONS[String(key).toLowerCase()] || 'arrow-right';
});

function toDate (d) {
  if (!d) return null;
  if (typeof d.toDate === 'function') d = d.toDate(); // moment
  const date = d instanceof Date ? d : new Date(d);
  return isNaN(date) ? null : date;
}

hexo.extend.helper.register('snell_month_year', function (d) {
  const date = toDate(d);
  return date ? date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : '';
});

hexo.extend.helper.register('snell_year', function (d) {
  const date = toDate(d);
  return date ? String(date.getUTCFullYear()) : '';
});

hexo.extend.helper.register('snell_iso', function (d) {
  const date = toDate(d);
  return date ? date.toISOString().slice(0, 10) : '';
});

// A role is current when it has no end date or its end date is in the future.
hexo.extend.helper.register('snell_is_current', function (post) {
  const end = toDate(post.date_end);
  return !end || end.getTime() > Date.now();
});

// Career roles: posts with a job_title, newest start date first.
hexo.extend.helper.register('snell_jobs', function () {
  return this.site.posts.filter(p => p.job_title).toArray()
    .sort((a, b) => (toDate(b.date_start) || 0) - (toDate(a.date_start) || 0));
});

// Projects: posts with layout project, newest first.
hexo.extend.helper.register('snell_projects', function () {
  return this.site.posts.filter(p => p.layout === 'project').toArray()
    .sort((a, b) => b.date - a.date);
});

// Writing: posts that are neither roles nor projects, newest first.
hexo.extend.helper.register('snell_writing', function () {
  return this.site.posts.filter(p => !p.job_title && p.layout !== 'project').toArray()
    .sort((a, b) => b.date - a.date);
});

// Roles named in theme.home.featured_roles (by company), else the most recent four.
hexo.extend.helper.register('snell_featured_roles', function () {
  const jobs = this.snell_jobs();
  const wanted = (this.theme.home && this.theme.home.featured_roles) || [];
  if (!wanted.length) return jobs.slice(0, 4);
  return wanted.map(name => jobs.find(j => String(j.company).toLowerCase() === String(name).toLowerCase())).filter(Boolean);
});

// The first link in social_links with the given icon.
hexo.extend.helper.register('snell_social', function (icon) {
  const links = this.theme.social_links || [];
  return links.find(l => l.icon === icon);
});

// Page title for <title>: roles use company and job title.
hexo.extend.helper.register('snell_page_title', function () {
  const page = this.page; const site = this.config.title;
  let t = '';
  if (page.job_title) t = `${page.company}, ${page.job_title}`;
  else if (this.is_home()) t = '';
  else if (this.is_tag()) t = `#${page.tag}`;
  else if (this.is_archive()) t = 'Archive';
  else if (page.title) t = page.title.charAt(0).toUpperCase() + page.title.slice(1);
  return t ? `${t} · ${site}` : site;
});

// Strip a leading <h1> from rendered content when the layout already prints the title.
hexo.extend.helper.register('snell_has_h1', function (html) {
  return /^\s*<h1[\s>]/i.test(html || '');
});

hexo.extend.generator.register('snell_404', function () {
  return { path: '404.html', data: { title: 'Not found', __404: true }, layout: ['404'] };
});
