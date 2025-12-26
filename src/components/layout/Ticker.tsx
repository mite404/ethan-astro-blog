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
    'Framer Motion'
  ],
  separator = '  |  ',
  speed = 40,
  className = ''
}: TickerProps) {
  const fullText = items.join(separator)
  const repeatedText = `${fullText}${separator}`.repeat(4)
  const [textWidth, setTextWidth] = useState(0)
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
    <div className={`relative w-full overflow-hidden h-[25px] ${className}`}>
      {/* Animated text layer (background) */}
      <div className="absolute inset-0 h-full flex items-center">
        <motion.div
          ref={textRef}
          className="whitespace-nowrap"
          style={{
            fontFamily: 'Aptos Narrow, sans-serif',
            fontStyle: 'italic',
            fontSize: '12px',
            color: '#FFFFFF'
          }}
          animate={{
            x: [0, -textWidth]
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop'
          }}
        >
          {repeatedText}
        </motion.div>
      </div>

      {/* SVG frame layer (foreground) */}
      <img
        src="/assets/portfolio/warning-strip.svg"
        alt=""
        width="1280"
        height="25"
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        style={{ objectFit: 'fill' }}
      />
    </div>
  )
}
