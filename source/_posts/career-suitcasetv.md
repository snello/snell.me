---
layout: job
company: SuitcaseTV
job_title: Software Engineer
company_url: https://www.suitcasetv.com
location: "Ipswich, United Kingdom"
date_start: 2002-09-01
date_end: 2004-03-01
logo: suitcasetv_logo.jpg
current_status: Ceased Trading
tags:
    - "c++"
    - B2B
    - Hardware
    - "Broadcast Playout"
    - "Audit"
    - "FPGA"
---
After graduating University I went to work for a small start-up called SuitcaseTV, based in my hometown of [Ipswich](https://en.wikipedia.org/wiki/Ipswich). We designed and built hardware/software solutions for the media broadcast industry, foscuing on output logging for regulation and quality control. I tried some FPGA programming, but we had experts who really did that work - I focused on developing the software side of the solution, working in C++ using [Borland C++](https://en.wikipedia.org/wiki/Borland_C%2B%2B). The software application was used to configure the hardware and then to review the stored media, I learned A LOT about MPEG video and audio encoding as well as [text](https://en.wikipedia.org/wiki/Teletext) and [image](https://dvb.org/wp-content/uploads/2019/12/a009_dvb_bitmap_subtitles_nov_2017.pdf) based subtitles.

We had a lead client in Amsterdam as well as some large American broadcasters' European operations. We were small, so I was software developer as well as our sole forward-deployed engineer on client sites. I remember many sleepless nights in various playout studios attempting to make last minute tweaks to our software and FPGA programming. We would often work on new initiatives; two I remember having a lot of fun with were:
1. **Overlaying the scorecard on UEFA Champions League games**. The software enabled a user to increment the score (no decrement - it was before VAR!) but we also pulled live scores from the FTP site of a sport information provider, as it was easy to miss a goal if there were eight games going on at the same time.

2. I also tackled a project to **encode the language of an audio track into the raw audio** without impacting the received quality of the audio. The idea behind this effort was to tag the language of an audio track natively within the sound itself, rather than relying on metadata which can sometimes be lost in the playout chain. It would help identify mistakes where a French language audio track was labelled and delivered as Spanish.  Turns out that it's actually very difficult to add digital bits into analogue signals without it becoming noticable. The challenge was to create spaces between the digital bits and keep them 'quiet' by disguising them in the peaks and troughs of noisy scenes. This approach resulted in a slow drip feed of digital data where a complete digital message could only be reconstructed after 20-30 seconds of audio.
