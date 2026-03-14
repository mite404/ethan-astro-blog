import { motion } from 'motion/react'
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
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.getBoundingClientRect().width / 4
      setTextWidth(width)
    }
  }, [repeatedText])

  // Estimate distance (can be refined with useRef + getBoundingClientRect)
  // const estimatedWidth = fullText.length * 8 // ~8px per character

  return (
    <div
      className={`relative w-full overflow-hidden h-[25px] ${className}`}
      style={{
        borderLeft: '5.63px solid #ffffff',
        borderRight: '5.63px solid #ffffff',
        borderTop: '1.98px solid #ffffff',
        borderBottom: '1.98px solid #ffffff'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated text layer */}
      <div className="absolute inset-0 h-full flex items-center">
        <motion.div
          ref={textRef}
          className="whitespace-nowrap"
          style={{
            fontFamily: 'Aptos Narrow, sans-serif',
            fontStyle: 'italic',
            fontSize: '.875rem',
            color: '#FFFFFF'
          }}
          animate={{
            x: [0, -textWidth]
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
            paused: isPaused
          }}
        >
          {repeatedText}
        </motion.div>
      </div>
    </div>
  )
}
