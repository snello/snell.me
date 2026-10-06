---
layout: project
title: Personal Website
date: 2025-10-06
repository: https://github.com/snello/snell.me
live_url: https://oliver.snell.me
description: This personal homepage and blog
tags:
    - Hexo
    - JavaScript
    - Web Design
    - Static Site Generator
---

## Motivation

I wanted a clean, minimal space on the web where I could share my thoughts, projects, and career journey. A personal website serves as a central hub for my online presence.

## Approach

The site is built with [Hexo](https://hexo.io/), a fast and simple static site generator. It uses the Cactus theme as a base, customized to fit my needs. The architecture is straightforward:

- **Static Generation**: Hexo generates static HTML from markdown files, making it fast and secure
- **Custom Layouts**: Created custom layouts for different content types - job posts for career history, projects for showcasing work
- **Responsive Design**: The site adapts seamlessly across different device sizes
- **Easy Deployment**: Hosted in Amazon S3 and fronted by an Amazon CloudFront distribution, making updates as simple as pushing to Git

The site organizes content into sections:
- **Home**: Quick introduction and featured posts
- **About**: My background and journey in technology
- **Career**: Detailed timeline of my professional experience
- **Projects**: Showcases of the things I've built

## Key Features

- **Blog and Project Listing**: Easy to add new posts and projects with markdown
- **Tagging System**: Posts and projects are tagged with technologies and topics
- **Static and Fast**: No database or server-side processing needed
- **Version Controlled**: All content lives in Git for easy updates and history
