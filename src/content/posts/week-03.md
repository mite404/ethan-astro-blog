---
title: 'How I Learned to Stop Memory Leaking and Love Garbage Collection: Week 03'
pubDate: '2025-10-11'
---

# _How I Learned to Stop Memory Leaking and Love Garbage Collection_

Building a tower defense game taught me a harsh lesson about the lifecycle of rendered objects. When I first implemented enemy spawning, I didn't realize that every frame (60 per second) I was creating new enemy sprites with out ever destroying them. Within minutes, my GPU usage spiked to 93% and the frame rate tanked. Their sprites lived on like invisible ghosts stuck within the machine. I had created a memory leak and every despawned enemy was still being rendered off-screen, gobbling up resources like they were power-pills.

The fix required understanding the relationship between game state and rendering state. We weren't feeding the game state fresh data, we weren't calling game state as the result of the loop thus updating the renderer. I learned to remove the enemy entities that reached the path's end by filtering the enemy array from within the updated game state. When I realized that I knew the sprites were still existing within PixiJS' scene. The critical step was adding cleanup logic in my renderer. Before creating spawning new enemy sprites each frame I iterate through existing sprietes and call `sprite.destory()` on any that no longer had corresponding game state entities. I then repeated this pattern with my `renderTower()` function.

**Rendering is not automatic garbage collection!!**

In frameworks like PixiJS, you own the memory. Every new sprite needs a matching `.destory()` method. The GPU useage for our game dropped by about 70%, enemies spawned/despawned cleanly and now I sleep better knowing I'm not a memory leaking rookie.

```markdown
“It can also be argued that DNA is nothing more than
a program designed to preserve itself.”

- Puppet Master, Ghost in the Shell
```

## My Week 01 Project

::github{repo="mite404/fractal-tower-defense-new"}

### This Week's Theme Song

::applemusic{url="https://music.apple.com/us/album/view-from-above/1438158735?i=1438158741"}

#### B Sides

::applemusic{url="https://music.apple.com/us/album/obsession-feat-jenna-g-2020-remaster/1519346791?i=1519347041"}
