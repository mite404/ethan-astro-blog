import { motion, useScroll, useTransform, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'

export default function ParallaxHand() {
  // State for globe position and mount status
  const [globeOffsetTop, setGlobeOffsetTop] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Track page scroll
  const { scrollY } = useScroll()

  // Calculate scroll range dynamically
  // We need to calculate when the globe bottom enters the viewport
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0
  const pageScrollHeight =
    typeof document !== 'undefined' ? document.documentElement.scrollHeight - viewportHeight : 0

  // Calculate the absolute position of the globe bottom from page top
  const globeBottomAbsolute =
    globeOffsetTop +
    (typeof document !== 'undefined'
      ? document.querySelector('.portfolio-layout')?.offsetTop || 0
      : 0)

  // Start animating when the globe's bottom edge enters the viewport (from below)
  // This happens when scrollY reaches: globeBottom - viewportHeight
  const scrollRange = {
    start: globeBottomAbsolute - viewportHeight,
    end: pageScrollHeight
  }

  // Transform scroll to Y position
  // The hand SVG scaled 1.7x (2572×1910px) frames the button with thumb reaching globe center
  // Initial: Start hidden below (800px below globe)
  // Final: Thumb tip reaches just past globe center (positioned via negative Y)
  const yRaw = useTransform(scrollY, [scrollRange.start, scrollRange.end], [800, -300])

  // Apply spring physics for smooth easing
  const y = useSpring(yRaw, { stiffness: 100, damping: 30, mass: 1 })

  // Measure globe position on mount and resize
  useEffect(() => {
    const calculateGlobePosition = () => {
      const globeContainer = document.querySelector('[data-globe-container]')
      if (globeContainer) {
        const rect = globeContainer.getBoundingClientRect()
        const scrollTop = window.scrollY || window.pageYOffset
        const globeBottomFromPageTop = rect.bottom + scrollTop

        // Find the .portfolio-layout container
        const portfolioLayout = document.querySelector('.portfolio-layout')
        const layoutOffsetTop = portfolioLayout ? portfolioLayout.offsetTop : 0

        // Calculate globe position relative to .portfolio-layout
        const globeOffsetFromLayout = globeBottomFromPageTop - layoutOffsetTop

        setGlobeOffsetTop(globeOffsetFromLayout)
      }
    }

    calculateGlobePosition()
    setMounted(true)

    window.addEventListener('resize', calculateGlobePosition)
    return () => window.removeEventListener('resize', calculateGlobePosition)
  }, [])

  // Don't render until mounted (SSR safety)
  if (!mounted) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(calc(-50% - 150px))', // Center, then shift 150px left
        width: '2875px', // Hand scaled 1.7x (1513 * 1.7) to match Figma composition
        pointerEvents: 'none',
        zIndex: 20
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: globeOffsetTop,
          left: '50%',
          y, // Motion's animated Y transform (660px → 288px)
          x: '-50%', // Center horizontally
          pointerEvents: 'none',
          willChange: 'transform' // GPU acceleration
        }}
      >
        <img
          src="/assets/portfolio/HAND.svg"
          alt=""
          style={{
            display: 'block',
            width: '2875px', // 1.4x scale (1513 * 1.4) to match Figma composition
            height: 'auto',
            flexShrink: 0 // Prevent flex container from shrinking the image
          }}
        />
      </motion.div>
    </div>
  )
}
