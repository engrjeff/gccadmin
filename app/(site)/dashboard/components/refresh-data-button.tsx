"use client"

import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

function RefreshDataButton() {
  const router = useRouter()

  return (
    <Button onClick={router.refresh} size="sm">
      <RefreshCw className="mr-2 h-4 w-4" /> Refresh
    </Button>
  )
}

export default RefreshDataButton
