import { useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function useCreateSearchParams() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createSearchParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams)

      params.set(key, value)

      if (params.size === 0) return pathname

      return `${pathname}?${params.toString()}`
    },
    [pathname, searchParams]
  )

  return createSearchParams
}
