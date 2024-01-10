import { useMediaQuery } from "./use-media-query"

export default function useIsDesktop() {
  return useMediaQuery("(min-width: 768px)")
}
