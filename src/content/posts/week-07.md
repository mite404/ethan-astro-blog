---
title: 'The Hidden Superpower of Cross-Domain Pattern Recognition: Week 07'
pubDate: '2025-11-09'
---

# _I solved my setInterval scheduling problem by remembering how Video & Audio timelines work_

Since building a BPM Counter extension in Week-05, I've been building
a beat sequencer. Again I choose a project whose concept was related to music,
something I'm very passionate about, and again I choose something within a limited
scope while still challenging to keep the learning opportunities focused. I didn't
know how I'd deal with the state of 160 cells in a grid and how to manage tempo
dynamically, but I knew being passionate about music would keep it interesting.

Using JavaScript's builtin `setInterval`, a way to track the timing of when sounds should play,
I hit a fundamental limit. Browser timing can drift by 15ms or more per cycle and
over a 4-bar loop, that adds up. In a musical sequence, that's the difference
between locked-in drums and a pattern that slowly slides out of sync. This is the
same issue that drives video editors to use dedicated timecode systems instead
of relying on playback by only counting the frames played.

```typescript
const scheduledEventId = transport.scheduleRepeat((time) => {
  // Callback fires every step
  const stepToPlay = currentStep;
  const activeTrackIds = getActiveSamplesAtStep(stepToPlay, gridRef.current);

  for (const trackId of activeTrackIds) {
    tracks[trackId].player.start(time); // Use Transport time
  }

  Tone.Draw.schedule(() => {
    onStep(stepToPlay);  // Schedule UI update on audio context
  }, time);

  currentStep = (currentStep + 1) % 16;
}, "16n");
```

## Mapping my graphics knowledge to the audio engine

The lifecycle of the state machine (initialize -> subscribe to callback -> clean up on unmount)
is almost identical GPU resource management when rendering sprites on screen with `PixiJS`.

- `transport.scheduleRepeat()` is similar to requestAnimationFrame callback in graphics
- `Tone.Draw.schedule()` this is like syncing the UI to paint to the audio render thread
- `currentStep = (currentStep + 1) % 16` the same mental model I use when working
on music or editing video the frame counter is the playhead position

```typescript
// GPU resource lifecycle (PixiJS)
const renderer = new Renderer(); // init
renderer.render(stage);           // subscribe to frame events
renderer.destroy();               // cleanup

// Audio state machine lifecycle (Tone.js)
const sequencer = createSequencer(); // init
transport.scheduleRepeat(onStep);    // subscribe to tick events
sequencer.dispose();                 // cleanup
```

## _Cross domain fluency is about leveraging overlapping knowledge to gain clarity quickly_

I started this project using JavaScript's builtin `setInterval` knowing I'd
probably have timing issues. Once I hit the timing limits of `setInterval`
I knew I needed to migrate to `Tone.js` for a stable transport.

The pattern isn't unique to audio/video. Anywhere you're managing real-time state
with callbacks (graphics rendering, game loops, websocket event handling) you'll
find this same callback-driven architecture. The superpower is being able to ask:

_"What system am I already fluent in that has the same shape as this problem?"_

Deployed Site:
::link{url="https://tr-08.vercel.app/"}

Source Code:
<!--::github{repo="raycast/extensions/pull/22434"}-->
::github{repo="mite404/tr-08"}

### This Week's Theme Song

::applemusic{url="https://music.apple.com/us/album/all-news-is-good-news/1506231792?i=1506231801"}

### B-Side

::applemusic{url="https://music.apple.com/us/album/marios-lament/1506231792?i=1506232216"}
