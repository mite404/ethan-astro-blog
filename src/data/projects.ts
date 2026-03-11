export interface Project {
  title: string
  description: string
  ghLink: string
  liveLink?: string
  blogLink?: string
  details: string
  image: string
}

export const projects: Project[] = [
  {
    title: 'Claude Agent Dashboard',
    description:
      "Integrated Claude Code's experimental agent teams feature including Pre/PostToolUse, TeammateIdle, and TaskCompleted hooks into a REST API task pipeline, enabling real-time observability into multi-agent task ownership, session events, and cross-agent dependency state.",
    ghLink: 'https://github.com/mite404/claude-agent-dashboard',
    details: 'TypeScript | React | SQLite | Tailwind',
    image: '/assets/portfolio/claude-dashboard.png'
  },
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
    title: 'Open Source Raycast Extension',
    description:
      'Engineered and open-sourced a productivity extension, "Tap BPM", using the Raycast API. Optimized user input latency for millisecond-accurate music tempo calculation, handled asynchronous state updates and improved on UX features. Over 1,800 installs!',
    ghLink: 'https://github.com/raycast/extensions/pull/24594',
    liveLink: 'https://www.raycast.com/pernielsentikaer/beat-per-minute',
    details: 'TypeScript | React | Raycast API',
    image: '/assets/portfolio/beat-per-minute-1.png'
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
