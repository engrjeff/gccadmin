"use client"

import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

function RefreshDataButton() {
  const router = useRouter()

  return (
    <Button
      onClick={router.refresh}
      variant="secondary"
      size="icon"
      className="ml-auto"
    >
      <RefreshCw className="h-4 w-4" /> <span className="sr-only">Refresh</span>
    </Button>
  )
}

export default RefreshDataButton
