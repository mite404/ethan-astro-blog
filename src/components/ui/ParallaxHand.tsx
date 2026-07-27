import { motion, useScroll, useTransform, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import handImg from '@/images/HAND.svg?url'

export default function ParallaxHand() {
  // State for globe position and mount status
  const [globeOffsetTop, setGlobeOffsetTop] = useState(0)
  const [scrollRange, setScrollRange] = useState({ start: 0, end: 0 })
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track page scroll
  const { scrollY } = useScroll()

  // Transform scroll to Y position
  // The hand SVG scaled 1.7x (2572×1910px) frames the button with thumb reaching globe center
  // Initial: Start hidden below (800px below globe)
  // Final: Thumb tip reaches just past globe center (positioned via negative Y)
  const yRaw = useTransform(scrollY, [scrollRange.start, scrollRange.end], [800, -300])

  // Apply spring physics for smooth easing
  const y = useSpring(yRaw, { stiffness: 100, damping: 30, mass: 1 })

  // matchMedia fires only at the 767px threshold crossing, not on every resize pixel
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // Measure globe position on mount and resize
  useEffect(() => {
    const calculateGlobePosition = () => {
      const globeContainer = document.querySelector('[data-globe-container]')
      const portfolioLayout = document.querySelector('.portfolio-layout') as HTMLElement | null
      if (globeContainer && portfolioLayout) {
        const portfolioRect = portfolioLayout.getBoundingClientRect()
        const globeRect = globeContainer.getBoundingClientRect()
        const globeOffsetFromLayout = globeRect.bottom - portfolioRect.top

        if (process.env.NODE_ENV === 'development') {
          console.warn('🖐️ Calculated position:', { globeOffsetFromLayout })
        }
        setGlobeOffsetTop(globeOffsetFromLayout)

        // Update scroll range
        // Start: when globe bottom is at viewport bottom (globe just entering view)
        // End: bottom of page
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight
        setScrollRange({
          start: 0, // Start animation at top of page
          end: pageHeight // End at bottom of scrollable area
        })
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Globe container [data-globe-container] not found!')
        }
      }
    }

    // Delay calculation to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      calculateGlobePosition()
      setMounted(true)
    }, 100)

    window.addEventListener('resize', calculateGlobePosition)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculateGlobePosition)
    }
  }, [])

  // Don't render until mounted (SSR safety), or on mobile where the hand is absent
  if (!mounted || isMobile) return null

  // 2875px hand at 1280px design → 224.6vw fluid, capped at 2875px
  // Left offset tracks composition: 150px at 1280px → clamp(90px, 11.72vw, 150px)
  const handWidth = 'clamp(1724px, 224.6vw, 2875px)'

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(calc(-50% - clamp(90px, 11.72vw, 150px)))',
        width: handWidth,
        pointerEvents: 'none',
        zIndex: 20
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: globeOffsetTop,
          left: '50%',
          y,
          x: '-50%',
          pointerEvents: 'none',
          willChange: 'transform'
        }}
      >
        <img
          src={handImg}
          alt=""
          style={{
            display: 'block',
            width: handWidth,
            height: 'auto',
            flexShrink: 0
          }}
        />
      </motion.div>
    </div>
  )
}
