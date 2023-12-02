"use client"

import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

import { Button } from "./ui/button"

function RefreshButton() {
  const router = useRouter()
  return (
    <Button
      onClick={router.refresh}
      title="refresh"
      size="icon"
      variant="ghost"
      aria-label="refresh"
    >
      <RefreshCw className="h-4 w-4" />
    </Button>
  )
}

export default RefreshButton
