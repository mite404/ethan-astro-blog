import { motion, useAnimation } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

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
  const fullText = items.join(separator)
  const repeatedText = `${fullText}${separator}`.repeat(4)
  const [textWidth, setTextWidth] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  // Detect mobile breakpoint (< 768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.getBoundingClientRect().width / 4
      setTextWidth(width)
    }
  }, [repeatedText])

  useEffect(() => {
    if (textWidth > 0) {
      controls.start({
        x: [0, -textWidth],
        transition: { duration: speed, repeat: Infinity, ease: 'linear', repeatType: 'loop' }
      })
    }
  }, [textWidth, speed, controls])

  useEffect(() => {
    if (isPaused) controls.pause()
    else controls.play()
  }, [isPaused, controls])

  // Estimate distance (can be refined with useRef + getBoundingClientRect)
  // const estimatedWidth = fullText.length * 8 // ~8px per character

  // Responsive values: mobile vs desktop
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
      {/* Animated text layer */}
      <div className="absolute inset-0 h-full flex items-center">
        <motion.div
          ref={textRef}
          className="whitespace-nowrap"
          animate={controls}
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: '200',
            fontStyle: 'italic',
            fontSize: fontSize,
            color: '#FFFFFF'
          }}
        >
          {repeatedText}
        </motion.div>
      </div>
    </div>
  )
}
