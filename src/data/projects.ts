export const projects: Array<Record<string, string>> = [
  {
    title: 'TR-08 Web Sequencer',
    description:
      'A high-precision web audio sequencer using Tone.js, implementing custom logic for event scheduling and transport synchronization to mitigate browser main-thread latency. Custom UI.',
    ghLink: 'https://github.com/mite404/tr-08-agentic',
    liveLink: 'https://tr-08.vercel.app/',
    details: 'TypeScript | React | Tailwind | Supabase | Figma',
    image: '/assets/portfolio/tr-08.png'
  },
  {
    title: "'Tap BPM' - Open Source Raycast Extension",
    description:
      'Engineered and open-sourced a productivity extension using the Raycast API. Optimized user input latency for millisecond-accurate music tempo calculation, handled asynchronous state updates and improved on UX features. Over 1,800 installs!',
    ghLink: 'https://github.com/raycast/extensions/pull/24594',
    liveLink: 'https://www.raycast.com/pernielsentikaer/beat-per-minute',
    details: 'TypeScript | React | Raycast API',
    image: '/assets/portfolio/beat-per-minute-1.png'
  },
  {
    title: 'Portfolio & Blog Site',
    description:
      'Designed this very portfolio website! Combining Astro components, React components and remixing a blog template while hacking together my own Apple Music remark directive because remarkjs only supports Spotify.',
    ghLink: 'https://github.com/mite404/ethan-astro-blog',
    liveLink: 'https://ethananderson.io/',
    details: 'TypeScript | Astro | React | Tailwind | Motion React | Figma',
    blogLink: '/week-04/',
    image: '/assets/portfolio/portfolio-site.png'
  },
  {
    title: 'Phillips Corp. LMS',
    description:
      'Architected and deployed a full-stack Learning Management System MVP in a high-velocity 2-week sprint, engineering a custom data model and middleware layer to integrate legacy LMS APIs. Modernized legacy education workflows by collaborating on a redesigned, user-centric flow and implementing an intuitive "Drag-and-Drop" Program Builder',
    ghLink: 'https://github.com/mite404/phillips-poc-public',
    liveLink: 'https://phillips-poc-public.vercel.app/',
    details: 'TypeScript | React | Tailwind | shadcn/ui',
    image: '/assets/portfolio/phillips-poc.png'
  }
]
