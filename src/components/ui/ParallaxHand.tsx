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

  // Detect mobile breakpoint (< 768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Measure globe position on mount and resize
  useEffect(() => {
    const calculateGlobePosition = () => {
      const globeContainer = document.querySelector('[data-globe-container]')
      const portfolioLayout = document.querySelector('.portfolio-layout') as HTMLElement | null
      if (globeContainer && portfolioLayout) {
        // getBoundingClientRect returns *visual* (post-transform) pixels, but the
        // hand's `top` is applied INSIDE the scaled poster. Divide by the poster's
        // current scale to convert the globe into the poster's local, un-scaled
        // space — otherwise it's scaled twice and the hand drifts as you resize.
        const posterRect = portfolioLayout.getBoundingClientRect()
        const globeRect = globeContainer.getBoundingClientRect()
        const scale = posterRect.width / portfolioLayout.offsetWidth || 1

        const globeOffsetFromLayout = (globeRect.bottom - posterRect.top) / scale

        if (process.env.NODE_ENV === 'development') {
          console.warn('🖐️ Calculated position:', { globeOffsetFromLayout, scale })
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

  // Don't render until mounted (SSR safety)
  if (!mounted) return null

  // Calculate responsive dimensions: 75% on mobile (< 768px), 100% on desktop
  const scale = isMobile ? 0.75 : 1
  const handWidth = 2875 * scale
  const leftOffset = isMobile ? 100 : 150 // Slightly closer on mobile

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: `translateX(calc(-50% - ${leftOffset}px))`,
        width: `${handWidth}px`,
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
          src={handImg}
          alt=""
          style={{
            display: 'block',
            width: `${handWidth}px`,
            height: 'auto',
            flexShrink: 0 // Prevent flex container from shrinking the image
          }}
        />
      </motion.div>
    </div>
  )
}
