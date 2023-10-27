"use client"

import { useCallback, useEffect, useState } from "react"

export const useMediaQuery = (width:number) =>
{
  const [isMobile, setIsMobile] = useState(false)

  const updateTarget = useCallback((e:MediaQueryListEvent) =>
  {
    if (e.matches) setIsMobile(true)
    else setIsMobile(false)
  }, [])

  useEffect(() =>
  {
    const media = window.matchMedia(`(max-width: ${width}px)`)
    media.addEventListener('change', updateTarget)

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) setIsMobile(true)

    return () => media.removeEventListener('change', updateTarget)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isMobile
}