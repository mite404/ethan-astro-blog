---
title: 'Rust & Polish: Week 04'
pubDate: '2025-10-18'
---

# _Off Balance_

This week I was faced with a realization: two things were contributing to losing
some fundamental fluency with JavaScript.

First, my part time job as a bicycle courier was eating up every spare hour I had
to integrate some of the concepts I'd learned that week into some study sessions.
Second, our weekly projects are so invovled that I haven't had a moment to continue
practicing the basics mixed in with the freshly learned concepts.

All week we had drills, bug fix tasks, puzzle functions and system design tests.
If I passed I could start using AI agents to help iterate on projects faster.
I didn't pass the bug fix, level 1 or level 2 tasks on the first try.
The system design was easier for me, but the nested data type puzzles exposed my
rusty brain.

I wasn't mad at the drills. I enjoyed learning and thought this week was better
than last week's group projects, even. However, I was disappointed to see something
I knew 4-8 weeks ago fall through my hands like tiny grains of sand on a hot beach
littered with disappointments. The fluency I'd worked so hard to build was slipping
already!

Needless to say this week I took a leave from my part-time job. I hadn't had a day
off in four weeks.
My job was also pulling some bullshit with the scheduling so, to be honest
all in all it's a WIN-WIN for me.

## _What I Built Instead_

> _"You can't record music once every three to four years and think that's going to be enough"_
- Daniel Ek, Spotify CEO

Daniel Ek sucks. His VC firm, Prima Materia, has been the primary investor in Helsing,
an AI-powered military drones and battlefield analysis software maker. The template
I've been building my blog off of only supports rendering Spotify links using html
templating directives for use in .md files. I don't want to use Spotify!
So I looked at the Spotify & YouTube directive patterns and tried to make a custom
Apple Music one. I figured it out with a llittle help from Claude, but all in all my
intuition and my understanding of JavaScript and HTML paid off. I now have a working
Apple Music Markdown template, something the package `remark-directive` didn't support!

I'm glad I solved this problem, implemented the feature and can end my support of
Spotify & Daniel Ek. Sure, I didn't pass every drill this week. But I practiced,
took some actionable steps to increase my available study time and built something
that matters to me.

### My Custom Apple Music remark-directive
```jsx
// Apple Music
applemusic: (node) => {
  // Extract attributes from the directive (e.g., ::applemusic{url="https://..."})
  const url = node.attributes?.url ?? ''

  if (!url) {
    return false
  }

  // Validate URL format - must be an Apple Music URL
  if (!/^https:\/\/(music|embed\.music)\.apple\.com\//.test(url)) {
    return false
  }

  // Transform the URL - Example: https://music.apple.com/us/album/... → https://embed.music.apple.com/us/album/...
  let embedUrl = url.replace('music.apple.com/', 'embed.music.apple.com/')

  // Add required query parameters for Apple Music embeds if not present
  if (!embedUrl.includes('itscg=')) {
    embedUrl +=
      (embedUrl.includes('?') ? '&' : '?') +
      'itscg=30200&itsct=music_box_player&ls=1&app=music&theme=auto'
  }

  let height = '175'

  // '?i=' means a single track in Apple Music land...
  if (url.includes('?i=')) {
    height = '175'
  } else if (url.includes('/album/') || url.includes('/playlist/')) {
    height = '450'
  }

  return `
  <figure>
    <iframe
      style="border-radius:12px"
      src="${embedUrl}"
      width="100%"
      height="${height}"
      frameBorder="0"
      allow="autoplay *; encrypted-media *; clipboard-write"
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
      loading="lazy"
    ></iframe>
  </figure>
  `
  }
}
```

### This Week's Theme Song

::applemusic{url="https://music.apple.com/us/album/going-under-main-version-k-d-session-mixed/1613602443?i=1613602748"}

#### B Sides

::applemusic{url="https://music.apple.com/us/album/love-is-not-a-game-dillinja-remix/363726722?i=363726894"}
