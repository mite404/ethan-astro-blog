import { useState } from 'react'

interface TickerProps {
  items?: string[]
  separator?: string
  speed?: number
  className?: string
}

export default function Ticker({
  items = [
    'TypeScript',
    'JavaScript',
    'Python',
    'React',
    'React Router',
    'Vercel AI SDK',
    'Vercel',
    'Render',
    'Netlify',
    'BetterAuth',
    'OAuth',
    'Tailwind',
    'PostgreSQL',
    'Supabase',
    'Drizzle',
    'Mongo DB',
    'Mongoose',
    'Convex',
    'Figma',
    'Motion React',
    'Google Cloud',
    'Ollama',
    'Claude',
    'Gemini',
    'Amp'
  ],
  separator = '  |  ',
  speed = 40,
  className = ''
}: TickerProps) {
  const [isPaused, setIsPaused] = useState(false)

  const fullText = items.join(separator)
  const repeatedText = `${fullText}${separator}`.repeat(4)

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        height: 'var(--h-ticker)',
        borderLeft: 'var(--border-ticker-h) solid #ffffff',
        borderRight: 'var(--border-ticker-h) solid #ffffff',
        borderTop: 'var(--border-ticker-v) solid #ffffff',
        borderBottom: 'var(--border-ticker-v) solid #ffffff'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Inject keyframes scoped to this component instance */}
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }
      `}</style>

      <div className="absolute inset-0 h-full flex items-center">
        <div
          className="whitespace-nowrap"
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 200,
            fontStyle: 'italic',
            fontSize: 'var(--fs-ticker)',
            color: '#FFFFFF',
            animation: `ticker-scroll ${speed}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {repeatedText}
        </div>
      </div>
    </div>
  )
}
