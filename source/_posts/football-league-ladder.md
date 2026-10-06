---
layout: project
title: Football League Ladder
date: 2025-10-06
repository: https://github.com/snello/League-Table-Ladder
live_url: https://oliver.snell.me/projects/league-ladder
description: Football/Soccer League tables as a ladder
tags:
    - HTML/CSS
    - JavaScript
    - Node.js (Backend scripts)
    - APIs
    - Sports Analytics
---

# Motivation

I have always thought about how a football league table would look if it was presented as a ladder of points that each team is climbing. This would reveal just how far apart teams are, especially useful later in the season as you begin to see packs of teams begin to separate from each other (the figurative "mid-table").

Taking it further, I added (very) simple prediction based on recent form, to help vizualize what might happen during the run in at the end of the season.

# Approach

 I built this very simply, as an SPA, backed by static data files. There is simply one file (index.html) that loads the data files and presents the ladder. All of this is delivered from S3, via a CloudFront distribution.

 On the backend, I have a Raspberry Pi which runs every evening to update the data files, push them to S3 and invalidate the correct paths in CloudFront.

## Frontend**
- **HTML & Plain Javascript**: Clean, simple and easy to deploy.
- **Responsive Design**: Works well on desktop and mobile devices for on-the-go league checks

## Backend**
- **Node.js**: Scripts pull the data from a third-party API (Thank you [Football Data](https://www.football-data.org/)), and re-index it for our usage.
- **Bash Scripts**: A bash script pulls the authentication credentials from a secure store, sets the env and executes the Nodejs script over a list of global leagues.
- **Crontab**: Runs every night to update data for all monitored leagues.

## Key Features
- **Multi-League Support**: View standings for multiple football leagues (Premier League, Bundesliga, La Liga, Serie A, etc.)
- **Season Selection**: Switch between different seasons within each league
- **Team Badges**: Display team crests/logos downloaded from official sources
- **Position Indicators**: Clear position badges on each team showing their current ranking
- **League Qualification Zones**: Color-coded zones indicating promotion (Champions League, Europa League) and relegation positions
- **Safety Thresholds**: Visual markers showing:
  - Safety line (points-based safety)
  - Safety by form line (recent results-based safety)
  - Wisdom line (40-point threshold marker)
- **Team Status Indicators**: Visual badges showing champion and relegated teams
- **Form History**: Recent match results (wins, draws, losses) for each team
- **Team Statistics**: Display of:
  - Points
  - Games played
  - Wins, draws, losses
  - Goals for / against
  - Goal difference
- **Interactive UI**: Hover animations and smooth transitions for team cards
- **CDN Deployment**: Hosted on AWS S3 with CloudFront CDN for fast global delivery
