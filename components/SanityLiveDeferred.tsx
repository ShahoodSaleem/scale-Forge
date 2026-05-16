'use client'

import { useState, useEffect, ReactNode } from 'react'

export default function SanityLiveDeferred({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Delay slightly after mount to ensure first paint is complete
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return null
  }

  return <>{children}</>
}
