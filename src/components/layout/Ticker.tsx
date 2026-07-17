import { useState, useEffect } from 'react'

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
  const [isMobile, setIsMobile] = useState(false)

  const fullText = items.join(separator)
  const repeatedText = `${fullText}${separator}`.repeat(4)

  // Detect mobile breakpoint (< 768px)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const height = isMobile ? 'h-5' : 'h-6.25'
  const fontSize = isMobile ? '.75rem' : '.875rem'
  const borderWidthH = isMobile ? '3.5px' : '5.63px'
  const borderWidthV = isMobile ? '1.2px' : '1.98px'

  return (
    <div
      className={`relative w-full overflow-hidden ${height} ${className}`}
      style={{
        borderLeft: `${borderWidthH} solid #ffffff`,
        borderRight: `${borderWidthH} solid #ffffff`,
        borderTop: `${borderWidthV} solid #ffffff`,
        borderBottom: `${borderWidthV} solid #ffffff`
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
            fontSize,
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
