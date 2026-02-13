export const projects: Array<Record<string, string>> = [
  {
    title: 'TR-08 Web Sequencer',
    description:
      'A high-precision web audio sequencer using Tone.js, implementing custom logic for event scheduling and transport synchronization to mitigate browser main-thread latency. Custom UI.',
    ghLink: 'https://github.com/mite404/tr-08-agentic',
    liveLink: 'https://tr-08.vercel.app/',
    details: 'TypeScript | React | Tailwind | Supabase | Figma'
  },
  {
    title: "'Tap BPM' - Open Source Raycast Extension",
    description:
      'Engineered and open-sourced a productivity extension using the Raycast API. Optimized user input latency for millisecond-accurate music tempo calculation, handled asynchronous state updates and improved on UX features.',
    ghLink: 'https://github.com/raycast/extensions/pull/24594',
    liveLink: 'https://www.raycast.com/pernielsentikaer/beat-per-minute',
    details: 'TypeScript | React | Raycast API'
  },
  {
    title: 'Portfolio & Blog Site',
    description:
      'Designed this very portfolio website! Combining Astro components, React components and remixing a blog template while hacking together my own Apple Music remark directive because remarkjs only supports Spotify.',
    ghLink: 'https://github.com/mite404/ethan-astro-blog',
    liveLink: 'https://ethananderson.io/',
    details: 'TypeScript | React | Astro | Tailwind | Motion.dev | Figma',
    blogLink: '/week-04/'
  }
]
